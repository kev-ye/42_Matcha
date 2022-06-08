from flask import Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required

import matcha_api.services.profile_s as service

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')
api = Api(profile_bp)


class Profile(Resource):
	@jwt_required()
	def get(self):
		return service.get_user_info()

	@jwt_required()
	def post(self):
		return service.update_user_info()


class ProfileParams(Resource):
	@jwt_required()
	def get(self, param):
		return service.get_user_info_params(param)


api.add_resource(Profile, '/profile')
api.add_resource(ProfileParams, '/profile/<param>')
