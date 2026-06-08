package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRegisterRequest {
    private String name;
    private String regNo;
    private String dob;
    private String email;
    private String phone;
    private String departmentCode;
    private Integer year;
    private String section;
}
