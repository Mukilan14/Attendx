package com.attendx.controller;

import com.attendx.dto.ApiResponse;
import com.attendx.dto.LoginRequest;
import com.attendx.dto.LoginResponse;
import com.attendx.dto.StudentRegisterRequest;
import com.attendx.dto.StaffRegisterRequest;
import com.attendx.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse resp = authService.login(req);
            return ResponseEntity.ok(ApiResponse.ok(resp));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse> registerStudent(@RequestBody StudentRegisterRequest req) {
        try {
            authService.registerStudent(req);
            return ResponseEntity.ok(ApiResponse.ok("Student registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/staff")
    public ResponseEntity<ApiResponse> registerStaff(@RequestBody StaffRegisterRequest req) {
        try {
            authService.registerStaff(req);
            return ResponseEntity.ok(ApiResponse.ok("Staff registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
