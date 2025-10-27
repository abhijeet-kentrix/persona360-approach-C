# P360 Dashboard Backend API

A modular Flask-based REST API for the P360 Dashboard application with JWT authentication, user management, and audience segmentation capabilities.

## Project Structure

```
backend/
├── app.py                      # Main application entry point
├── config.py                   # Configuration management
├── db.py                       # Database connection handler
├── InclusionExclusionLogic.py  # Audience segmentation logic
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (not in repo)
│
├── middleware/                 # Middleware and decorators
│   ├── __init__.py
│   └── auth.py                 # JWT & CSRF authentication decorators
│
├── utils/                      # Utility functions
│   ├── __init__.py
│   └── auth_utils.py           # Password hashing utilities
│
└── routes/                     # API route blueprints
    ├── __init__.py
    ├── auth_routes.py          # Authentication endpoints
    ├── user_routes.py          # User management endpoints
    ├── preset_routes.py        # Preset CRUD endpoints
    └── audience_routes.py      # Audience building endpoints
```

## Features

- **Modular Architecture**: Clean separation of concerns using Flask Blueprints
- **JWT Authentication**: Secure token-based authentication with CSRF protection
- **Role-Based Access Control**: Admin and user role management
- **Password Security**: Bcrypt password hashing
- **Database Integration**: PostgreSQL with psycopg3
- **CORS Support**: Configurable cross-origin resource sharing
- **Configuration Management**: Environment-based configuration (dev, prod, test)

## Installation

### Prerequisites

- Python 3.13.7
- PostgreSQL database
- Virtual environment (recommended)

### Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file with the following variables:
```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
PORT=5000

# Database Configuration
DBNAME=your_database_name
DBUSERNAME=your_database_user
DBPASSWORD=your_database_password
DBHOST=localhost
DBPORT=5432
```

## Running the Application

### Development Mode
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Production Mode
```bash
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | No |
| GET | `/api/auth/protected` | Test authentication | Yes |

### Users (`/api`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/get_users` | Get all users | Yes | Any |
| POST | `/api/users` | Create new user | Yes | Admin |
| DELETE | `/api/users/<id>` | Delete user | Yes | Admin |

### Presets (`/api/presets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/presets` | Get all presets (paginated) | Yes |
| GET | `/api/presets/list` | Get preset list (lightweight) | Yes |
| GET | `/api/presets/<id>` | Get preset by ID | Yes |
| GET | `/api/presets/user/<username>` | Get presets by username | Yes |
| POST | `/api/presets` | Create new preset | Yes |
| PUT | `/api/presets/<id>` | Update preset | Yes |
| DELETE | `/api/presets/<id>` | Delete preset | Yes |

### Audience (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/build-audience` | Build audience segments | Yes |
| POST | `/api/get_segments` | Legacy segment endpoint | No |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/` | Root endpoint | No |

## Authentication

The API uses JWT (JSON Web Tokens) with CSRF protection:

1. **Login**: POST credentials to `/api/auth/login`
2. **Token Storage**: JWT token stored in httponly cookie
3. **CSRF Token**: Separate CSRF token for request validation
4. **Protected Routes**: Use `@token_required` decorator

### Making Authenticated Requests

Include both:
- JWT token in cookie (automatic)
- CSRF token in `X-CSRF-TOKEN` header

Example:
```javascript
fetch('/api/presets', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'X-CSRF-TOKEN': csrfToken
  }
})
```

## Configuration

The application supports multiple configurations:

- **Development**: Debug enabled, insecure cookies
- **Production**: Debug disabled, secure cookies
- **Testing**: Testing mode enabled

Set via `FLASK_ENV` environment variable:
```bash
export FLASK_ENV=production
```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password`: Bcrypt hashed password
- `first_name`, `last_name`: User names
- `company_name`: Company association
- `role`: User role (Admin, User, Manager)
- `status`: Account status (active/inactive)
- `created_date`, `last_login_date`: Timestamps
- `created_by_id`: Foreign key to creating user

### Presets Table
- `preset_id`: Primary key
- `preset_name`: Preset name
- `preset_filter_json`: JSON filter configuration
- `company_name`: Company association
- `username`: Owner username
- `created_date`: Timestamp
- `created_by_id`: Foreign key to creating user

## Development

### Adding New Routes

1. Create new blueprint in `routes/` directory:
```python
from flask import Blueprint, jsonify
from middleware.auth import token_required

new_bp = Blueprint('new_feature', __name__, url_prefix='/api/new')

@new_bp.route('/', methods=['GET'])
@token_required
def get_data(current_user_id, current_username, current_role, company_name):
    return jsonify({'message': 'Hello'})
```

2. Register blueprint in `app.py`:
```python
from routes.new_routes import new_bp
app.register_blueprint(new_bp)
```

### Adding Middleware

Create decorators in `middleware/` directory:
```python
from functools import wraps
from flask import jsonify

def custom_decorator(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Your logic here
        return f(*args, **kwargs)
    return decorated
```

## Security Best Practices

1. **Never commit `.env` file** - Contains sensitive credentials
2. **Use strong SECRET_KEY** - Generate using `secrets.token_hex(32)`
3. **Enable HTTPS in production** - Set `COOKIE_SECURE=True`
4. **Validate all inputs** - Prevent SQL injection and XSS
5. **Use parameterized queries** - Already implemented
6. **Rate limiting** - Consider adding Flask-Limiter
7. **Logging** - Implement proper logging for production

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Testing

Run tests (when implemented):
```bash
pytest tests/
```

## Contributing

1. Follow PEP 8 style guide
2. Add docstrings to all functions
3. Write unit tests for new features
4. Update this README for new endpoints

## License

Proprietary - P360 Dashboard Project

## Support

For issues or questions, contact the development team.
