package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeptStatsDto {
    private long totalStudents;
    private long totalStaff;
    private double avgAttendance;
    private long below75;
    private long pendingOD;
}
