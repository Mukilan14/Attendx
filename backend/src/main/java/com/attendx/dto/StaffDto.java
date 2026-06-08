package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffDto {
    private Long id;
    private String name;
    private String staffId;
    private String email;
    private String departmentCode;
    private String role;
    private Integer assignedYear;
    private String assignedSection;
}
