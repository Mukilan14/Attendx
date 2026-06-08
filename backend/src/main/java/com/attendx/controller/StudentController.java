package com.attendx.controller;

import com.attendx.dto.ApiResponse;
import com.attendx.dto.StudentRegisterRequest;
import com.attendx.security.JwtUtil;
import com.attendx.service.AttendanceService;
import com.attendx.service.AuthService;
import com.attendx.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService    studentService;
    private final AttendanceService attendanceService;
    private final AuthService       authService;
    private final JwtUtil           jwtUtil;

    public StudentController(StudentService studentService,
                              AttendanceService attendanceService,
                              AuthService authService,
                              JwtUtil jwtUtil) {
        this.studentService    = studentService;
        this.attendanceService = attendanceService;
        this.authService       = authService;
        this.jwtUtil           = jwtUtil;
    }

    /** Public registration endpoint */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody StudentRegisterRequest req) {
        try {
            authService.registerStudent(req);
            return ResponseEntity.ok(ApiResponse.ok("Registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Logged-in student's own profile */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMe(@RequestHeader("Authorization") String auth) {
        String regNo = extractSubject(auth);
        return ResponseEntity.ok(ApiResponse.ok(studentService.getByRegNo(regNo)));
    }

    /** Logged-in student's own attendance records */
    @GetMapping("/me/attendance")
    public ResponseEntity<ApiResponse> getMyAttendance(
            @RequestHeader("Authorization") String auth) {
        String regNo = extractSubject(auth);
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getStudentAttendance(regNo)));
    }

    /** All students in a department (staff/HOD/admin) */
    @GetMapping("/dept/{code}")
    public ResponseEntity<ApiResponse> getByDept(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getByDept(code)));
    }

    /** Students in a specific class (CI/mentor) */
    @GetMapping("/class")
    public ResponseEntity<ApiResponse> getByClass(
            @RequestParam String dept,
            @RequestParam Integer year,
            @RequestParam String section) {
        return ResponseEntity.ok(
                ApiResponse.ok(studentService.getByClass(dept, year, section)));
    }

    private String extractSubject(String header) {
        return jwtUtil.extractSubject(header.replace("Bearer ", ""));
    }
}
