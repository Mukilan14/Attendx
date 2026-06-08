package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffRegisterRequest {
    private String name;
    private String staffId;
    private String dob;
    private String email;
    private String phone;
    private String departmentCode;
    private String role;
    private Integer assignedYear;
    private String assignedSection;
}
