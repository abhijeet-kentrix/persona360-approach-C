# Quick Start Guide

Get the P360 Dashboard Backend API running in 5 minutes!

## Prerequisites

- Python 3.13.7 installed
- PostgreSQL database running
- Git (optional)

## Step 1: Setup Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

## Step 2: Install Dependencies

```bash
# Install all required packages
pip install -r requirements.txt
```

## Step 3: Configure Environment

Create a `.env` file in the backend directory:

```bash
# Copy this template and fill in your values

# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
PORT=5000

# Database Configuration
DBNAME=p360_dashboard
DBUSERNAME=postgres
DBPASSWORD=your-database-password
DBHOST=localhost
DBPORT=5432
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Step 4: Setup Database

Make sure your PostgreSQL database has these tables:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_date TIMESTAMP,
    created_by_id INTEGER REFERENCES users(id)
);

-- Presets table
CREATE TABLE presets (
    preset_id SERIAL PRIMARY KEY,
    preset_name VARCHAR(255) NOT NULL,
    preset_filter_json JSONB NOT NULL,
    company_name VARCHAR(100),
    username VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id INTEGER REFERENCES users(id),
    UNIQUE(company_name, username, preset_name)
);
```

## Step 5: Run the Application

```bash
# Start the development server
python app.py
```

You should see:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

## Step 6: Test the API

### Check Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

### Test Login (Create a test user first)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword"
  }'
```

## Common Commands

### Start Development Server
```bash
python app.py
```

### Run with Different Port
```bash
PORT=8000 python app.py
```

### Run in Production Mode
```bash
FLASK_ENV=production python app.py
```

### Check Python Version
```bash
python --version
```

### View Installed Packages
```bash
pip list
```

### Update Dependencies
```bash
pip install --upgrade -r requirements.txt
```

## Project Structure Quick Reference

```
backend/
├── app.py              # Main application (START HERE)
├── config.py           # Configuration settings
├── db.py              # Database connection
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (CREATE THIS)
│
├── middleware/         # Authentication & decorators
│   └── auth.py
│
├── utils/             # Helper functions
│   └── auth_utils.py
│
└── routes/            # API endpoints
    ├── auth_routes.py      # /api/auth/*
    ├── user_routes.py      # /api/users/*
    ├── preset_routes.py    # /api/presets/*
    └── audience_routes.py  # /api/build-audience
```

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/protected` - Test auth (protected)

### Users
- `GET /api/get_users` - List all users
- `POST /api/users` - Create user (admin only)
- `DELETE /api/users/<id>` - Delete user (admin only)

### Presets
- `GET /api/presets` - List presets (paginated)
- `GET /api/presets/<id>` - Get single preset
- `POST /api/presets` - Create preset
- `PUT /api/presets/<id>` - Update preset
- `DELETE /api/presets/<id>` - Delete preset

### Audience
- `POST /api/build-audience` - Build audience segments

## Troubleshooting

### Issue: "Module not found" error
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Database connection failed"
```bash
# Check if PostgreSQL is running
# Windows:
services.msc  # Look for PostgreSQL

# macOS/Linux:
sudo service postgresql status

# Verify .env file has correct credentials
cat .env | grep DB
```

### Issue: "Port already in use"
```bash
# Use a different port
PORT=8000 python app.py

# Or kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# macOS/Linux:
lsof -i :5000
kill -9 <process_id>
```

### Issue: "SECRET_KEY not set"
```bash
# Generate and add to .env
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))" >> .env
```

### Issue: Import errors after refactoring
```bash
# Make sure you're in the backend directory
pwd  # Should show: .../backend

# Try running with module path
PYTHONPATH=. python app.py
```

## Development Workflow

### 1. Create a new feature
```bash
# Create new route file
touch routes/new_feature_routes.py

# Edit the file and add your routes
code routes/new_feature_routes.py
```

### 2. Register the blueprint
```python
# In app.py
from routes.new_feature_routes import new_feature_bp
app.register_blueprint(new_feature_bp)
```

### 3. Test your endpoint
```bash
# Restart the server
python app.py

# Test with curl
curl http://localhost:5000/api/your-new-endpoint
```

## Next Steps

- Read `README.md` for detailed documentation
- Review `ARCHITECTURE.md` to understand the structure
- Check `MIGRATION_GUIDE.md` if upgrading from old version
- Add unit tests for your features
- Implement error logging

## Useful Resources

- Flask Documentation: https://flask.palletsprojects.com/
- psycopg3 Documentation: https://www.psycopg.org/psycopg3/
- JWT Documentation: https://pyjwt.readthedocs.io/
- bcrypt Documentation: https://github.com/pyca/bcrypt/

## Getting Help

1. Check the error message in terminal
2. Review the relevant route file in `routes/`
3. Check database connection in `db.py`
4. Verify environment variables in `.env`
5. Review middleware in `middleware/auth.py`

## Production Deployment

For production deployment with gunicorn:

```bash
# Install gunicorn
pip install gunicorn

# Run with 4 workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# With logging
gunicorn -w 4 -b 0.0.0.0:5000 --access-logfile - --error-logfile - app:app
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| SECRET_KEY | Flask secret key for signing | Generated hex string |
| FLASK_ENV | Environment mode | development/production |
| PORT | Server port | 5000 |
| DBNAME | Database name | p360_dashboard |
| DBUSERNAME | Database user | postgres |
| DBPASSWORD | Database password | yourpassword |
| DBHOST | Database host | localhost |
| DBPORT | Database port | 5432 |

## Testing the Full Stack

### 1. Start backend
```bash
python app.py
```

### 2. Start frontend (in separate terminal)
```bash
cd ../frontend
npm start
```

### 3. Access application
Open browser: http://localhost:3000

## Success!

You're now running the P360 Dashboard Backend API!

The API is available at: `http://localhost:5000`

Start building amazing features!
