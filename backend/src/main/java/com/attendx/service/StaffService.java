package com.attendx.service;

import com.attendx.dto.StaffDto;
import com.attendx.entity.Staff;
import com.attendx.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

    private final StaffRepository staffRepo;

    public StaffService(StaffRepository staffRepo) {
        this.staffRepo = staffRepo;
    }

    public List<StaffDto> getByDept(String dept) {
        return staffRepo.findByDepartmentCode(dept)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public StaffDto getByStaffId(String staffId) {
        return toDto(staffRepo.findByStaffId(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId)));
    }

    private StaffDto toDto(Staff s) {
        StaffDto dto = new StaffDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setStaffId(s.getStaffId());
        dto.setEmail(s.getEmail());
        dto.setDepartmentCode(s.getDepartmentCode());
        dto.setRole(s.getRole().name());
        dto.setAssignedYear(s.getAssignedYear());
        dto.setAssignedSection(s.getAssignedSection());
        return dto;
    }
}
