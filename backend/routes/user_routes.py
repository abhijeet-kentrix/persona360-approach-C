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
    SuperAdmin can see all users

    Returns list of users ordered by role and first name
    """
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()

        # SuperAdmin can see all users
        if current_role == 'SuperAdmin':
            cursor.execute(
                "SELECT * FROM users ORDER BY role, first_name ASC"
            )
        else:
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

    Requires Admin or SuperAdmin role

    Request body:
        - firstName: str
        - lastName: str
        - username: str
        - password: str
        - role: str (Admin, User, Manager, SuperAdmin)
        - companyName: str (required for SuperAdmin creating admins)
        - status: bool (optional, default True)
    """
    data = request.json
    required_fields = ['firstName', 'lastName', 'username', 'password', 'role']

    # Validate required fields
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Validate role
    valid_roles = ['Admin', 'User', 'Manager', 'SuperAdmin']
    if data['role'] not in valid_roles:
        return jsonify({'error': 'Invalid role specified'}), 400

    # Only SuperAdmin can create SuperAdmin users
    if data['role'] == 'SuperAdmin' and current_role != 'SuperAdmin':
        return jsonify({'error': 'Only SuperAdmin can create SuperAdmin users'}), 403

    # Determine company name
    target_company_name = company_name

    # SuperAdmin can specify company name for creating admins
    if current_role == 'SuperAdmin':
        if data['role'] == 'Admin':
            # Company name is required when SuperAdmin creates Admin
            if not data.get('companyName'):
                return jsonify({'error': 'Company name is required when creating Admin users'}), 400
            target_company_name = data['companyName']
        elif data['role'] == 'SuperAdmin':
            # SuperAdmin users don't need a company
            target_company_name = None

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
            INSERT INTO users (first_name, last_name, company_name, username, password, role, status, dsp, created_by_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, first_name, last_name, company_name, username, role, status, dsp, created_date
            """

            cursor.execute(insert_query, (
                data['firstName'],
                data['lastName'],
                target_company_name,
                data['username'],
                hashed_password,
                data['role'],
                data.get('status', True),
                data.get('dsp', False),
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
                    'company_name': target_company_name,
                    'username': new_user['username'],
                    'role': new_user['role'],
                    'status': new_user['status'],
                    'dsp': new_user['dsp'],
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


@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@token_required
@admin_required
def update_user(current_user_id, current_username, current_role, company_name, user_id):
    """
    Update a user (password and/or dsp flag)

    Requires Admin or SuperAdmin role

    Request body:
        - password: str (optional)
        - dsp: bool (optional)
    """
    data = request.json

    if not data.get('password') and 'dsp' not in data:
        return jsonify({'error': 'At least one field (password or dsp) is required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            # Check if user exists
            cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cursor.fetchone():
                return jsonify({'error': 'User not found'}), 404

            # Build update query dynamically
            update_fields = []
            update_values = []

            if data.get('password'):
                hashed_password = hash_password(data['password'])
                update_fields.append("password = %s")
                update_values.append(hashed_password)

            if 'dsp' in data:
                update_fields.append("dsp = %s")
                update_values.append(data['dsp'])

            if not update_fields:
                return jsonify({'error': 'No valid fields to update'}), 400

            # Add user_id to values for WHERE clause
            update_values.append(user_id)

            # Execute update
            update_query = f"""
            UPDATE users
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING id, username, dsp
            """

            cursor.execute(update_query, update_values)
            updated_user = cursor.fetchone()
            conn.commit()

            return jsonify({
                'message': 'User updated successfully',
                'user': {
                    'id': updated_user['id'],
                    'username': updated_user['username'],
                    'dsp': updated_user['dsp']
                }
            }), 200

    except psycopg.DatabaseError as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500
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
