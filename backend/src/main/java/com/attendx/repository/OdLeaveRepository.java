package com.attendx.repository;

import com.attendx.entity.OdLeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OdLeaveRepository extends JpaRepository<OdLeaveRequest, Long> {

    List<OdLeaveRequest> findByRegNoOrderByCreatedAtDesc(String regNo);

    @Query(value = """
        SELECT o.* FROM od_leave_requests o
        JOIN students s ON o.reg_no = s.reg_no
        WHERE o.mentor_status = 'pending'
          AND s.department_code = :dept
          AND s.year = :year
          AND s.section = :section
        ORDER BY o.created_at DESC
    """, nativeQuery = true)
    List<OdLeaveRequest> findPendingForMentor(
        @Param("dept") String dept,
        @Param("year") int year,
        @Param("section") String section);

    @Query(value = """
        SELECT o.* FROM od_leave_requests o
        JOIN students s ON o.reg_no = s.reg_no
        WHERE o.ci_status = 'pending'
          AND o.mentor_status = 'approved'
          AND s.department_code = :dept
          AND s.year = :year
          AND s.section = :section
        ORDER BY o.created_at DESC
    """, nativeQuery = true)
    List<OdLeaveRequest> findPendingForCI(
        @Param("dept") String dept,
        @Param("year") int year,
        @Param("section") String section);

    @Query(value = """
        SELECT o.* FROM od_leave_requests o
        JOIN students s ON o.reg_no = s.reg_no
        WHERE o.hod_status = 'pending'
          AND o.ci_status = 'approved'
          AND s.department_code = :dept
        ORDER BY o.created_at DESC
    """, nativeQuery = true)
    List<OdLeaveRequest> findPendingForHOD(@Param("dept") String dept);

    @Query(value = """
        SELECT o.* FROM od_leave_requests o
        JOIN students s ON o.reg_no = s.reg_no
        WHERE s.department_code = :dept
        ORDER BY o.created_at DESC
    """, nativeQuery = true)
    List<OdLeaveRequest> findAllByDept(@Param("dept") String dept);

    @Query(value = """
        SELECT COUNT(*) FROM od_leave_requests o
        JOIN students s ON o.reg_no = s.reg_no
        WHERE o.hod_status = 'pending'
          AND o.ci_status = 'approved'
          AND s.department_code = :dept
    """, nativeQuery = true)
    long countPendingForHOD(@Param("dept") String dept);
}
