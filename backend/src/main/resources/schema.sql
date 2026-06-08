-- ═══════════════════════════════════════════════════════════════
--  AttendX Database Schema
--  Run this once to set up the database, then let JPA manage it
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS attendx_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE attendx_db;

-- ─── DEPARTMENTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  code       VARCHAR(20)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  icon       VARCHAR(10)  DEFAULT '🏫',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─── STUDENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  reg_no           VARCHAR(30)  NOT NULL UNIQUE,
  dob              DATE         NOT NULL  COMMENT 'Used as password',
  email            VARCHAR(100),
  phone            VARCHAR(15),
  department_code  VARCHAR(20)  NOT NULL,
  year             INT          NOT NULL DEFAULT 1,
  section          VARCHAR(5)   NOT NULL DEFAULT 'A',
  total_classes    INT          NOT NULL DEFAULT 0,
  attended_classes INT          NOT NULL DEFAULT 0,
  attendance_pct   DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  is_active        TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_code) REFERENCES departments(code)
);

-- ─── STAFF ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  staff_id          VARCHAR(30)  NOT NULL UNIQUE,
  dob               DATE         NOT NULL  COMMENT 'Used as password',
  email             VARCHAR(100),
  phone             VARCHAR(15),
  department_code   VARCHAR(20)  NOT NULL,
  role              ENUM('hod','class_incharge','mentor','staff','admin') NOT NULL,
  assigned_year     INT,
  assigned_section  VARCHAR(5),
  is_active         TINYINT(1)   NOT NULL DEFAULT 1,
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_code) REFERENCES departments(code)
);

-- ─── ATTENDANCE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  reg_no           VARCHAR(30)  NOT NULL,
  attendance_date  DATE         NOT NULL,
  status           ENUM('Present','Absent','OD','Leave') NOT NULL DEFAULT 'Absent',
  marked_by        VARCHAR(30),
  department_code  VARCHAR(20),
  year             INT,
  section          VARCHAR(5),
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reg_date (reg_no, attendance_date),
  FOREIGN KEY (reg_no) REFERENCES students(reg_no)
);

-- ─── OD / LEAVE REQUESTS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS od_leave_requests (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  reg_no          VARCHAR(30)  NOT NULL,
  request_type    ENUM('OD','Leave') NOT NULL,
  from_date       DATE         NOT NULL,
  to_date         DATE         NOT NULL,
  reason          TEXT,
  status          ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',

  mentor_status   ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  mentor_note     TEXT,
  mentor_by       VARCHAR(30),
  mentor_at       TIMESTAMP    NULL,

  ci_status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  ci_note         TEXT,
  ci_by           VARCHAR(30),
  ci_at           TIMESTAMP    NULL,

  hod_status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  hod_note        TEXT,
  hod_by          VARCHAR(30),
  hod_at          TIMESTAMP    NULL,

  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reg_no) REFERENCES students(reg_no)
);

-- ─── SEED: DEPARTMENTS ───────────────────────────────────────
INSERT IGNORE INTO departments (code, name, icon) VALUES
  ('CSE',  'Computer Science & Engineering', '💻'),
  ('ECE',  'Electronics & Communication',    '⚡'),
  ('MECH', 'Mechanical Engineering',          '⚙️'),
  ('CIVIL','Civil Engineering',               '🏗️'),
  ('IT',   'Information Technology',          '🌐'),
  ('EEE',  'Electrical & Electronics',        '🔌');

-- ─── SEED: STAFF ─────────────────────────────────────────────
INSERT IGNORE INTO staff (name, staff_id, dob, email, department_code, role) VALUES
  ('Admin',         'ADMIN',    '2000-01-01', 'admin@college.edu',    'CSE',  'admin');

INSERT IGNORE INTO staff (name, staff_id, dob, email, department_code, role) VALUES
  ('Dr. Rajesh Kumar',  'HOD_CSE',  '1975-06-15', 'hod.cse@college.edu',   'CSE',  'hod'),
  ('Dr. Priya Nair',    'HOD_ECE',  '1978-03-20', 'hod.ece@college.edu',   'ECE',  'hod'),
  ('Dr. Arun Patel',    'HOD_MECH', '1972-11-05', 'hod.mech@college.edu',  'MECH', 'hod'),
  ('Dr. Meena Sharma',  'HOD_CIVIL','1974-08-12', 'hod.civil@college.edu', 'CIVIL','hod'),
  ('Dr. Suresh Babu',   'HOD_IT',   '1976-04-22', 'hod.it@college.edu',    'IT',   'hod'),
  ('Dr. Ramesh EEE',    'HOD_EEE',  '1973-09-30', 'hod.eee@college.edu',   'EEE',  'hod');

INSERT IGNORE INTO staff (name, staff_id, dob, email, department_code, role, assigned_year, assigned_section) VALUES
  ('Prof. Kavitha',  'MEN_CSE1',  '1985-04-10', 'men.cse1@college.edu',  'CSE', 'mentor',        1, 'A'),
  ('Prof. Srinivas', 'MEN_CSE2',  '1986-07-22', 'men.cse2@college.edu',  'CSE', 'mentor',        2, 'A'),
  ('Mr. Vijay',      'CI_CSE1A',  '1988-02-18', 'ci.cse1a@college.edu',  'CSE', 'class_incharge',1, 'A'),
  ('Ms. Deepa',      'CI_CSE2A',  '1987-08-30', 'ci.cse2a@college.edu',  'CSE', 'class_incharge',2, 'A'),
  ('Prof. Lakshmi',  'MEN_ECE1',  '1984-09-14', 'men.ece1@college.edu',  'ECE', 'mentor',        1, 'A'),
  ('Mr. Ravi',       'CI_ECE1A',  '1989-05-25', 'ci.ece1a@college.edu',  'ECE', 'class_incharge',1, 'A'),
  ('Prof. Anitha',   'MEN_IT1',   '1987-01-15', 'men.it1@college.edu',   'IT',  'mentor',        1, 'A'),
  ('Mr. Suresh',     'CI_IT1A',   '1990-06-08', 'ci.it1a@college.edu',   'IT',  'class_incharge',1, 'A');

-- ─── SEED: STUDENTS ──────────────────────────────────────────
INSERT IGNORE INTO students (name, reg_no, dob, email, phone, department_code, year, section) VALUES
  ('Arjun Sharma',  '21CS001', '2003-05-15', 'arjun@student.edu',  '9876543210', 'CSE',  1, 'A'),
  ('Priya Reddy',   '21CS002', '2003-08-22', 'priya@student.edu',  '9876543211', 'CSE',  1, 'A'),
  ('Karthik Rajan', '21CS003', '2003-11-10', 'karthik@student.edu','9876543212', 'CSE',  1, 'A'),
  ('Sneha Iyer',    '22CS001', '2004-03-05', 'sneha@student.edu',  '9876543213', 'CSE',  2, 'A'),
  ('Rahul Nair',    '21EC001', '2003-07-18', 'rahul@student.edu',  '9876543214', 'ECE',  1, 'A'),
  ('Divya Menon',   '21EC002', '2003-09-25', 'divya@student.edu',  '9876543215', 'ECE',  1, 'A'),
  ('Abishek Roy',   '21ME001', '2003-04-12', 'abishek@student.edu','9876543216', 'MECH', 1, 'A'),
  ('Lakshmi Devi',  '21IT001', '2003-06-30', 'lakshmi@student.edu','9876543217', 'IT',   1, 'A'),
  ('Vikram Singh',  '21IT002', '2003-02-14', 'vikram@student.edu', '9876543218', 'IT',   1, 'A'),
  ('Nisha Kapoor',  '21CV001', '2003-10-08', 'nisha@student.edu',  '9876543219', 'CIVIL',1, 'A');
