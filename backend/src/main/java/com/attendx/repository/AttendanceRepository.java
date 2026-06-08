package com.attendx.repository;

import com.attendx.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByRegNoOrderByAttendanceDateDesc(String regNo);
    List<Attendance> findByRegNo(String regNo);

    List<Attendance> findByDepartmentCodeAndYearAndSectionAndAttendanceDateOrderByRegNoAsc(
        String deptCode, Integer year, String section, LocalDate date);

    List<Attendance> findByDepartmentCodeOrderByAttendanceDateDesc(String deptCode);
    List<Attendance> findByDepartmentCodeAndYearAndSectionOrderByAttendanceDateDesc(
        String deptCode, Integer year, String section);

    Optional<Attendance> findByRegNoAndAttendanceDate(String regNo, LocalDate date);
}
