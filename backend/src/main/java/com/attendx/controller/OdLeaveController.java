package com.attendx.controller;

import com.attendx.dto.ApiResponse;
import com.attendx.dto.ApprovalRequest;
import com.attendx.dto.OdLeaveRequestDto;
import com.attendx.security.JwtUtil;
import com.attendx.service.OdLeaveService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/od-leave")
public class OdLeaveController {

    private final OdLeaveService odLeaveService;
    private final JwtUtil        jwtUtil;

    public OdLeaveController(OdLeaveService odLeaveService, JwtUtil jwtUtil) {
        this.odLeaveService = odLeaveService;
        this.jwtUtil        = jwtUtil;
    }

    /** Student submits a new OD/Leave request */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submit(
            @RequestBody OdLeaveRequestDto req,
            @RequestHeader("Authorization") String auth) {
        try {
            String regNo = extractClaims(auth).getSubject();
            return ResponseEntity.ok(ApiResponse.ok(odLeaveService.submit(regNo, req)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Student views their own requests */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyRequests(
            @RequestHeader("Authorization") String auth) {
        String regNo = extractClaims(auth).getSubject();
        return ResponseEntity.ok(ApiResponse.ok(odLeaveService.getMyRequests(regNo)));
    }

    /** Approver (mentor/CI/HOD) views pending requests for their class */
    @GetMapping("/pending/class")
    public ResponseEntity<ApiResponse> getPendingClass(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String section,
            @RequestHeader("Authorization") String auth) {
        Claims c    = extractClaims(auth);
        String role = c.get("role", String.class);
        String dept = c.get("dept", String.class);
        return ResponseEntity.ok(
                ApiResponse.ok(odLeaveService.getPendingForRole(role, dept, year, section)));
    }

    /** All OD/Leave records for a department (HOD / staff / admin read view) */
    @GetMapping("/dept/{code}")
    public ResponseEntity<ApiResponse> getByDept(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(odLeaveService.getAllByDept(code)));
    }

    /** Get a single request by ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(odLeaveService.getById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Approve or reject a request */
    @PostMapping("/{id}/process")
    public ResponseEntity<ApiResponse> process(
            @PathVariable Long id,
            @RequestBody ApprovalRequest req,
            @RequestHeader("Authorization") String auth) {
        try {
            Claims c    = extractClaims(auth);
            String role = c.get("role", String.class);
            String by   = c.getSubject();
            return ResponseEntity.ok(
                    ApiResponse.ok(odLeaveService.processApproval(id, role, by, req)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    private Claims extractClaims(String header) {
        return jwtUtil.extractClaims(header.replace("Bearer ", ""));
    }
}
