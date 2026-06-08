package com.attendx.service;

import com.attendx.dto.LoginRequest;
import com.attendx.dto.LoginResponse;
import com.attendx.dto.StudentRegisterRequest;
import com.attendx.dto.StaffRegisterRequest;
import com.attendx.entity.Staff;
import com.attendx.entity.Student;
import com.attendx.repository.StaffRepository;
import com.attendx.repository.StudentRepository;
import com.attendx.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final StudentRepository studentRepo;
    private final StaffRepository   staffRepo;
    private final JwtUtil           jwtUtil;

    public AuthService(StudentRepository studentRepo,
                       StaffRepository staffRepo,
                       JwtUtil jwtUtil) {
        this.studentRepo = studentRepo;
        this.staffRepo   = staffRepo;
        this.jwtUtil     = jwtUtil;
    }

    public LoginResponse login(LoginRequest req) {
        LocalDate dob = LocalDate.parse(req.getDob());

        if ("student".equals(req.getRole())) {
            Student s = studentRepo.findByRegNoAndDob(req.getId(), dob)
                    .orElseThrow(() -> new RuntimeException(
                            "Invalid credentials. Check Reg No and Date of Birth."));

            String token = jwtUtil.generateToken(
                    s.getRegNo(), "student", s.getDepartmentCode());

            return new LoginResponse(
                    token, "student", s.getName(),
                    s.getRegNo(), s.getDepartmentCode(),
                    s.getYear(), s.getSection());

        } else {
            Staff.StaffRole role;
            try {
                role = Staff.StaffRole.valueOf(req.getRole());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Unknown role: " + req.getRole());
            }

            Staff st = staffRepo.findByStaffIdAndDobAndRole(req.getId(), dob, role)
                    .orElseThrow(() -> new RuntimeException(
                            "Invalid credentials. Check Staff ID and Date of Birth."));

            String token = jwtUtil.generateToken(
                    st.getStaffId(), st.getRole().name(), st.getDepartmentCode());

            return new LoginResponse(
                    token, st.getRole().name(), st.getName(),
                    st.getStaffId(), st.getDepartmentCode(),
                    st.getAssignedYear(), st.getAssignedSection());
        }
    }

    public void registerStudent(StudentRegisterRequest req) {
        if (studentRepo.existsByRegNo(req.getRegNo()))
            throw new RuntimeException("Registration number already exists: " + req.getRegNo());

        Student s = new Student();
        s.setName(req.getName());
        s.setRegNo(req.getRegNo());
        s.setDob(LocalDate.parse(req.getDob()));
        s.setEmail(req.getEmail());
        s.setPhone(req.getPhone());
        s.setDepartmentCode(req.getDepartmentCode());
        s.setYear(req.getYear() != null ? req.getYear() : 1);
        s.setSection(req.getSection() != null ? req.getSection() : "A");
        studentRepo.save(s);
    }

    public void registerStaff(StaffRegisterRequest req) {
        if (staffRepo.existsByStaffId(req.getStaffId()))
            throw new RuntimeException("Staff ID already exists: " + req.getStaffId());

        Staff st = new Staff();
        st.setName(req.getName());
        st.setStaffId(req.getStaffId());
        st.setDob(LocalDate.parse(req.getDob()));
        st.setEmail(req.getEmail());
        st.setPhone(req.getPhone());
        st.setDepartmentCode(req.getDepartmentCode());
        st.setRole(Staff.StaffRole.valueOf(req.getRole()));
        st.setAssignedYear(req.getAssignedYear());
        st.setAssignedSection(req.getAssignedSection());
        staffRepo.save(st);
    }
}
