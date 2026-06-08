package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OdLeaveDto {
    private Long id;
    private String regNo;
    private String studentName;
    private String departmentCode;
    private Integer year;
    private String section;
    private String type;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    private String status;
    private String mentorStatus;
    private String mentorNote;
    private String mentorBy;
    private String ciStatus;
    private String ciNote;
    private String ciBy;
    private String hodStatus;
    private String hodNote;
    private String hodBy;
    private LocalDateTime createdAt;
}
