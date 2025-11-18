from flask import Blueprint, request, jsonify
import json
import requests
from middleware.auth import token_required
from InclusionExclusionLogic import build_audience_segments
from db import get_db_connection

audience_bp = Blueprint('audience', __name__, url_prefix='/api')

@audience_bp.route('/build-audience', methods=['POST'])
@token_required
def build_audience(current_user_id, current_username, current_role, company_name, dsp):
    """
    Build audience based on filter criteria

    This endpoint receives the preset JSON and returns inclusion/exclusion segments.
    Based on user's DSP flag:
    - If DSP is True: returns audienceCount only (no segments)
    - If DSP is False: returns inclusion/exclusion segments only (no audienceCount)

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
        print(f"Building audience for user: {current_username} (DSP: {dsp})")
        print(f"Filters received: {json.dumps(audience_filters, indent=2)}")

        # Build audience segments using the logic module
        response_data = build_audience_segments(audience_filters, current_username)

        print(f"Built audience: {json.dumps(response_data, indent=2)}")

        # Filter response based on DSP flag
        if dsp:
            # DSP users only get audience count
            filtered_response = {
                'audienceCount': response_data.get('audienceCount', 0)
            }
        else:
            # Non-DSP users only get segments (no count)
            filtered_response = {
                'inclusionSegments': response_data.get('inclusionSegments', []),
                'exclusionSegments': response_data.get('exclusionSegments', [])
            }

        return jsonify(filtered_response), 200

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
def index(current_user_id, current_username, current_role, company_name, dsp):
    """
    General API endpoint
    """
    data = request.json
    print("Index endpoint called")
    print(data)
    return jsonify({"message": "INDEX"}), 201


def get_facebook_specs():
    """
    Get Facebook account ID, access token, and API version from database

    Returns:
        tuple: (account_id, access_token, version) or (None, None, None) if not found
    """
    conn = None
    try:
        conn = get_db_connection()
        if not conn:
            raise Exception("Database connection failed")

        cursor = conn.cursor()
        cursor.execute("""
            SELECT facebook_account_id, facebook_authenticate_token, version
            FROM facebook_accounts
            ORDER BY created_at DESC
            LIMIT 1
        """)

        result = cursor.fetchone()
        cursor.close()

        if result:
            return result['facebook_account_id'], result['facebook_authenticate_token'], result['version']
        else:
            return None, None, None

    except Exception as e:
        print(f"Error fetching Facebook specs: {str(e)}")
        return None, None, None
    finally:
        if conn:
            conn.close()


def create_campaign_api(campaign_data):
    """
    Create a Facebook campaign using the Facebook Graph API

    Args:
        campaign_data: dict containing campaign_name and campaign_objective

    Returns:
        str: Campaign ID if successful, None otherwise
    """
    try:
        account_id, access_token, version = get_facebook_specs()

        if not account_id or not access_token or not version:
            raise Exception("Facebook account credentials not found in database")

        link = f'https://graph.facebook.com/{version}/{account_id}/campaigns'

        payload = {
            'access_token': access_token,
            'name': campaign_data['campaign_name'],
            'objective': campaign_data['campaign_objective'],
            'status': 'ACTIVE',
            'special_ad_category_country': "IN",
            'special_ad_categories': "['NONE']"
        }

        response = requests.post(link, params=payload)
        response_json = response.json()

        print(f"Facebook API Response: {response_json}")

        if 'id' in response_json:
            return response_json['id']
        else:
            raise Exception(f"Facebook API error: {response_json.get('error', {}).get('message', 'Unknown error')}")

    except Exception as e:
        print(f"Error creating campaign: {str(e)}")
        raise


@audience_bp.route('/create_campaign', methods=['POST'])
@token_required
def create_campaign(current_user_id, current_username, current_role, company_name, dsp):
    """
    Create a Facebook campaign

    Request body:
        - campaign_name: string (required)
        - campaign_objective: string (required)

    Returns:
        - campaign_id: string (Facebook campaign ID)
        - success: boolean
        - message: string
    """
    data = request.json

    if not data:
        return jsonify({'error': 'No campaign data provided'}), 400

    campaign_name = data.get('campaign_name')
    campaign_objective = data.get('campaign_objective')

    if not campaign_name or not campaign_objective:
        return jsonify({'error': 'Campaign name and objective are required'}), 400

    try:
        print(f"Creating campaign for user: {current_username}")
        print(f"Campaign name: {campaign_name}, Objective: {campaign_objective}")

        # Create campaign using Facebook API
        campaign_id = create_campaign_api({
            'campaign_name': campaign_name,
            'campaign_objective': campaign_objective
        })

        if campaign_id:
            return jsonify({
                'success': True,
                'campaign_id': campaign_id,
                'message': f'Campaign created successfully with ID: {campaign_id}'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to create campaign'
            }), 500

    except Exception as e:
        print(f"Error in create_campaign endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to create campaign: {str(e)}'
        }), 500
