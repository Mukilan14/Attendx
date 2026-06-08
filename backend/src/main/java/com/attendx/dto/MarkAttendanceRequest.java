package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarkAttendanceRequest {
    private String date;                   // "YYYY-MM-DD"
    private List<AttendanceEntry> records;
}
