from app.api import image_service as image
from flask import jsonify
from flask import request
from werkzeug.utils import secure_filename
import os
import cloudinary
import cloudinary.uploader
import cloudinary.utils
from app.helper.auth_connector import verify_jwt, Permission
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key= os.environ.get('CLOUDINARY_API_KEY'),
    api_secret= os.environ.get('CLOUDINARY_API_SECRET')
)


@image.route('/post/uploads', methods=['POST', 'PUT'])
@verify_jwt(blueprint=image, permissions=[Permission.WRITE])
def uploads_image_post(user_id):
    file = request.files.get('file')
    response = cloudinary.uploader.upload(file, tags='post_image')
    return jsonify({
        "urls": {
            "default": response.get('url')
        }}
    )



@image.route('/test')
def test():
    return jsonify({'message': 'ok'}), 200
