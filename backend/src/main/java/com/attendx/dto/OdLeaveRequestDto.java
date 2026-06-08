package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OdLeaveRequestDto {
    private String type;       // OD | Leave
    private String fromDate;   // "YYYY-MM-DD"
    private String toDate;     // "YYYY-MM-DD"
    private String reason;
}
