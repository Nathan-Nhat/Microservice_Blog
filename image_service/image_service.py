from app import create_app
import os

if __name__ == '__main__':
    current_app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    current_app.run(port=5004)
