from config import Config

class ServiceURL:
    FRONT_END_SERVICE = 'http://tnshare.online' if Config.BUILD_ENV == 'production' else 'http://localhost:3000'
    API_GATEWAY_SERVICE = 'http://tnshare.online:8000' if Config.BUILD_ENV == 'production' else 'http://localhost:8000'
