# School Monitoring System - Main Backend Application
# This is the core Python application that handles all data and logic

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime, timedelta

# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE = 'school_monitoring.db'

# ==================== DATABASE HELPERS ====================

def get_db_connection():
    """Create a connection to the database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn

def init_db():
    """Initialize the database with schema"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Read and execute schema
    with open('database/schema.sql', 'r') as f:
        schema = f.read()
        cursor.executescript(schema)
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

# ==================== TEACHER ENDPOINTS ====================

@app.route('/api/teachers', methods=['GET'])
def get_teachers():
    """Get list of all teachers"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM teachers')
    teachers = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(teacher) for teacher in teachers])

@app.route('/api/teachers', methods=['POST'])
def add_teacher():
    """Add a new teacher to the system"""
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO teachers (name, employee_id, email, phone, department, joining_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['employee_id'],
            data.get('email'),
            data.get('phone'),
            data.get('department'),
            data.get('joining_date')
        ))
        
        conn.commit()
        return jsonify({'message': 'Teacher added successfully!', 'teacher_id': cursor.lastrowid}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== ATTENDANCE ENDPOINTS ====================

@app.route('/api/attendance', methods=['POST'])
def record_attendance():
    """Record daily attendance for a class"""
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Calculate attendance percentage
        attendance_percentage = (data['present_students'] / data['total_students']) * 100
        
        cursor.execute('''
            INSERT INTO daily_attendance 
            (class_id, teacher_id, attendance_date, total_students, present_students, attendance_percentage)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['class_id'],
            data['teacher_id'],
            data['attendance_date'],
            data['total_students'],
            data['present_students'],
            attendance_percentage
        ))
        
        conn.commit()
        return jsonify({'message': 'Attendance recorded successfully!'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== UNIFORM COMPLIANCE ENDPOINTS ====================

@app.route('/api/uniform', methods=['POST'])
def record_uniform():
    """Record uniform compliance for a class"""
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        compliance_percentage = (data['compliant_students'] / data['total_students']) * 100
        
        cursor.execute('''
            INSERT INTO uniform_records 
            (class_id, teacher_id, record_date, total_students, compliant_students, compliance_percentage, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['class_id'],
            data['teacher_id'],
            data['record_date'],
            data['total_students'],
            data['compliant_students'],
            compliance_percentage,
            data.get('notes')
        ))
        
        conn.commit()
        return jsonify({'message': 'Uniform record saved successfully!'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== HOMEWORK ENDPOINTS ====================

@app.route('/api/homework', methods=['POST'])
def record_homework():
    """Record homework submission and correction"""
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        correction_percentage = (data['homework_checked'] / data['homework_submitted']) * 100 if data['homework_submitted'] > 0 else 0
        
        cursor.execute('''
            INSERT INTO homework_records 
            (class_id, teacher_id, record_date, total_students, homework_submitted, homework_checked, correction_percentage, subject, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['class_id'],
            data['teacher_id'],
            data['record_date'],
            data['total_students'],
            data['homework_submitted'],
            data['homework_checked'],
            correction_percentage,
            data.get('subject'),
            data.get('notes')
        ))
        
        conn.commit()
        return jsonify({'message': 'Homework record saved successfully!'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== LATE COMERS ENDPOINTS ====================

@app.route('/api/late-comers', methods=['POST'])
def record_late_comers():
    """Record late comers in a class"""
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO late_comers 
            (class_id, teacher_id, record_date, late_comers_count, notes)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['class_id'],
            data['teacher_id'],
            data['record_date'],
            data['late_comers_count'],
            data.get('notes')
        ))
        
        conn.commit()
        return jsonify({'message': 'Late comer record saved successfully!'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== PERFORMANCE ANALYTICS ENDPOINTS ====================

@app.route('/api/performance/<int:teacher_id>/<int:month>/<int:year>', methods=['GET'])
def get_teacher_performance(teacher_id, month, year):
    """Get performance metrics for a specific teacher for a given month"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get attendance average
        cursor.execute('''
            SELECT AVG(attendance_percentage) as avg_attendance
            FROM daily_attendance
            WHERE teacher_id = ? 
            AND strftime('%m', attendance_date) = ? 
            AND strftime('%Y', attendance_date) = ?
        ''', (teacher_id, f"{month:02d}", str(year)))
        attendance = cursor.fetchone()['avg_attendance'] or 0
        
        # Get uniform compliance average
        cursor.execute('''
            SELECT AVG(compliance_percentage) as avg_uniform
            FROM uniform_records
            WHERE teacher_id = ? 
            AND strftime('%m', record_date) = ? 
            AND strftime('%Y', record_date) = ?
        ''', (teacher_id, f"{month:02d}", str(year)))
        uniform = cursor.fetchone()['avg_uniform'] or 0
        
        # Get homework average
        cursor.execute('''
            SELECT AVG(correction_percentage) as avg_homework
            FROM homework_records
            WHERE teacher_id = ? 
            AND strftime('%m', record_date) = ? 
            AND strftime('%Y', record_date) = ?
        ''', (teacher_id, f"{month:02d}", str(year)))
        homework = cursor.fetchone()['avg_homework'] or 0
        
        # Calculate overall score
        overall_score = (attendance + uniform + homework) / 3
        
        # Determine rating
        if overall_score >= 80:
            rating = "Excellent"
        elif overall_score >= 70:
            rating = "Good"
        elif overall_score >= 60:
            rating = "Satisfactory"
        else:
            rating = "Needs Improvement"
        
        return jsonify({
            'teacher_id': teacher_id,
            'month': month,
            'year': year,
            'attendance_avg': round(attendance, 2),
            'uniform_avg': round(uniform, 2),
            'homework_avg': round(homework, 2),
            'overall_score': round(overall_score, 2),
            'rating': rating
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@app.route('/api/performance/all/<int:month>/<int:year>', methods=['GET'])
def get_all_teachers_performance(month, year):
    """Get performance metrics for all teachers for a given month"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT * FROM teachers')
        teachers = cursor.fetchall()
        
        performance_data = []
        for teacher in teachers:
            # Fetch individual teacher performance
            response = get_teacher_performance(teacher['teacher_id'], month, year)
            data = json.loads(response.data)
            performance_data.append(data)
        
        return jsonify(performance_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== DASHBOARD ENDPOINTS ====================

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_summary():
    """Get summary statistics for the principal dashboard"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Total teachers
        cursor.execute('SELECT COUNT(*) as count FROM teachers')
        total_teachers = cursor.fetchone()['count']
        
        # Total classes
        cursor.execute('SELECT COUNT(*) as count FROM classes')
        total_classes = cursor.fetchone()['count']
        
        # Average attendance this week
        cursor.execute('''
            SELECT AVG(attendance_percentage) as avg
            FROM daily_attendance
            WHERE attendance_date >= date('now', '-7 days')
        ''')
        avg_attendance = cursor.fetchone()['avg'] or 0
        
        # Average uniform compliance this week
        cursor.execute('''
            SELECT AVG(compliance_percentage) as avg
            FROM uniform_records
            WHERE record_date >= date('now', '-7 days')
        ''')
        avg_uniform = cursor.fetchone()['avg'] or 0
        
        return jsonify({
            'total_teachers': total_teachers,
            'total_classes': total_classes,
            'avg_attendance_week': round(avg_attendance, 2),
            'avg_uniform_week': round(avg_uniform, 2)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'Server is running!'})

# ==================== MAIN ====================

if __name__ == '__main__':
    # Initialize database on first run
    try:
        init_db()
    except:
        pass  # Database already exists
    
    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5000)
