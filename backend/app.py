from flask import Flask, request, jsonify, make_response
import jwt
import datetime
from functools import wraps
import secrets
from flask_cors import CORS
from db import get_db_connection
from dotenv import load_dotenv
import bcrypt
import psycopg
import json
from InclusionExclusionLogic import build_audience_segments

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'super-secret-key'  # Use env variable in production

USER_DB = {
    "abhijeet": "abhi@kentrix",
    'john.doe': 'password123'
}


def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def check_password(password, hashed):
    """Check password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


# Middleware to protect JWT + check CSRF
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        csrf_cookie = request.cookies.get('csrf_token')
        csrf_header = request.headers.get('X-CSRF-TOKEN')

        if not token or not csrf_cookie or not csrf_header:
            return jsonify({'error': 'Missing auth or CSRF token'}), 401

        if csrf_cookie != csrf_header:
            return jsonify({'error': 'Invalid CSRF token'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_id = data['user_id']
            company_name = data['company_name']
            current_user = data['username']
            current_role = data['role']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_id, current_user, current_role, company_name, *args, **kwargs)

    return decorated


# ========================================
# AUTHENTICATION ROUTES
# ========================================

@app.route('/api/auth/login', methods=['POST'])
def login():
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

        cursor.execute("""
            SELECT id, username, password, role, status, first_name, last_name, company_name 
            FROM users WHERE username = %s
        """, (username,))

        user = cursor.fetchone()

        if not user or not check_password(password, user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        if not user['status']:
            return jsonify({'error': 'Account is disabled'}), 401

        last_login = datetime.datetime.utcnow()

        cursor.execute(
            "UPDATE users SET last_login_date = %s WHERE id = %s",
            (last_login, user['id'])
        )
        conn.commit()

        jwt_token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'company_name': user['company_name'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        csrf_token = secrets.token_hex(16)

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

        resp.set_cookie('token', jwt_token, httponly=True, secure=False, samesite='Lax', max_age=28800)
        resp.set_cookie('csrf_token', csrf_token, httponly=False, secure=False, samesite='Lax', max_age=28800)

        return resp

    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/protected', methods=['GET'])
@token_required
def protected(current_user_id, current_username, current_role, company_name):
    return jsonify({
        'message': f'Welcome {current_username}, you are authenticated.',
        'user_id': current_user_id,
        'user_name': current_username,
        'company_name': company_name,
        'role': current_role
    })


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({'message': 'Logged out successfully'}))
    resp.set_cookie('token', '', expires=0)
    resp.set_cookie('csrf_token', '', expires=0)
    return resp


# ========================================
# USER MANAGEMENT ROUTES
# ========================================

@app.route('/api/get_users', methods=['GET'])
@token_required
def get_users(current_user_id, current_username, current_role, company_name):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE company_name = %s ORDER BY role,first_name ASC", (company_name,))
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


@app.route('/api/users', methods=['POST'])
@token_required
def create_user(current_user_id, current_username, current_role, company_name):
    if current_role not in ['Admin', 'super_admin']:
        return jsonify({'error': 'Insufficient permissions'}), 403

    data = request.json
    required_fields = ['firstName', 'lastName', 'username', 'password', 'role']

    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    valid_roles = ['Admin', 'User', 'Manager']
    if data['role'] not in valid_roles:
        return jsonify({'error': 'Invalid role specified'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE username = %s", (data['username'],))
            if cursor.fetchone():
                return jsonify({'error': 'Username already exists'}), 409

            hashed_password = hash_password(data['password'])

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


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(current_user_id, current_username, current_role, company_name, user_id):
    if current_role not in ['Admin', 'super_admin']:
        return jsonify({'error': 'Insufficient permissions'}), 403

    if current_user_id == user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, username FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            if not user:
                return jsonify({'error': 'User not found'}), 404

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


# ========================================
# PRESET CRUD OPERATIONS
# ========================================

@app.route('/api/presets', methods=['POST'])
@token_required
def create_preset(current_user_id, current_username, current_role, company_name):
    data = request.json
    required_fields = ['preset_name', 'preset_filter_json']

    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    try:
        if isinstance(data['preset_filter_json'], str):
            json.loads(data['preset_filter_json'])
    except json.JSONDecodeError:
        return jsonify({'error': 'preset_filter_json must be valid JSON'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT preset_id FROM presets 
                WHERE company_name = %s AND username = %s AND preset_name = %s
            """, (company_name, current_username, data['preset_name']))

            if cursor.fetchone():
                return jsonify({'error': 'Preset with this name already exists'}), 409

            insert_query = """
            INSERT INTO presets (company_name, username, preset_name,  
                               preset_filter_json, created_by_id)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING preset_id, company_name, username, preset_name,
                     preset_filter_json, created_by_id, created_date
            """

            cursor.execute(insert_query, (
                company_name,
                current_username,
                data['preset_name'],
                json.dumps(data['preset_filter_json']) if isinstance(data['preset_filter_json'], dict) else
                data['preset_filter_json'],
                current_user_id
            ))

            new_preset = cursor.fetchone()
            conn.commit()

            return jsonify({
                'message': 'Preset created successfully',
                'preset': {
                    'preset_id': new_preset['preset_id'],
                    'company_name': new_preset['company_name'],
                    'username': new_preset['username'],
                    'preset_name': new_preset['preset_name'],
                    'preset_filter_json': new_preset['preset_filter_json'],
                    'created_date': new_preset['created_date'].isoformat()
                }
            }), 201

    except psycopg.DatabaseError as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to create preset: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/presets/list', methods=['GET'])
@token_required
def get_presets_list(current_user_id, current_username, current_role, company_name):
    """
    Lightweight endpoint to fetch only preset IDs and names (no JSON data)
    Use this for populating dropdowns
    """
    print(f"Fetching preset list for user: {current_username}, company: {company_name}")

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            query = """
            SELECT preset_id, preset_name, created_date
            FROM presets
            WHERE company_name = %s
            """
            params = [company_name]

            if current_role not in ['Admin', 'super_admin']:
                query += " AND username = %s"
                params.append(current_username)

            query += " ORDER BY created_date DESC"

            cursor.execute(query, params)
            presets = cursor.fetchall()

            print(f"Found {len(presets)} presets")

            presets_list = []
            for preset in presets:
                presets_list.append({
                    'preset_id': preset['preset_id'],
                    'preset_name': preset['preset_name'],
                    'created_date': preset['created_date'].isoformat()
                })
                print(f"Preset: {preset['preset_name']} (ID: {preset['preset_id']})")

            return jsonify({
                'presets': presets_list,
                'count': len(presets_list)
            }), 200

    except Exception as e:
        print(f"Error fetching preset list: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to fetch preset list: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/presets', methods=['GET'])
@token_required
def get_all_presets(current_user_id, current_username, current_role, company_name):
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    search = request.args.get('search', '')

    offset = (page - 1) * limit

    print(f"Fetching presets for user: {current_username}, company: {company_name}, role: {current_role}")

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            base_query = """
            SELECT preset_id, company_name, username, preset_name,
                   preset_filter_json, created_date, created_by_id
            FROM presets
            WHERE company_name = %s
            """
            params = [company_name]

            if current_role not in ['Admin', 'super_admin']:
                base_query += " AND username = %s"
                params.append(current_username)

            if search:
                base_query += " AND preset_name ILIKE %s"
                params.append(f'%{search}%')

            # Get count first
            count_query = f"""
            SELECT COUNT(*) as count
            FROM presets
            WHERE company_name = %s
            """
            count_params = [company_name]

            if current_role not in ['Admin', 'super_admin']:
                count_query += " AND username = %s"
                count_params.append(current_username)

            if search:
                count_query += " AND preset_name ILIKE %s"
                count_params.append(f'%{search}%')

            cursor.execute(count_query, count_params)
            count_result = cursor.fetchone()
            total_count = count_result[0] if isinstance(count_result, tuple) else count_result['count']

            print(f"Total count: {total_count}")

            # Get paginated results
            base_query += " ORDER BY created_date DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            print(f"Executing query with params: {params}")
            cursor.execute(base_query, params)
            presets = cursor.fetchall()

            print(f"Found {len(presets)} presets")

            presets_list = []
            for preset in presets:
                preset_dict = {
                    'preset_id': preset['preset_id'],
                    'company_name': preset['company_name'],
                    'username': preset['username'],
                    'preset_name': preset['preset_name'],
                    'preset_filter_json': preset['preset_filter_json'],
                    'created_date': preset['created_date'].isoformat(),
                    'created_by_id': preset['created_by_id']
                }
                presets_list.append(preset_dict)
                print(f"Preset: {preset['preset_name']} (ID: {preset['preset_id']})")

            response_data = {
                'presets': presets_list,
                'pagination': {
                    'current_page': page,
                    'limit': limit,
                    'total_count': total_count,
                    'total_pages': (total_count + limit - 1) // limit if total_count > 0 else 0
                }
            }

            print(f"Returning {len(presets_list)} presets")
            return jsonify(response_data), 200

    except psycopg.DatabaseError as e:
        print(f"Database error: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"Error fetching presets: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to fetch presets: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/presets/<int:preset_id>', methods=['GET'])
@token_required
def get_preset_by_id(current_user_id, current_username, current_role, company_name, preset_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            query = """
            SELECT preset_id, company_name, username, preset_name,
                   preset_filter_json, created_date, created_by_id
            FROM presets
            WHERE preset_id = %s AND company_name = %s
            """
            params = [preset_id, company_name]
            cursor.execute(query, params)
            preset = cursor.fetchone()

            if not preset:
                return jsonify({'error': 'Preset not found'}), 404

            return jsonify({
                'preset': {
                    'preset_id': preset['preset_id'],
                    'company_name': preset['company_name'],
                    'username': preset['username'],
                    'preset_name': preset['preset_name'],
                    'preset_filter_json': preset['preset_filter_json'],
                    'created_date': preset['created_date'].isoformat(),
                    'created_by_id': preset['created_by_id']
                }
            }), 200

    except psycopg.DatabaseError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to fetch preset: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/presets/<int:preset_id>', methods=['PUT'])
@token_required
def update_preset(current_user_id, current_username, current_role, company_name, preset_id):
    data = request.json

    if 'preset_filter_json' in data:
        try:
            if isinstance(data['preset_filter_json'], str):
                json.loads(data['preset_filter_json'])
        except json.JSONDecodeError:
            return jsonify({'error': 'preset_filter_json must be valid JSON'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            check_query = """
            SELECT preset_id, username FROM presets 
            WHERE preset_id = %s AND company_name = %s
            """
            params = [preset_id, company_name]

            if current_role not in ['Admin', 'super_admin']:
                check_query += " AND username = %s"
                params.append(current_username)

            cursor.execute(check_query, params)
            existing_preset = cursor.fetchone()

            if not existing_preset:
                return jsonify({'error': 'Preset not found or access denied'}), 404

            if 'preset_name' in data:
                cursor.execute("""
                    SELECT preset_id FROM presets 
                    WHERE company_name = %s AND username = %s AND preset_name = %s AND preset_id != %s
                """, (company_name, existing_preset['username'], data['preset_name'], preset_id))

                if cursor.fetchone():
                    return jsonify({'error': 'Preset with this name already exists'}), 409

            update_fields = []
            update_params = []

            # Only update fields that exist in your schema
            for field in ['preset_name', 'preset_filter_json']:
                if field in data:
                    update_fields.append(f"{field} = %s")
                    if field == 'preset_filter_json':
                        update_params.append(
                            json.dumps(data[field]) if isinstance(data[field], dict) else data[field])
                    else:
                        update_params.append(data[field])

            if not update_fields:
                return jsonify({'error': 'No valid fields to update'}), 400

            update_query = f"""
            UPDATE presets 
            SET {', '.join(update_fields)}
            WHERE preset_id = %s
            RETURNING preset_id, company_name, username, preset_name,
                     preset_filter_json, created_date, created_by_id
            """
            update_params.append(preset_id)

            cursor.execute(update_query, update_params)
            updated_preset = cursor.fetchone()
            conn.commit()

            return jsonify({
                'message': 'Preset updated successfully',
                'preset': {
                    'preset_id': updated_preset['preset_id'],
                    'company_name': updated_preset['company_name'],
                    'username': updated_preset['username'],
                    'preset_name': updated_preset['preset_name'],
                    'preset_filter_json': updated_preset['preset_filter_json'],
                    'created_date': updated_preset['created_date'].isoformat(),
                    'created_by_id': updated_preset['created_by_id']
                }
            }), 200

    except psycopg.DatabaseError as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to update preset: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/presets/<int:preset_id>', methods=['DELETE'])
@token_required
def delete_preset(current_user_id, current_username, current_role, company_name, preset_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            check_query = """
            SELECT preset_id, preset_name FROM presets 
            WHERE preset_id = %s AND company_name = %s
            """
            params = [preset_id, company_name]

            cursor.execute(check_query, params)
            preset = cursor.fetchone()

            if not preset:
                return jsonify({'error': 'Preset not found or access denied'}), 404

            cursor.execute("DELETE FROM presets WHERE preset_id = %s", (preset_id,))
            conn.commit()

            return jsonify({
                'message': f'Preset "{preset["preset_name"]}" deleted successfully'
            }), 200

    except psycopg.DatabaseError as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Failed to delete preset: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/presets/user/<string:username>', methods=['GET'])
@token_required
def get_presets_by_username(current_user_id, current_username, current_role, company_name, username):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT preset_id, company_name, username, preset_name,
                       preset_filter_json, created_date, created_by_id
                FROM presets
                WHERE company_name = %s AND username = %s
                ORDER BY created_date DESC
            """, (company_name, username))

            presets = cursor.fetchall()

            presets_list = []
            for preset in presets:
                presets_list.append({
                    'preset_id': preset['preset_id'],
                    'company_name': company_name,
                    'username': preset['username'],
                    'preset_name': preset['preset_name'],
                    'preset_filter_json': preset['preset_filter_json'],
                    'created_date': preset['created_date'].isoformat(),
                    'created_by_id': preset['created_by_id']
                })

            return jsonify({
                'presets': presets_list,
                'count': len(presets_list)
            }), 200

    except psycopg.DatabaseError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user presets: {str(e)}'}), 500
    finally:
        conn.close()


# ========================================
# BUILD AUDIENCE ENDPOINT
# ========================================

@app.route('/api/build-audience', methods=['POST'])
@token_required
def build_audience(current_user_id, current_username, current_role, company_name):
    """
    Build audience based on filter criteria.
    This endpoint receives the preset JSON and returns inclusion/exclusion segments.
    Replace the sample logic with your actual audience building algorithm.
    """
    data = request.json



    if not data:
        return jsonify({'error': 'No filter data provided'}), 400

    try:
        # Extract filter data
        audience_filters = data.get('audienceFilters', {})
        segments = data.get('segments', {})

        # Log the received data for debugging
        print(f"Building audience for user: {current_username}")
        print(f"Filters received: {json.dumps(audience_filters, indent=2)}")

        # ============================================
        # IMPLEMENT YOUR AUDIENCE BUILDING LOGIC HERE
        # ============================================

        # Return the built audience segments
        response_data=build_audience_segments(audience_filters,current_username)

        # ============================================
        # END OF SAMPLE LOGIC
        # ============================================


        print(f"Built audience: {json.dumps(response_data, indent=2)}")

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error building audience: {str(e)}")
        return jsonify({'error': f'Failed to build audience: {str(e)}'}), 500


# ========================================
# LEGACY ENDPOINT (Keep for compatibility)
# ========================================

@app.route('/get_segments', methods=['POST'])
def get_segments():
    """Legacy endpoint - kept for backward compatibility"""
    data = request.json
    print("Legacy get_segments endpoint called")
    print(data)
    return jsonify({'message': 'Output from legacy endpoint'})


@app.route('/api', methods=['POST', 'GET'])
@token_required
def index(current_user_id, current_username, current_role, company_name):
    """General API endpoint"""
    data = request.json
    print("Index endpoint called")
    print(data)
    return jsonify({"message": "INDEX"}), 201


if __name__ == '__main__':
    app.run(debug=True)