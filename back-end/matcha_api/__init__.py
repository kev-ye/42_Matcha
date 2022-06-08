import os

from flask import Flask
from datetime import timedelta
from flask_jwt_extended import JWTManager

from matcha_api import db, auth, profile


def create_app():
	app = Flask(__name__)
	app.config.from_mapping(
		JWT_COOKIE_SECURE=False,
		JWT_SECRET_KEY=os.environ['JWT_SECRET_KEY'],
		JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
		JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=30)
	)

	# init db
	db.init_app(app)

	# init jwt
	jwt = JWTManager(app)

	# blueprint
	app.register_blueprint(auth.auth_bp)
	app.register_blueprint(profile.profile_bp)

	return app
