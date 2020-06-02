import os

env = os.environ.get('FLASK_CONFIG', 'default')

os.system(f'gunicorn -c config-gunicorn.py -b "0.0.0.0:6000" \'app:create_app("{env}")\'')
