import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'super-secret-key')
    DEBUG = False
    TESTING = False

    # JWT Configuration
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 8

    # Cookie Configuration
    COOKIE_HTTPONLY = True
    COOKIE_SECURE = False  # Set to True in production with HTTPS
    COOKIE_SAMESITE = 'Lax'
    COOKIE_MAX_AGE = 28800  # 8 hours

    # Database Configuration
    DB_NAME = os.getenv('DBNAME')
    DB_USER = os.getenv('DBUSERNAME')
    DB_PASSWORD = os.getenv('DBPASSWORD')
    DB_HOST = os.getenv('DBHOST')
    DB_PORT = os.getenv('DBPORT')

    # CORS Configuration
    CORS_SUPPORTS_CREDENTIALS = True


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    COOKIE_SECURE = True  # Enable secure cookies in production


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
