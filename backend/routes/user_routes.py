from flask import Blueprint, request, jsonify
import psycopg
from db import get_db_connection
from middleware.auth import token_required, admin_required
from utils.auth_utils import hash_password

user_bp = Blueprint('users', __name__, url_prefix='/api')


@user_bp.route('/get_users', methods=['GET'])
@token_required
def get_users(current_user_id, current_username, current_role, company_name):
    """
    Get all users for the current company

    Returns list of users ordered by role and first name
    """
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE company_name = %s ORDER BY role, first_name ASC",
            (company_name,)
        )
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        users = [{col: row[col] for col in columns if col in row} for row in rows]
        return jsonify({'users': users}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to fetch users: {str(e)}'}), 500
    finally:
        if cursor:
            cursor.close()
        conn.close()


@user_bp.route('/users', methods=['POST'])
@token_required
@admin_required
def create_user(current_user_id, current_username, current_role, company_name):
    """
    Create a new user

    Requires Admin or super_admin role

    Request body:
        - firstName: str
        - lastName: str
        - username: str
        - password: str
        - role: str (Admin, User, Manager)
        - status: bool (optional, default True)
    """
    data = request.json
    required_fields = ['firstName', 'lastName', 'username', 'password', 'role']

    # Validate required fields
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Validate role
    valid_roles = ['Admin', 'User', 'Manager']
    if data['role'] not in valid_roles:
        return jsonify({'error': 'Invalid role specified'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            # Check if username already exists
            cursor.execute("SELECT id FROM users WHERE username = %s", (data['username'],))
            if cursor.fetchone():
                return jsonify({'error': 'Username already exists'}), 409

            # Hash password
            hashed_password = hash_password(data['password'])

            # Insert new user
            insert_query = """
            INSERT INTO users (first_name, last_name, company_name, username, password, role, status, created_by_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, first_name, last_name, company_name, username, role, status, created_date
            """

            cursor.execute(insert_query, (
                data['firstName'],
                data['lastName'],
                company_name,
                data['username'],
                hashed_password,
                data['role'],
                data.get('status', True),
                current_user_id
            ))

            new_user = cursor.fetchone()
            conn.commit()

            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': new_user['id'],
                    'first_name': new_user['first_name'],
                    'last_name': new_user['last_name'],
                    'company_name': company_name,
                    'username': new_user['username'],
                    'role': new_user['role'],
                    'status': new_user['status'],
                    'created_date': new_user['created_date'].isoformat()
                }
            }), 201

    except psycopg.DatabaseError as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to create user: {str(e)}'}), 500
    finally:
        conn.close()


@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user_id, current_username, current_role, company_name, user_id):
    """
    Delete a user

    Requires Admin or super_admin role
    Cannot delete your own account
    """
    if current_user_id == user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            # Check if user exists
            cursor.execute(
                "SELECT id, username FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            if not user:
                return jsonify({'error': 'User not found'}), 404

            # Delete user
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            conn.commit()

            if cursor.rowcount == 0:
                return jsonify({'error': 'User not found'}), 404

            return jsonify({
                'message': f'User {user["username"]} deleted successfully'
            }), 200

    except psycopg.DatabaseError as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500
    finally:
        conn.close()
