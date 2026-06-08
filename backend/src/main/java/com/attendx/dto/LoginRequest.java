package com.attendx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String id;          // regNo or staffId
    private String dob;         // "YYYY-MM-DD"
    private String role;        // student | hod | class_incharge | mentor | staff | admin
    private String department;  // optional dept filter
}
