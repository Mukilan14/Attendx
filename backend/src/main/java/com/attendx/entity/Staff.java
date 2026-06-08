package com.attendx.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "staff_id", nullable = false, unique = true, length = 30)
    private String staffId;

    @Column(nullable = false)
    private LocalDate dob;  // used as password

    @Column(length = 100)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(name = "department_code", nullable = false, length = 20)
    private String departmentCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StaffRole role;

    @Column(name = "assigned_year")
    private Integer assignedYear;

    @Column(name = "assigned_section", length = 5)
    private String assignedSection;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum StaffRole {
        hod, class_incharge, mentor, staff, admin
    }
}
