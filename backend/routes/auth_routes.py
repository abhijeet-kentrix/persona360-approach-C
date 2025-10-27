from flask import Blueprint, request, jsonify, make_response, current_app
import jwt
import datetime
import secrets
from db import get_db_connection
from utils.auth_utils import check_password
from middleware.auth import token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint

    Request body:
        - username: str
        - password: str

    Returns:
        - JWT token in httponly cookie
        - CSRF token in cookie
        - User information
    """
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()

        # Fetch user from database
        cursor.execute("""
            SELECT id, username, password, role, status, first_name, last_name, company_name
            FROM users WHERE username = %s
        """, (username,))

        user = cursor.fetchone()

        # Validate credentials
        if not user or not check_password(password, user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Check if account is active
        if not user['status']:
            return jsonify({'error': 'Account is disabled'}), 401

        # Update last login
        last_login = datetime.datetime.utcnow()
        cursor.execute(
            "UPDATE users SET last_login_date = %s WHERE id = %s",
            (last_login, user['id'])
        )
        conn.commit()

        # Generate JWT token
        jwt_token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'company_name': user['company_name'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(
                hours=current_app.config['JWT_EXPIRATION_HOURS']
            )
        }, current_app.config['SECRET_KEY'], algorithm=current_app.config['JWT_ALGORITHM'])

        # Generate CSRF token
        csrf_token = secrets.token_hex(16)

        # Prepare response
        resp = make_response(jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'company_name': user['company_name']
            }
        }))

        # Set cookies
        resp.set_cookie(
            'token',
            jwt_token,
            httponly=current_app.config['COOKIE_HTTPONLY'],
            secure=current_app.config['COOKIE_SECURE'],
            samesite=current_app.config['COOKIE_SAMESITE'],
            max_age=current_app.config['COOKIE_MAX_AGE']
        )
        resp.set_cookie(
            'csrf_token',
            csrf_token,
            httponly=False,
            secure=current_app.config['COOKIE_SECURE'],
            samesite=current_app.config['COOKIE_SAMESITE'],
            max_age=current_app.config['COOKIE_MAX_AGE']
        )

        return resp

    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500
    finally:
        conn.close()


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    User logout endpoint

    Clears JWT and CSRF tokens from cookies
    """
    resp = make_response(jsonify({'message': 'Logged out successfully'}))
    resp.set_cookie('token', '', expires=0)
    resp.set_cookie('csrf_token', '', expires=0)
    return resp


@auth_bp.route('/protected', methods=['GET'])
@token_required
def protected(current_user_id, current_username, current_role, company_name):
    """
    Protected endpoint to test authentication

    Requires valid JWT and CSRF tokens
    """
    return jsonify({
        'message': f'Welcome {current_username}, you are authenticated.',
        'user_id': current_user_id,
        'user_name': current_username,
        'company_name': company_name,
        'role': current_role
    })
