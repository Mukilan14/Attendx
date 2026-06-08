package com.attendx.service;

import com.attendx.dto.ApprovalRequest;
import com.attendx.dto.OdLeaveDto;
import com.attendx.dto.OdLeaveRequestDto;
import com.attendx.entity.Attendance;
import com.attendx.entity.OdLeaveRequest;
import com.attendx.entity.OdLeaveRequest.ApprovalStatus;
import com.attendx.entity.Student;
import com.attendx.repository.AttendanceRepository;
import com.attendx.repository.OdLeaveRepository;
import com.attendx.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OdLeaveService {

    private final OdLeaveRepository odRepo;
    private final StudentRepository studentRepo;
    private final AttendanceRepository attendanceRepo;
    private final AttendanceService attendanceService;

    public OdLeaveService(OdLeaveRepository odRepo,
                          StudentRepository studentRepo,
                          AttendanceRepository attendanceRepo,
                          AttendanceService attendanceService) {
        this.odRepo            = odRepo;
        this.studentRepo       = studentRepo;
        this.attendanceRepo    = attendanceRepo;
        this.attendanceService = attendanceService;
    }

    public OdLeaveDto submit(String regNo, OdLeaveRequestDto req) {
        OdLeaveRequest entity = new OdLeaveRequest();
        entity.setRegNo(regNo);
        entity.setRequestType(OdLeaveRequest.RequestType.valueOf(req.getType()));
        entity.setFromDate(LocalDate.parse(req.getFromDate()));
        entity.setToDate(LocalDate.parse(req.getToDate()));
        entity.setReason(req.getReason());
        return toDto(odRepo.save(entity));
    }

    public List<OdLeaveDto> getMyRequests(String regNo) {
        return odRepo.findByRegNoOrderByCreatedAtDesc(regNo)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<OdLeaveDto> getPendingForRole(String role, String dept,
                                               Integer year, String section) {
        int y = (year != null) ? year : 1;
        String s = (section != null) ? section : "A";
        List<OdLeaveRequest> list = switch (role) {
            case "mentor"         -> odRepo.findPendingForMentor(dept, y, s);
            case "class_incharge" -> odRepo.findPendingForCI(dept, y, s);
            case "hod"            -> odRepo.findPendingForHOD(dept);
            default               -> List.of();
        };
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<OdLeaveDto> getAllByDept(String dept) {
        return odRepo.findAllByDept(dept)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public OdLeaveDto getById(Long id) {
        return toDto(odRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id)));
    }

    public long countPendingForHOD(String dept) {
        return odRepo.countPendingForHOD(dept);
    }

    @Transactional
    public OdLeaveDto processApproval(Long id, String role,
                                       String approverBy, ApprovalRequest req) {
        OdLeaveRequest entity = odRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        boolean approve = "approve".equalsIgnoreCase(req.getAction());
        ApprovalStatus status = approve ? ApprovalStatus.approved : ApprovalStatus.rejected;

        switch (role) {
            case "mentor" -> {
                entity.setMentorStatus(status);
                entity.setMentorNote(req.getNote());
                entity.setMentorBy(approverBy);
                entity.setMentorAt(LocalDateTime.now());
                if (!approve) entity.setStatus(ApprovalStatus.rejected);
            }
            case "class_incharge" -> {
                entity.setCiStatus(status);
                entity.setCiNote(req.getNote());
                entity.setCiBy(approverBy);
                entity.setCiAt(LocalDateTime.now());
                if (!approve) entity.setStatus(ApprovalStatus.rejected);
            }
            case "hod" -> {
                entity.setHodStatus(status);
                entity.setHodNote(req.getNote());
                entity.setHodBy(approverBy);
                entity.setHodAt(LocalDateTime.now());
                if (approve) {
                    entity.setStatus(ApprovalStatus.approved);
                    applyOdDaysToAttendance(entity);
                } else {
                    entity.setStatus(ApprovalStatus.rejected);
                }
            }
            default -> throw new RuntimeException("Unknown role: " + role);
        }

        return toDto(odRepo.save(entity));
    }

    private void applyOdDaysToAttendance(OdLeaveRequest req) {
        Student stu = studentRepo.findByRegNo(req.getRegNo()).orElse(null);
        if (stu == null) return;

        LocalDate d = req.getFromDate();
        LocalDate end = req.getToDate();
        while (!d.isAfter(end)) {
            final LocalDate date = d;
            attendanceRepo.findByRegNoAndAttendanceDate(req.getRegNo(), date)
                    .ifPresentOrElse(
                        att -> { att.setStatus(Attendance.AttendanceStatus.OD); attendanceRepo.save(att); },
                        () -> {
                            Attendance att = new Attendance();
                            att.setRegNo(req.getRegNo());
                            att.setAttendanceDate(date);
                            att.setStatus(Attendance.AttendanceStatus.OD);
                            att.setMarkedBy("SYSTEM-OD");
                            att.setDepartmentCode(stu.getDepartmentCode());
                            att.setYear(stu.getYear());
                            att.setSection(stu.getSection());
                            attendanceRepo.save(att);
                        }
                    );
            d = d.plusDays(1);
        }
        attendanceService.recalcStudent(req.getRegNo());
    }

    private OdLeaveDto toDto(OdLeaveRequest e) {
        OdLeaveDto dto = new OdLeaveDto();
        dto.setId(e.getId());
        dto.setRegNo(e.getRegNo());
        dto.setType(e.getRequestType().name());
        dto.setFromDate(e.getFromDate());
        dto.setToDate(e.getToDate());
        dto.setReason(e.getReason());
        dto.setStatus(e.getStatus().name());
        dto.setMentorStatus(e.getMentorStatus().name());
        dto.setMentorNote(e.getMentorNote());
        dto.setMentorBy(e.getMentorBy());
        dto.setCiStatus(e.getCiStatus().name());
        dto.setCiNote(e.getCiNote());
        dto.setCiBy(e.getCiBy());
        dto.setHodStatus(e.getHodStatus().name());
        dto.setHodNote(e.getHodNote());
        dto.setHodBy(e.getHodBy());
        dto.setCreatedAt(e.getCreatedAt());
        studentRepo.findByRegNo(e.getRegNo()).ifPresent(s -> {
            dto.setStudentName(s.getName());
            dto.setDepartmentCode(s.getDepartmentCode());
            dto.setYear(s.getYear());
            dto.setSection(s.getSection());
        });
        return dto;
    }
}
