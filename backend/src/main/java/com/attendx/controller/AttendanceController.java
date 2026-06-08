package com.attendx.controller;

import com.attendx.dto.ApiResponse;
import com.attendx.dto.MarkAttendanceRequest;
import com.attendx.security.JwtUtil;
import com.attendx.service.AttendanceService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final JwtUtil           jwtUtil;

    public AttendanceController(AttendanceService attendanceService, JwtUtil jwtUtil) {
        this.attendanceService = attendanceService;
        this.jwtUtil           = jwtUtil;
    }

    /** Mark attendance for a specific class — used by Class Incharge */
    @PostMapping("/mark/class")
    public ResponseEntity<ApiResponse> markClass(
            @RequestBody MarkAttendanceRequest req,
            @RequestParam Integer year,
            @RequestParam String section,
            @RequestHeader("Authorization") String auth) {
        try {
            Claims claims  = extractClaims(auth);
            String staffId = claims.getSubject();
            String dept    = claims.get("dept", String.class);
            String role    = claims.get("role", String.class);

            if (!"class_incharge".equals(role) && !"admin".equals(role)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Only Class Incharge can mark attendance"));
            }

            int saved = attendanceService.markAttendance(req, staffId, dept, year, section);
            return ResponseEntity.ok(ApiResponse.ok("Attendance saved for " + saved + " students"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Get all attendance records for a department */
    @GetMapping("/dept/{code}")
    public ResponseEntity<ApiResponse> getDept(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getDeptAttendance(code)));
    }

    /** Get attendance for a specific class */
    @GetMapping("/class")
    public ResponseEntity<ApiResponse> getClass(
            @RequestParam String dept,
            @RequestParam Integer year,
            @RequestParam String section) {
        return ResponseEntity.ok(
                ApiResponse.ok(attendanceService.getClassAttendance(dept, year, section)));
    }

    private Claims extractClaims(String header) {
        return jwtUtil.extractClaims(header.replace("Bearer ", ""));
    }
}
