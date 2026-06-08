package com.attendx.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "reg_no", nullable = false, unique = true, length = 30)
    private String regNo;

    @Column(nullable = false)
    private LocalDate dob;  // used as password

    @Column(length = 100)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(name = "department_code", nullable = false, length = 20)
    private String departmentCode;

    @Column(nullable = false)
    private Integer year = 1;

    @Column(nullable = false, length = 5)
    private String section = "A";

    @Column(name = "total_classes")
    private Integer totalClasses = 0;

    @Column(name = "attended_classes")
    private Integer attendedClasses = 0;

    @Column(name = "attendance_pct", precision = 5, scale = 2)
    private BigDecimal attendancePct = new BigDecimal("100.00");

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
