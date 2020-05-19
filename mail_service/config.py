import os


class Config(object):
    EMAIL_SENDER = os.environ.get('EMAIL_SENDER', 'supp.blog.ttn@gmail.com')
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', 'Wakerjacob@90')

