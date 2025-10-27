# Migration Guide - Refactored Backend

This document explains the changes made during the refactoring and how to work with the new structure.

## What Changed?

### Before (Monolithic Structure)
- Single `app.py` file with 833 lines
- All routes, authentication, and utilities in one file
- Hardcoded configuration values
- Difficult to maintain and test

### After (Modular Structure)
- Clean separation of concerns
- Blueprint-based routing
- Configuration management
- Reusable utilities and middleware
- Easy to extend and maintain

## File Structure Changes

### New Files Created

```
backend/
├── config.py                   # NEW: Configuration management
├── middleware/
│   ├── __init__.py            # NEW
│   └── auth.py                # NEW: Authentication decorators
├── utils/
│   ├── __init__.py            # NEW
│   └── auth_utils.py          # NEW: Password utilities
└── routes/
    ├── __init__.py            # NEW
    ├── auth_routes.py         # NEW: Login, logout, protected
    ├── user_routes.py         # NEW: User CRUD operations
    ├── preset_routes.py       # NEW: Preset CRUD operations
    └── audience_routes.py     # NEW: Audience building
```

### Modified Files

- `app.py`: Simplified to 70 lines using application factory pattern
- `db.py`: No changes required

## API Endpoints - No Changes!

All existing API endpoints remain the same:

- `/api/auth/login` → Still works
- `/api/auth/logout` → Still works
- `/api/users` → Still works
- `/api/presets` → Still works
- `/api/build-audience` → Still works

**Frontend code does not need to change!**

## Configuration Updates

### Old Way (Hardcoded)
```python
app.config['SECRET_KEY'] = 'super-secret-key'
```

### New Way (Environment-based)
```python
# In .env file
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

The application automatically loads the correct configuration.

## Code Organization

### Authentication Middleware

**Before:**
```python
# Inside app.py
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # 20+ lines of code
```

**After:**
```python
# In middleware/auth.py
from middleware.auth import token_required

@app.route('/api/protected')
@token_required
def protected(current_user_id, current_username, current_role, company_name):
    return jsonify({'message': 'Success'})
```

### Password Utilities

**Before:**
```python
# Inside app.py
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
```

**After:**
```python
# Import from utils
from utils.auth_utils import hash_password, check_password

hashed = hash_password('mypassword')
```

### Route Organization

**Before:**
```python
# All in app.py
@app.route('/api/auth/login', methods=['POST'])
def login():
    # code

@app.route('/api/users', methods=['POST'])
def create_user():
    # code
```

**After:**
```python
# routes/auth_routes.py
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    # code

# routes/user_routes.py
user_bp = Blueprint('users', __name__, url_prefix='/api')

@user_bp.route('/users', methods=['POST'])
def create_user():
    # code
```

## Benefits of Refactoring

### 1. Maintainability
- Each file has a single responsibility
- Easy to locate and fix bugs
- Changes don't affect unrelated code

### 2. Testability
- Each module can be tested independently
- Mock dependencies easily
- Write focused unit tests

### 3. Scalability
- Add new features without touching existing code
- Multiple developers can work simultaneously
- Easy to add new blueprints

### 4. Reusability
- Utilities can be used across routes
- Middleware can be combined
- Configuration can be switched

### 5. Security
- Environment-based secrets
- No hardcoded credentials
- Easy to manage different environments

## Running the Application

### Development
```bash
# No changes from before
python app.py
```

### Production
```bash
# Set environment
export FLASK_ENV=production
export SECRET_KEY=your-secure-secret-key

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Adding New Features

### Example: Adding a new endpoint

1. **Create new route file** (if needed):
```python
# routes/reports_routes.py
from flask import Blueprint, jsonify
from middleware.auth import token_required

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('/', methods=['GET'])
@token_required
def get_reports(current_user_id, current_username, current_role, company_name):
    return jsonify({'reports': []})
```

2. **Register blueprint**:
```python
# app.py
from routes.reports_routes import reports_bp

def create_app(config_name=None):
    app = Flask(__name__)
    # ... existing code ...
    app.register_blueprint(reports_bp)  # Add this line
    return app
```

That's it! No need to modify existing routes.

## Troubleshooting

### Import Errors
If you see `ModuleNotFoundError`:
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Configuration Not Loading
Ensure `.env` file exists in the backend directory:
```bash
# Check if .env exists
ls -la .env

# If not, create it
cp .env.example .env  # If you have an example
```

### Database Connection Issues
The database connection code hasn't changed, but verify:
```python
# db.py still uses the same environment variables
DBNAME, DBUSERNAME, DBPASSWORD, DBHOST, DBPORT
```

## Backward Compatibility

The refactoring maintains 100% backward compatibility:

- ✅ All API endpoints work the same
- ✅ Authentication flow unchanged
- ✅ Database queries unchanged
- ✅ Response formats unchanged
- ✅ Frontend code works without changes

## Next Steps

Consider these improvements:

1. **Add Unit Tests**: Test each route independently
2. **Add Logging**: Implement structured logging
3. **Add Rate Limiting**: Prevent API abuse
4. **Add API Documentation**: Use Flask-RESTX or similar
5. **Add Request Validation**: Use marshmallow or pydantic
6. **Add Database Migrations**: Use Alembic

## Questions?

Review the main `README.md` for detailed documentation on:
- API endpoints
- Authentication
- Configuration options
- Development guidelines
