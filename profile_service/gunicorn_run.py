import os

os.system('gunicorn -c config-gunicorn.py \'app:create_app("default")\'')