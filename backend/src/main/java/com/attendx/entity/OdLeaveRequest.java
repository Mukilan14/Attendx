package com.attendx.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "od_leave_requests")
@Data
@NoArgsConstructor
public class OdLeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reg_no", nullable = false, length = 30)
    private String regNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 10)
    private RequestType requestType;

    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ApprovalStatus status = ApprovalStatus.pending;

    // Mentor approval
    @Enumerated(EnumType.STRING)
    @Column(name = "mentor_status", nullable = false, length = 10)
    private ApprovalStatus mentorStatus = ApprovalStatus.pending;
    @Column(name = "mentor_note", columnDefinition = "TEXT")
    private String mentorNote;
    @Column(name = "mentor_by", length = 30)
    private String mentorBy;
    @Column(name = "mentor_at")
    private LocalDateTime mentorAt;

    // CI approval
    @Enumerated(EnumType.STRING)
    @Column(name = "ci_status", nullable = false, length = 10)
    private ApprovalStatus ciStatus = ApprovalStatus.pending;
    @Column(name = "ci_note", columnDefinition = "TEXT")
    private String ciNote;
    @Column(name = "ci_by", length = 30)
    private String ciBy;
    @Column(name = "ci_at")
    private LocalDateTime ciAt;

    // HOD approval
    @Enumerated(EnumType.STRING)
    @Column(name = "hod_status", nullable = false, length = 10)
    private ApprovalStatus hodStatus = ApprovalStatus.pending;
    @Column(name = "hod_note", columnDefinition = "TEXT")
    private String hodNote;
    @Column(name = "hod_by", length = 30)
    private String hodBy;
    @Column(name = "hod_at")
    private LocalDateTime hodAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RequestType { OD, Leave }
    public enum ApprovalStatus { pending, approved, rejected }
}
