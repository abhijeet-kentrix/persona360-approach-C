from flask import Blueprint, request, jsonify
import psycopg
import json
from db import get_db_connection
from middleware.auth import token_required

preset_bp = Blueprint('presets', __name__, url_prefix='/api/presets')


@preset_bp.route('', methods=['POST'])
@token_required
def create_preset(current_user_id, current_username, current_role, company_name, dsp):
    """
    Create a new preset

    Request body:
        - preset_name: str
        - preset_filter_json: dict or str (JSON)
    """
    data = request.json
    required_fields = ['preset_name', 'preset_filter_json']

    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Validate JSON
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
            # Check if preset name already exists
            cursor.execute("""
                SELECT preset_id FROM presets
                WHERE company_name = %s AND username = %s AND preset_name = %s
            """, (company_name, current_username, data['preset_name']))

            if cursor.fetchone():
                return jsonify({'error': 'Preset with this name already exists'}), 409

            # Insert new preset
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
                json.dumps(data['preset_filter_json']) if isinstance(data['preset_filter_json'], dict) else data['preset_filter_json'],
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


@preset_bp.route('/list', methods=['GET'])
@token_required
def get_presets_list(current_user_id, current_username, current_role, company_name, dsp):
    """
    Lightweight endpoint to fetch only preset IDs and names (no JSON data)
    Use this for populating dropdowns
    """
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

            # Non-admin users can only see their own presets
            if current_role not in ['Admin', 'super_admin']:
                query += " AND username = %s"
                params.append(current_username)

            query += " ORDER BY created_date DESC"

            cursor.execute(query, params)
            presets = cursor.fetchall()

            presets_list = [
                {
                    'preset_id': preset['preset_id'],
                    'preset_name': preset['preset_name'],
                    'created_date': preset['created_date'].isoformat()
                }
                for preset in presets
            ]

            return jsonify({
                'presets': presets_list,
                'count': len(presets_list)
            }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to fetch preset list: {str(e)}'}), 500
    finally:
        conn.close()


@preset_bp.route('', methods=['GET'])
@token_required
def get_all_presets(current_user_id, current_username, current_role, company_name, dsp):
    """
    Get all presets with pagination and search

    Query parameters:
        - page: int (default 1)
        - limit: int (default 20)
        - search: str (optional)
    """
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    search = request.args.get('search', '')

    offset = (page - 1) * limit

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            # Build base query
            base_query = """
            SELECT preset_id, company_name, username, preset_name,
                   preset_filter_json, created_date, created_by_id
            FROM presets
            WHERE company_name = %s
            """
            params = [company_name]

            # Filter by user if not admin
            if current_role not in ['Admin', 'super_admin']:
                base_query += " AND username = %s"
                params.append(current_username)

            # Add search filter
            if search:
                base_query += " AND preset_name ILIKE %s"
                params.append(f'%{search}%')

            # Get total count
            count_query = f"SELECT COUNT(*) as count FROM presets WHERE company_name = %s"
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

            # Get paginated results
            base_query += " ORDER BY created_date DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            cursor.execute(base_query, params)
            presets = cursor.fetchall()

            presets_list = [
                {
                    'preset_id': preset['preset_id'],
                    'company_name': preset['company_name'],
                    'username': preset['username'],
                    'preset_name': preset['preset_name'],
                    'preset_filter_json': preset['preset_filter_json'],
                    'created_date': preset['created_date'].isoformat(),
                    'created_by_id': preset['created_by_id']
                }
                for preset in presets
            ]

            response_data = {
                'presets': presets_list,
                'pagination': {
                    'current_page': page,
                    'limit': limit,
                    'total_count': total_count,
                    'total_pages': (total_count + limit - 1) // limit if total_count > 0 else 0
                }
            }

            return jsonify(response_data), 200

    except psycopg.DatabaseError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to fetch presets: {str(e)}'}), 500
    finally:
        conn.close()


@preset_bp.route('/<int:preset_id>', methods=['GET'])
@token_required
def get_preset_by_id(current_user_id, current_username, current_role, company_name, dsp, preset_id):
    """
    Get a specific preset by ID
    """
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


@preset_bp.route('/<int:preset_id>', methods=['PUT'])
@token_required
def update_preset(current_user_id, current_username, current_role, company_name, dsp, preset_id):
    """
    Update a preset

    Request body:
        - preset_name: str (optional)
        - preset_filter_json: dict or str (optional)
    """
    data = request.json

    # Validate JSON if provided
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
            # Check if preset exists and user has permission
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

            # Check for duplicate preset name
            if 'preset_name' in data:
                cursor.execute("""
                    SELECT preset_id FROM presets
                    WHERE company_name = %s AND username = %s AND preset_name = %s AND preset_id != %s
                """, (company_name, existing_preset['username'], data['preset_name'], preset_id))

                if cursor.fetchone():
                    return jsonify({'error': 'Preset with this name already exists'}), 409

            # Build update query
            update_fields = []
            update_params = []

            for field in ['preset_name', 'preset_filter_json']:
                if field in data:
                    update_fields.append(f"{field} = %s")
                    if field == 'preset_filter_json':
                        update_params.append(
                            json.dumps(data[field]) if isinstance(data[field], dict) else data[field]
                        )
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


@preset_bp.route('/<int:preset_id>', methods=['DELETE'])
@token_required
def delete_preset(current_user_id, current_username, current_role, company_name, dsp, preset_id):
    """
    Delete a preset
    """
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        with conn.cursor() as cursor:
            # Check if preset exists
            check_query = """
            SELECT preset_id, preset_name FROM presets
            WHERE preset_id = %s AND company_name = %s
            """
            params = [preset_id, company_name]

            cursor.execute(check_query, params)
            preset = cursor.fetchone()

            if not preset:
                return jsonify({'error': 'Preset not found or access denied'}), 404

            # Delete preset
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


@preset_bp.route('/user/<string:username>', methods=['GET'])
@token_required
def get_presets_by_username(current_user_id, current_username, current_role, company_name, dsp, username):
    """
    Get all presets for a specific user
    """
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

            presets_list = [
                {
                    'preset_id': preset['preset_id'],
                    'company_name': company_name,
                    'username': preset['username'],
                    'preset_name': preset['preset_name'],
                    'preset_filter_json': preset['preset_filter_json'],
                    'created_date': preset['created_date'].isoformat(),
                    'created_by_id': preset['created_by_id']
                }
                for preset in presets
            ]

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
