from requests.adapters import HTTPAdapter
from requests import Session


class CustomHttpAdapter(HTTPAdapter):
    def __init__(self, **kwargs):
        self.timeout = kwargs.pop('timeout', 10)
        super(CustomHttpAdapter, self).__init__(**kwargs)

    def send(self, request, **kwargs):
        time_out = kwargs.get('timeout', self.timeout)
        kwargs.pop('timeout')
        return super().send(request, timeout=time_out, **kwargs)


def create_connection(app, name='default', **options):
    print("test")
    if not hasattr(app, 'extensions'):
        app.extensions = {}

    if 'connectors' not in app.extensions:
        app.extensions['connectors'] = {}

    session = Session()
    headers = options.get('headers', {})
    if 'Content-Type' not in headers:
        headers['Content-Type'] = 'application/json'
    session.headers.update(headers)
    timeout = options.get('timeout', 10)
    adapter = CustomHttpAdapter(timeout=timeout)
    session.mount('http://', adapter)
    app.extensions['connectors'][name] = session
    return session


def get_connection(app, name='default'):
    return app.extensions['connectors'][name]