import os

env = os.environ.get('FLASK_CONFIG', 'default')

os.system(f'gunicorn -c config-gunicorn.py \'app:create_app("{env}")\'')