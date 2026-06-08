package com.attendx.controller;

import com.attendx.dto.ApiResponse;
import com.attendx.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    /** All staff in a department */
    @GetMapping("/dept/{code}")
    public ResponseEntity<ApiResponse> getByDept(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.getByDept(code)));
    }

    /** Single staff member by ID */
    @GetMapping("/{staffId}")
    public ResponseEntity<ApiResponse> getOne(@PathVariable String staffId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(staffService.getByStaffId(staffId)));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
