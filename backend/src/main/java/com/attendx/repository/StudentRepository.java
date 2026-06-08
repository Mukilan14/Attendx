package com.attendx.repository;

import com.attendx.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRegNo(String regNo);
    Optional<Student> findByRegNoAndDob(String regNo, LocalDate dob);
    boolean existsByRegNo(String regNo);

    List<Student> findByDepartmentCode(String deptCode);
    List<Student> findByDepartmentCodeOrderByYearAscSectionAscNameAsc(String deptCode);
    List<Student> findByDepartmentCodeAndYearAndSection(String deptCode, Integer year, String section);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.departmentCode = :code")
    long countByDepartmentCode(@Param("code") String code);

    @Query("SELECT AVG(s.attendancePct) FROM Student s WHERE s.departmentCode = :code")
    Double avgAttendanceByDept(@Param("code") String code);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.departmentCode = :code AND s.attendancePct < 75")
    long countBelow75(@Param("code") String code);
}
