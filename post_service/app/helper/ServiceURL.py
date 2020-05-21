import os


class ServiceURL:
    AUTH_SERVICE = 'http://auth_service:5000/api/v1/auth/' if os.environ.get(
        'FLASK_CONFIG') == 'production' else 'http://localhost:5000/api/v1/auth/'
    PROFILE_SERVICE = 'http://profile_service:5001/api/v1/profile/' if os.environ.get(
        'FLASK_CONFIG') == 'production' else 'http://localhost:5001/api/v1/profile/'
    POST_SERVICE = 'http://post_service:5002/api/v1/post/' if os.environ.get(
        'FLASK_CONFIG') == 'production' else 'http://localhost:5002/api/v1/post/'
    FRONT_END_SERVER = 'http://192.168.0.106:3000'
    FRONT_END_SERVER_DEV = 'http://localhost:3000'
