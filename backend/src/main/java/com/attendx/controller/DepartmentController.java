package com.attendx.controller;

import com.attendx.dto.ApiResponse;
import com.attendx.dto.DeptStatsDto;
import com.attendx.entity.Department;
import com.attendx.repository.DepartmentRepository;
import com.attendx.repository.StaffRepository;
import com.attendx.repository.StudentRepository;
import com.attendx.service.OdLeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository deptRepo;
    private final StudentRepository    studentRepo;
    private final StaffRepository      staffRepo;
    private final OdLeaveService       odLeaveService;

    public DepartmentController(DepartmentRepository deptRepo,
                                 StudentRepository studentRepo,
                                 StaffRepository staffRepo,
                                 OdLeaveService odLeaveService) {
        this.deptRepo       = deptRepo;
        this.studentRepo    = studentRepo;
        this.staffRepo      = staffRepo;
        this.odLeaveService = odLeaveService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        List<Department> depts = deptRepo.findAllByOrderByCode();
        List<Map<String, Object>> result = depts.stream().map(d -> Map.of(
                "code",         (Object) d.getCode(),
                "name",         d.getName(),
                "icon",         d.getIcon() != null ? d.getIcon() : "🏫",
                "studentCount", studentRepo.countByDepartmentCode(d.getCode()),
                "staffCount",   staffRepo.countByDepartmentCode(d.getCode())
        )).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{code}/stats")
    public ResponseEntity<ApiResponse> getStats(@PathVariable String code) {
        DeptStatsDto stats = new DeptStatsDto();
        stats.setTotalStudents(studentRepo.countByDepartmentCode(code));
        stats.setTotalStaff(staffRepo.countByDepartmentCode(code));
        Double avg = studentRepo.avgAttendanceByDept(code);
        stats.setAvgAttendance(avg != null ? avg : 100.0);
        stats.setBelow75(studentRepo.countBelow75(code));
        stats.setPendingOD(odLeaveService.countPendingForHOD(code));
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
