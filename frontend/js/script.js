// School Monitoring System - Frontend JavaScript

const API_BASE_URL = 'http://localhost:5000/api';

// ==================== PAGE NAVIGATION ====================

function loadDashboard() {
    showSection('dashboard');
    updateDashboardData();
}

function loadTeachers() {
    showSection('teachers');
    loadTeachersList();
    loadTeachersDropdown();
}

function loadRecords() {
    showSection('records');
    loadTeachersForRecords();
}

function loadPerformance() {
    showSection('performance');
    loadTeachersForPerformance();
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

// ==================== DASHBOARD ====================

async function updateDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        const data = await response.json();
        
        document.getElementById('totalTeachers').textContent = data.total_teachers;
        document.getElementById('totalClasses').textContent = data.total_classes;
        document.getElementById('avgAttendance').textContent = data.avg_attendance_week.toFixed(1) + '%';
        document.getElementById('avgUniform').textContent = data.avg_uniform_week.toFixed(1) + '%';
        
        // Initialize charts
        initCharts();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function initCharts() {
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(attendanceCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Average Attendance %',
                data: [75, 78, 76, 80, 82, 79, 81],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'],
            datasets: [{
                label: 'Number of Teachers',
                data: [5, 8, 4, 2],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// ==================== TEACHERS ====================

async function loadTeachersList() {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`);
        const teachers = await response.json();
        
        const tbody = document.getElementById('teachersList');
        tbody.innerHTML = '';
        
        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.teacher_id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.employee_id}</td>
                <td>${teacher.email || 'N/A'}</td>
                <td>${teacher.department || 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading teachers:', error);
        alert('Error loading teachers list');
    }
}

async function loadTeachersDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`);
        const teachers = await response.json();
        
        const select = document.getElementById('performanceTeacher');
        select.innerHTML = '<option value="">Select Teacher</option>';
        
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.teacher_id;
            option.textContent = teacher.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading teachers dropdown:', error);
    }
}

async function loadTeachersForRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`);
        const teachers = await response.json();
        
        // This would be used to pre-populate teacher IDs in forms
        console.log('Teachers loaded for records:', teachers);
    } catch (error) {
        console.error('Error loading teachers for records:', error);
    }
}

async function loadTeachersForPerformance() {
    await loadTeachersDropdown();
}

async function addTeacher(event) {
    event.preventDefault();
    
    const teacherData = {
        name: document.getElementById('teacherName').value,
        employee_id: document.getElementById('employeeId').value,
        email: document.getElementById('teacherEmail').value,
        phone: document.getElementById('teacherPhone').value,
        department: document.getElementById('department').value,
        joining_date: document.getElementById('joiningDate').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teacherData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Teacher added successfully!');
            document.getElementById('teacherForm').reset();
            loadTeachersList();
            loadTeachersDropdown();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding teacher:', error);
        alert('Error adding teacher');
    }
}

// ==================== RECORDS ====================

function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

async function recordAttendance(event) {
    event.preventDefault();
    
    const attendanceData = {
        class_id: parseInt(document.getElementById('classId').value),
        teacher_id: parseInt(document.getElementById('teacherId').value),
        attendance_date: document.getElementById('attendanceDate').value,
        total_students: parseInt(document.getElementById('totalStudents').value),
        present_students: parseInt(document.getElementById('presentStudents').value)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error recording attendance:', error);
        alert('Error recording attendance');
    }
}

async function recordUniform(event) {
    event.preventDefault();
    
    const uniformData = {
        class_id: parseInt(document.getElementById('uniformClassId').value),
        teacher_id: parseInt(document.getElementById('uniformTeacherId').value),
        record_date: document.getElementById('uniformDate').value,
        total_students: parseInt(document.getElementById('uniformTotal').value),
        compliant_students: parseInt(document.getElementById('uniformCompliant').value),
        notes: document.getElementById('uniformNotes').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/uniform`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uniformData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error recording uniform:', error);
        alert('Error recording uniform');
    }
}

async function recordHomework(event) {
    event.preventDefault();
    
    const homeworkData = {
        class_id: parseInt(document.getElementById('hwClassId').value),
        teacher_id: parseInt(document.getElementById('hwTeacherId').value),
        record_date: document.getElementById('hwDate').value,
        total_students: parseInt(document.getElementById('hwTotal').value),
        homework_submitted: parseInt(document.getElementById('hwSubmitted').value),
        homework_checked: parseInt(document.getElementById('hwChecked').value),
        subject: document.getElementById('hwSubject').value,
        notes: document.getElementById('hwNotes').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/homework`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(homeworkData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error recording homework:', error);
        alert('Error recording homework');
    }
}

async function recordLateComers(event) {
    event.preventDefault();
    
    const lateComersData = {
        class_id: parseInt(document.getElementById('lcClassId').value),
        teacher_id: parseInt(document.getElementById('lcTeacherId').value),
        record_date: document.getElementById('lcDate').value,
        late_comers_count: parseInt(document.getElementById('lcCount').value),
        notes: document.getElementById('lcNotes').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/late-comers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lateComersData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error recording late comers:', error);
        alert('Error recording late comers');
    }
}

// ==================== PERFORMANCE ====================

async function loadPerformanceData() {
    const teacherId = document.getElementById('performanceTeacher').value;
    const month = document.getElementById('perfMonth').value;
    const year = document.getElementById('perfYear').value;
    
    if (!teacherId) {
        alert('Please select a teacher');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/performance/${teacherId}/${month}/${year}`);
        const data = await response.json();
        
        if (response.ok) {
            displayPerformanceData(data);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading performance:', error);
        alert('Error loading performance data');
    }
}

function displayPerformanceData(data) {
    const resultsDiv = document.getElementById('performanceResults');
    
    const ratingColors = {
        'Excellent': '#28a745',
        'Good': '#ffc107',
        'Satisfactory': '#fd7e14',
        'Needs Improvement': '#dc3545'
    };
    
    resultsDiv.innerHTML = `
        <div class="performance-metrics">
            <div class="metric">
                <h4>Attendance Average</h4>
                <div class="value">${data.attendance_avg.toFixed(1)}%</div>
            </div>
            <div class="metric">
                <h4>Uniform Compliance</h4>
                <div class="value">${data.uniform_avg.toFixed(1)}%</div>
            </div>
            <div class="metric">
                <h4>Homework Correction</h4>
                <div class="value">${data.homework_avg.toFixed(1)}%</div>
            </div>
            <div class="metric">
                <h4>Overall Score</h4>
                <div class="value">${data.overall_score.toFixed(1)}</div>
                <div class="rating" style="background-color: ${ratingColors[data.rating]}">
                    ${data.rating}
                </div>
            </div>
        </div>
    `;
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});
