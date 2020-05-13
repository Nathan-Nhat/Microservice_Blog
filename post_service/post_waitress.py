from waitress import serve
from app import create_app

cur = create_app('default')

serve(cur,  listen='127.0.0.1:5002', threads=6)