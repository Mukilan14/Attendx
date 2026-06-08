# AttendX — Student Attendance Management System
### Full-Stack: Java Spring Boot + MySQL + Vanilla JS Frontend

---

## 📁 Project Structure

```
attendx/
├── backend/                          ← Spring Boot (Java 17)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/attendx/
│       │   ├── AttendXApplication.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── AttendanceController.java
│       │   │   ├── DepartmentController.java
│       │   │   ├── OdLeaveController.java
│       │   │   ├── StudentController.java
│       │   │   └── StaffController.java
│       │   ├── dto/
│       │   │   └── PublicDtos.java
│       │   ├── entity/
│       │   │   ├── Attendance.java
│       │   │   ├── Department.java
│       │   │   ├── OdLeaveRequest.java
│       │   │   ├── Staff.java
│       │   │   └── Student.java
│       │   ├── repository/
│       │   │   ├── AttendanceRepository.java
│       │   │   ├── DepartmentRepository.java
│       │   │   ├── OdLeaveRepository.java
│       │   │   ├── StaffRepository.java
│       │   │   └── StudentRepository.java
│       │   ├── security/
│       │   │   ├── JwtFilter.java
│       │   │   └── JwtUtil.java
│       │   └── service/
│       │       ├── AttendanceService.java
│       │       ├── AuthService.java
│       │       ├── OdLeaveService.java
│       │       ├── StaffService.java
│       │       └── StudentService.java
│       └── resources/
│           ├── application.properties
│           └── schema.sql
│
├── frontend/                         ← Pure HTML/CSS/JS
│   ├── index.html                    ← Single entry point, 4-page router
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js                    ← All API calls (fetch wrapper)
│       ├── app.js                    ← Router, toasts, helpers
│       ├── auth.js                   ← Login / register / logout
│       └── dashboard.js              ← All dashboard sections
│
└── README.md
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| Any browser | Chrome / Firefox / Edge |

---

## 🗄️ Step 1 — Set Up MySQL

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Run the schema file (creates DB + tables + seed data)
source /path/to/attendx/backend/src/main/resources/schema.sql;
```

Or import via MySQL Workbench:
- Open Workbench → File → Run SQL Script → select `schema.sql`

This will:
- Create `attendx_db` database
- Create all 5 tables (departments, students, staff, attendance, od_leave_requests)
- Insert 6 departments, 1 admin, 6 HODs, 8 staff, 10 sample students

---

## 🔧 Step 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/attendx_db?...
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD   ← Change this
```

---

## 🚀 Step 3 — Run Spring Boot Backend

```bash
cd attendx/backend
mvn clean install
mvn spring-boot:run
```

Server starts at: **http://localhost:8080**

Verify it's running:
```bash
curl http://localhost:8080/api/departments
```
Should return JSON with 6 departments.

---

## 🌐 Step 4 — Open Frontend

**Option A — VS Code Live Server (recommended)**
1. Install VS Code extension "Live Server"
2. Right-click `frontend/index.html` → "Open with Live Server"
3. Opens at `http://127.0.0.1:5500`

**Option B — Python simple server**
```bash
cd attendx/frontend
python3 -m http.server 5500
# Open http://localhost:5500
```

**Option C — Direct file open**
- Just double-click `frontend/index.html` in your file manager
- Note: Some browsers block fetch to localhost from file:// URLs. Use Option A or B.

---

## 🔑 Default Login Credentials

All passwords = Date of Birth in YYYY-MM-DD format

### Students
| Name | Reg No | DOB (Password) | Dept |
|------|--------|----------------|------|
| Arjun Sharma | 21CS001 | 2003-05-15 | CSE |
| Priya Reddy | 21CS002 | 2003-08-22 | CSE |
| Karthik Rajan | 21CS003 | 2003-11-10 | CSE |
| Sneha Iyer | 22CS001 | 2004-03-05 | CSE |
| Rahul Nair | 21EC001 | 2003-07-18 | ECE |

### Staff
| Name | Staff ID | DOB (Password) | Role | Dept |
|------|----------|----------------|------|------|
| Admin | ADMIN | 2000-01-01 | Admin | CSE |
| Dr. Rajesh Kumar | HOD_CSE | 1975-06-15 | HOD | CSE |
| Dr. Priya Nair | HOD_ECE | 1978-03-20 | HOD | ECE |
| Mr. Vijay | CI_CSE1A | 1988-02-18 | Class Incharge | CSE |
| Ms. Deepa | CI_CSE2A | 1987-08-30 | Class Incharge | CSE |
| Prof. Kavitha | MEN_CSE1 | 1985-04-10 | Mentor | CSE |
| Prof. Srinivas | MEN_CSE2 | 1986-07-22 | Mentor | CSE |

---

## 🗺️ Page Flow

```
Homepage
    └── Get Started
            └── Departments Page (choose dept)
                    └── Login Page (student / staff tabs)
                            └── Dashboard (role-specific)
                                    ├── Student:         home, attendance, OD/leave, profile
                                    ├── Class Incharge:  dashboard, mark attendance, approvals
                                    ├── Mentor:          dashboard, OD approvals, students
                                    ├── HOD:             dept overview, final approvals, all staff
                                    └── Admin:           all students, staff, records
```

Every page has a **Back button** in the topbar.

---

## 🔗 REST API Reference

### Auth (Public — no token needed)
```
POST /api/auth/login                  Body: { id, dob, role, department }
POST /api/auth/register/student       Body: { name, regNo, dob, email, phone, departmentCode, year, section }
POST /api/auth/register/staff         Body: { name, staffId, dob, email, departmentCode, role, ... }
```

### Departments
```
GET  /api/departments                 List all with student/staff counts
GET  /api/departments/{code}/stats    Dept stats (avg attendance, below 75%, etc.)
```

### Students (JWT required)
```
GET  /api/students/me                 My profile
GET  /api/students/me/attendance      My attendance records
GET  /api/students/dept/{code}        All students in dept
GET  /api/students/class?dept=&year=&section=   Students by class
```

### Staff (JWT required)
```
GET  /api/staff/dept/{code}           All staff in dept
GET  /api/staff/{staffId}             Single staff member
```

### Attendance (JWT required)
```
POST /api/attendance/mark/class?year=&section=   Mark attendance (CI only)
GET  /api/attendance/dept/{code}      Dept attendance records
GET  /api/attendance/class?dept=&year=&section=  Class records
```

### OD/Leave (JWT required)
```
POST /api/od-leave/submit             Student submits request
GET  /api/od-leave/my                 Student's own requests
GET  /api/od-leave/pending/class?year=&section=  Pending for current approver
GET  /api/od-leave/dept/{code}        All requests in dept
GET  /api/od-leave/{id}               Single request detail
POST /api/od-leave/{id}/process       Approve/reject: { action: "approve"|"reject", note }
```

---

## 🔒 Authentication Flow

1. User logs in → Backend verifies reg_no/staff_id + DOB against MySQL
2. On success → JWT token returned (expires in 24h)
3. Frontend stores token in `localStorage`
4. Every subsequent request sends `Authorization: Bearer <token>`
5. Spring Security JwtFilter validates token on every protected endpoint
6. JWT payload contains: subject (ID), role, department

---

## 📊 Database Tables

```
departments       → 6 rows (CSE, ECE, MECH, CIVIL, IT, EEE)
students          → reg_no (PK), dob used as password
staff             → staff_id (PK), dob used as password, role enum
attendance        → reg_no + date (UNIQUE), status enum
od_leave_requests → 3-level approval (mentor/ci/hod), status enum
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt) |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8.0 |
| Build | Maven |

---

## 🐛 Troubleshooting

**"Could not connect to backend"**
→ Make sure `mvn spring-boot:run` is running and port 8080 is free.

**CORS errors in browser**
→ The SecurityConfig already allows all origins. If still failing, check that the backend is running.

**"Invalid credentials"**
→ Password is the DOB in exact format `YYYY-MM-DD` (e.g. `2003-05-15`). Use the date picker.

**JPA table errors on startup**
→ Run `schema.sql` manually first, then set `spring.jpa.hibernate.ddl-auto=update`.

**Port 8080 already in use**
→ Change `server.port=8080` in `application.properties` to 8081, and update `BASE` in `frontend/js/api.js`.
