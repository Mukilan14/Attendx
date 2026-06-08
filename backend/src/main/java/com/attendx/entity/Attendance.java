package com.attendx.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance",
    uniqueConstraints = @UniqueConstraint(columnNames = {"reg_no", "attendance_date"}))
@Data
@NoArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reg_no", nullable = false, length = 30)
    private String regNo;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AttendanceStatus status = AttendanceStatus.Absent;

    @Column(name = "marked_by", length = 30)
    private String markedBy;

    @Column(name = "department_code", length = 20)
    private String departmentCode;

    @Column
    private Integer year;

    @Column(length = 5)
    private String section;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AttendanceStatus {
        Present, Absent, OD, Leave
    }
}
