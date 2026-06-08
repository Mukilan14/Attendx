package com.attendx.service;

import com.attendx.dto.AttendanceDto;
import com.attendx.dto.MarkAttendanceRequest;
import com.attendx.entity.Attendance;
import com.attendx.repository.AttendanceRepository;
import com.attendx.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepo;
    private final StudentRepository    studentRepo;

    public AttendanceService(AttendanceRepository attendanceRepo,
                              StudentRepository studentRepo) {
        this.attendanceRepo = attendanceRepo;
        this.studentRepo    = studentRepo;
    }

    @Transactional
    public int markAttendance(MarkAttendanceRequest req, String markedBy,
                               String dept, Integer year, String section) {
        LocalDate date = LocalDate.parse(req.getDate());
        int saved = 0;

        for (var entry : req.getRecords()) {
            Optional<Attendance> existing =
                    attendanceRepo.findByRegNoAndAttendanceDate(entry.getRegNo(), date);
            Attendance att = existing.orElse(new Attendance());
            att.setRegNo(entry.getRegNo());
            att.setAttendanceDate(date);
            att.setStatus(Attendance.AttendanceStatus.valueOf(entry.getStatus()));
            att.setMarkedBy(markedBy);
            att.setDepartmentCode(dept);
            att.setYear(year);
            att.setSection(section);
            attendanceRepo.save(att);
            saved++;
        }

        req.getRecords().forEach(r -> recalcStudent(r.getRegNo()));
        return saved;
    }

    public void recalcStudent(String regNo) {
        List<Attendance> all = attendanceRepo.findByRegNo(regNo);
        int total    = all.size();
        int attended = (int) all.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.Present
                          || a.getStatus() == Attendance.AttendanceStatus.OD)
                .count();
        double pct = total == 0 ? 100.0 : (attended * 100.0 / total);

        studentRepo.findByRegNo(regNo).ifPresent(s -> {
            s.setTotalClasses(total);
            s.setAttendedClasses(attended);
            s.setAttendancePct(BigDecimal.valueOf(pct).setScale(2, RoundingMode.HALF_UP));
            studentRepo.save(s);
        });
    }

    public List<AttendanceDto> getStudentAttendance(String regNo) {
        return attendanceRepo.findByRegNoOrderByAttendanceDateDesc(regNo)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<AttendanceDto> getDeptAttendance(String dept) {
        return attendanceRepo.findByDepartmentCodeOrderByAttendanceDateDesc(dept)
                .stream().map(a -> {
                    AttendanceDto dto = toDto(a);
                    studentRepo.findByRegNo(a.getRegNo())
                            .ifPresent(s -> dto.setStudentName(s.getName()));
                    return dto;
                }).collect(Collectors.toList());
    }

    public List<AttendanceDto> getClassAttendance(String dept, Integer year, String section) {
        return attendanceRepo
                .findByDepartmentCodeAndYearAndSectionOrderByAttendanceDateDesc(dept, year, section)
                .stream().map(a -> {
                    AttendanceDto dto = toDto(a);
                    studentRepo.findByRegNo(a.getRegNo())
                            .ifPresent(s -> dto.setStudentName(s.getName()));
                    return dto;
                }).collect(Collectors.toList());
    }

    private AttendanceDto toDto(Attendance a) {
        AttendanceDto dto = new AttendanceDto();
        dto.setId(a.getId());
        dto.setRegNo(a.getRegNo());
        dto.setAttendanceDate(a.getAttendanceDate());
        dto.setStatus(a.getStatus().name());
        dto.setMarkedBy(a.getMarkedBy());
        return dto;
    }
}
