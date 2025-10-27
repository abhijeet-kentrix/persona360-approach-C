from flask import Blueprint, request, jsonify
import json
from middleware.auth import token_required
from InclusionExclusionLogic import build_audience_segments

audience_bp = Blueprint('audience', __name__, url_prefix='/api')


@audience_bp.route('/build-audience', methods=['POST'])
@token_required
def build_audience(current_user_id, current_username, current_role, company_name):
    """
    Build audience based on filter criteria

    This endpoint receives the preset JSON and returns inclusion/exclusion segments.

    Request body:
        - audienceFilters: dict
        - segments: dict (optional)
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

        # Build audience segments using the logic module
        response_data = build_audience_segments(audience_filters, current_username)

        print(f"Built audience: {json.dumps(response_data, indent=2)}")

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error building audience: {str(e)}")
        return jsonify({'error': f'Failed to build audience: {str(e)}'}), 500


@audience_bp.route('/get_segments', methods=['POST'])
def get_segments():
    """
    Legacy endpoint - kept for backward compatibility
    """
    data = request.json
    print("Legacy get_segments endpoint called")
    print(data)
    return jsonify({'message': 'Output from legacy endpoint'})


@audience_bp.route('', methods=['POST', 'GET'])
@token_required
def index(current_user_id, current_username, current_role, company_name):
    """
    General API endpoint
    """
    data = request.json
    print("Index endpoint called")
    print(data)
    return jsonify({"message": "INDEX"}), 201
