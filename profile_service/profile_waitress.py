from waitress import serve
from app import create_app
import os

env = os.environ.get(os.environ.get('FLASK_CONFIG', 'default'))
cur = create_app('default')

serve(cur,  listen='127.0.0.1:5001', threads=6)