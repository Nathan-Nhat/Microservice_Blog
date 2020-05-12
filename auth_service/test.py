from werkzeug.security import generate_password_hash, check_password_hash

if __name__ == '__main__':
    hash = 'pbkdf2:sha256:150000$fYmEBiAW$004203985291bfc7cd53ebe463c66c94e5243cc1c5b8cc0180f3f554daafaa04'
    print(check_password_hash(hash, 'Wakerjacob90'))
