from app.api import image_service as image
from flask import jsonify
from flask import request
from werkzeug.utils import secure_filename
from flask import send_file
import os
from flask import current_app


@image.route('/uploads', methods=['POST', 'PUT'])
def uploads_test():
    file = request.files.get('file')
    file_name = secure_filename(file.filename)
    print(file_name)
    file.save(os.path.join(current_app.config['UPLOAD_DIR'], file_name))
    print(os.path.join(current_app.config['UPLOAD_DIR'], file_name))
    return jsonify({
        "urls": {
            "default": f"http://localhost:5004/api/v1/image/img?name={file_name}"
        }}
    )


@image.route('/img')
def get_file():
    file_name = request.args.get('name')
    file = os.path.join(current_app.config['UPLOAD_DIR'], file_name)
    return send_file(file)
