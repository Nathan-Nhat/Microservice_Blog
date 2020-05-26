from app.api import image_service as image
from flask import jsonify
from flask import request
from werkzeug.utils import secure_filename
from flask import send_file
import os

UPLOAD_FOLDER = 'D:/'


@image.route('/uploads', methods=['POST'])
def uploads_test():
    file = request.files.get('upload')
    file_name = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, file_name))
    print(os.path.join(UPLOAD_FOLDER, file_name))
    return jsonify({
        "urls": {
            "default": f"http://localhost:5004/api/v1/image/img?name={file_name}"
        }}
    )


@image.route('/img')
def get_file():
    file_name = request.args.get('name')
    file = os.path.join(UPLOAD_FOLDER, file_name)
    return send_file(file)
