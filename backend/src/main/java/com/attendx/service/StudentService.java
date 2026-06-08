package com.attendx.service;

import com.attendx.dto.StudentDto;
import com.attendx.entity.Student;
import com.attendx.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepo;

    public StudentService(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    public StudentDto getByRegNo(String regNo) {
        return toDto(studentRepo.findByRegNo(regNo)
                .orElseThrow(() -> new RuntimeException("Student not found: " + regNo)));
    }

    public List<StudentDto> getByDept(String dept) {
        return studentRepo.findByDepartmentCodeOrderByYearAscSectionAscNameAsc(dept)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<StudentDto> getByClass(String dept, Integer year, String section) {
        return studentRepo.findByDepartmentCodeAndYearAndSection(dept, year, section)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public StudentDto addStudent(Student s) {
        if (studentRepo.existsByRegNo(s.getRegNo()))
            throw new RuntimeException("Reg No already exists: " + s.getRegNo());
        return toDto(studentRepo.save(s));
    }

    private StudentDto toDto(Student s) {
        StudentDto dto = new StudentDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setRegNo(s.getRegNo());
        dto.setEmail(s.getEmail());
        dto.setPhone(s.getPhone());
        dto.setDepartmentCode(s.getDepartmentCode());
        dto.setYear(s.getYear());
        dto.setSection(s.getSection());
        dto.setTotalClasses(s.getTotalClasses());
        dto.setAttendedClasses(s.getAttendedClasses());
        dto.setAttendancePct(s.getAttendancePct());
        return dto;
    }
}
