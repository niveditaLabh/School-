-- Database Schema for School Monitoring System
-- This stores all the information about teachers, classes, and activities

-- Teachers Table
CREATE TABLE teachers (
    teacher_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    department TEXT,
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE classes (
    class_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL,
    class_level TEXT,
    teacher_id INTEGER,
    total_students INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Daily Attendance Records (Students)
CREATE TABLE daily_attendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    attendance_date DATE NOT NULL,
    total_students INTEGER,
    present_students INTEGER,
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Uniform Compliance Tracking
CREATE TABLE uniform_records (
    uniform_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    record_date DATE NOT NULL,
    total_students INTEGER,
    compliant_students INTEGER,
    compliance_percentage DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Late Comers Tracking
CREATE TABLE late_comers (
    late_comer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    record_date DATE NOT NULL,
    late_comers_count INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Homework Correction Records
CREATE TABLE homework_records (
    homework_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    record_date DATE NOT NULL,
    total_students INTEGER,
    homework_submitted INTEGER,
    homework_checked INTEGER,
    correction_percentage DECIMAL(5,2),
    subject TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Teacher Performance Summary (Monthly)
CREATE TABLE teacher_performance (
    performance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    month INTEGER,
    year INTEGER,
    attendance_avg DECIMAL(5,2),
    uniform_avg DECIMAL(5,2),
    homework_avg DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    performance_rating TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- System Users (Principals/Admins)
CREATE TABLE system_users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    role TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_teacher_id ON teachers(teacher_id);
CREATE INDEX idx_class_teacher ON classes(teacher_id);
CREATE INDEX idx_attendance_date ON daily_attendance(attendance_date);
CREATE INDEX idx_uniform_date ON uniform_records(record_date);
CREATE INDEX idx_homework_date ON homework_records(record_date);
