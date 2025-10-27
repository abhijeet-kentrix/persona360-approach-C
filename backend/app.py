from flask import Flask
from flask_cors import CORS
import os

from config import config
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.preset_routes import preset_bp
from routes.audience_routes import audience_bp


def create_app(config_name=None):
    """
    Application factory pattern for Flask app

    Args:
        config_name: Configuration name (development, production, testing)

    Returns:
        Flask application instance
    """
    app = Flask(__name__)

    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app.config.from_object(config[config_name])

    # Initialize extensions
    CORS(app, supports_credentials=app.config['CORS_SUPPORTS_CREDENTIALS'])

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(preset_bp)
    app.register_blueprint(audience_bp)

    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'API is running'}, 200

    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return {
            'message': 'P360 Dashboard API',
            'version': '2.0',
            'status': 'active'
        }, 200

    return app


# Create app instance
app = create_app()


if __name__ == '__main__':
    # Get port from environment or default to 5000
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'

    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
