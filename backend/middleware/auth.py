from functools import wraps
from flask import request, jsonify, current_app
import jwt


def token_required(f):
    """
    Middleware to protect routes with JWT and CSRF token validation

    This decorator validates:
    1. JWT token from cookies
    2. CSRF token from cookies and headers

    The decorated function will receive:
    - current_user_id: User ID from JWT
    - current_username: Username from JWT
    - current_role: User role from JWT
    - company_name: Company name from JWT
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # Extract tokens from request
        token = request.cookies.get('token')
        csrf_cookie = request.cookies.get('csrf_token')
        csrf_header = request.headers.get('X-CSRF-TOKEN')

        # Validate token presence
        if not token or not csrf_cookie or not csrf_header:
            return jsonify({'error': 'Missing auth or CSRF token'}), 401

        # Validate CSRF token
        if csrf_cookie != csrf_header:
            return jsonify({'error': 'Invalid CSRF token'}), 403

        try:
            # Decode JWT token
            data = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=[current_app.config['JWT_ALGORITHM']]
            )

            # Extract user information
            current_user_id = data['user_id']
            company_name = data['company_name']
            current_username = data['username']
            current_role = data['role']

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Call the decorated function with user information
        return f(current_user_id, current_username, current_role, company_name, *args, **kwargs)

    return decorated


def admin_required(f):
    """
    Middleware to restrict access to admin users only

    This decorator should be used after @token_required
    """
    @wraps(f)
    def decorated(current_user_id, current_username, current_role, company_name, *args, **kwargs):
        if current_role not in ['Admin', 'SuperAdmin']:
            return jsonify({'error': 'Insufficient permissions'}), 403

        return f(current_user_id, current_username, current_role, company_name, *args, **kwargs)

    return decorated
