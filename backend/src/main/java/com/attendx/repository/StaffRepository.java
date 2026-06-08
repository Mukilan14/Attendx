package com.attendx.repository;

import com.attendx.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffId(String staffId);
    Optional<Staff> findByStaffIdAndDobAndRole(String staffId, LocalDate dob, Staff.StaffRole role);
    boolean existsByStaffId(String staffId);

    List<Staff> findByDepartmentCode(String deptCode);
    List<Staff> findByDepartmentCodeAndRole(String deptCode, Staff.StaffRole role);

    @Query("SELECT COUNT(s) FROM Staff s WHERE s.departmentCode = :code")
    long countByDepartmentCode(@Param("code") String code);
}
