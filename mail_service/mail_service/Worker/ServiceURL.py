from config import Config

class ServiceURL:
    FRONT_END_SERVICE = 'http://35.240.191.124' if Config.BUILD_ENV == 'production' else 'http://localhost:3000'
    API_GATEWAY_SERVICE = 'http://35.240.191.124:8000' if Config.BUILD_ENV == 'production' else 'http://localhost:8000'