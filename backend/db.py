import psycopg
from psycopg.rows import dict_row
import os

# Database
db_params = {
    'dbname': os.getenv('DBNAME'),
    'user': os.getenv('DBUSERNAME'),
    'password': os.getenv('DBPASSWORD'),
    'host': os.getenv('DBHOST'),
    'port': os.getenv('DBPORT')
}

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg.connect(**db_params,row_factory=dict_row)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None