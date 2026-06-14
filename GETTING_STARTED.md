# Getting Started with School Monitoring System

Welcome! This guide will help you set up and run the system even if you're new to programming.

## What This System Does

This is a **Principal Dashboard** that helps you monitor:
1. **Teacher Performance** - Track how well teachers maintain records
2. **Classroom Records** - Attendance, uniforms, homework, late comers

---

## Step 1: Install Required Software

### Windows Users:
1. Download Python from https://www.python.org/downloads/
2. Run the installer and **CHECK** the box "Add Python to PATH"
3. Click "Install Now"

### Mac Users:
1. Open Terminal (Applications → Utilities → Terminal)
2. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Install Python: `brew install python3`

### Linux Users:
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
```

---

## Step 2: Download the Project

1. Go to: https://github.com/niveditaLabh/School-
2. Click **Code → Download ZIP**
3. Extract the ZIP file to a folder

---

## Step 3: Install Python Dependencies

1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Navigate to your project folder:
   ```
   cd path/to/School-
   ```
3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

---

## Step 4: Set Up the Database

The system uses SQLite, which is built-in to Python. The database will be created automatically when you run the app.

---

## Step 5: Run the System

1. In your Terminal/Command Prompt (in the School- folder), run:
   ```
   python backend/app.py
   ```

2. You should see something like:
   ```
   Running on http://127.0.0.1:5000
   ```

3. Open your web browser and go to: **http://localhost:5000**

---

## Step 6: Start Using the System

### Dashboard
See overview statistics about your school

### Teachers Management
- Add teacher information (name, ID, email, etc.)
- View all teachers in a list

### Daily Records
Record daily activities:
- **Attendance** - How many students were present
- **Uniform Compliance** - How many wore correct uniforms
- **Homework** - How many submitted and had corrections
- **Late Comers** - Track students arriving late

### Performance Analysis
View how teachers are performing:
- Attendance average percentage
- Uniform compliance percentage
- Homework correction percentage
- Overall performance rating (Excellent, Good, Satisfactory, Needs Improvement)

---

## Troubleshooting

### "Python not found"
- Make sure you installed Python with "Add to PATH" checked
- Restart your computer after installation

### "Module not found"
- Make sure you ran: `pip install -r requirements.txt`

### "Port 5000 already in use"
- Another program is using port 5000
- Close other applications or use a different port

### Application won't start
- Check that you're in the correct folder
- Make sure all files are extracted properly

---

## Adding More Features

The system is designed to be expandable. You can add:
- Teacher login accounts
- Student-specific records
- Email notifications
- Mobile app
- Advanced analytics

---

## Getting Help

If you have questions:
1. Check the inline code comments
2. Look at the README.md
3. Check Flask documentation: https://flask.palletsprojects.com/

---

## Next Steps

1. **Customize the system** - Add your school name, colors, etc.
2. **Add data** - Start recording daily activities
3. **Analyze** - Use the performance tab to review teacher metrics
4. **Expand** - Add new features as needed

Good luck with your School Monitoring System!
