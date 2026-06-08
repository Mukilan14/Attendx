package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDto {
    private Long id;
    private String regNo;
    private String studentName;
    private LocalDate attendanceDate;
    private String status;
    private String markedBy;
}
