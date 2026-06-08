package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {
    private Long id;
    private String name;
    private String regNo;
    private String email;
    private String phone;
    private String departmentCode;
    private Integer year;
    private String section;
    private Integer totalClasses;
    private Integer attendedClasses;
    private BigDecimal attendancePct;
}
