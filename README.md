# School Principal Activity Monitoring System

A comprehensive system for principals to monitor classroom activities and teacher performance.

## Features

### 1. Teacher Record Maintenance
- Track uniform compliance
- Monitor late comers
- Record homework corrections
- Attendance tracking

### 2. Teacher Performance Analysis
- Performance metrics dashboard
- Monthly reports
- Comparative analysis
- Trend analysis

## Technology Stack
- **Backend**: Python (Flask/FastAPI)
- **Database**: SQLite/PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Data Visualization**: Charts.js/Plotly

## Project Structure

```
School-/
├── backend/
│   ├── database/
│   │   └── schema.sql
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── README.md
```

## Getting Started

1. Install Python 3.8+
2. Install dependencies: `pip install -r requirements.txt`
3. Create database: `python setup_db.py`
4. Run server: `python app.py`
5. Open browser: `http://localhost:5000`

## Next Steps

- [ ] Set up database schema
- [ ] Create backend API
- [ ] Build principal dashboard
- [ ] Create teacher submission forms
- [ ] Add performance analytics
