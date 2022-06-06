from datetime import datetime, timedelta, timezone
from psycopg2.extras import RealDictCursor

from flask import request
from flask_jwt_extended import (
	create_access_token,
	get_jwt,
	get_jwt_identity,
	set_access_cookies,
	unset_jwt_cookies
)
from werkzeug.security import check_password_hash

from matcha_api.db import get_db
from matcha_api.common.validator import data_validator as validator
from matcha_api.common.utils import msg_response
from matcha_api.common.database import insert_one, find_one


# restful

# post: sign up logic
def handle_signup():
	data = request.get_json(force=True, silent=True)
	response = msg_response('signup failed', 400)

	try:
		table = 'users'
		columns = ('name', 'fname', 'username', 'password', 'email')
		if validator(data) is True and insert_one(table, columns, data) is True:
			response = msg_response('signup success', 200)
		return response
	except KeyError as e:
		print('Exception:', e)
		return response


# post: sign in logic
def handle_signin():
	data = request.get_json(force=True, silent=True)
	response = msg_response('signin failed', 400)

	def __authentication(obj):
		user = find_one('users', 'username', data['username'])

		if user is None:
			return msg_response('username invalid', 400)
		elif not check_password_hash(user['password'], data['password']):
			return msg_response('password invalid', 400)

		new_response = msg_response('signin success', 200)

		access_token = create_access_token(identity={"id": user['id'], "username": user['username']})
		set_access_cookies(new_response, access_token)
		return new_response

	try:
		if validator(data) is True:
			response = __authentication(data)
		return response
	except KeyError as e:
		print('Exception:', e)
		return response


# get: sign out logic
def handle_signout():
	response = msg_response('signout successful', 200)
	unset_jwt_cookies(response)
	return response


# utils

# public: refresh jwt token
def refresh_expiring_jwt(response):
	try:
		print('debug: trying refresh ...')
		exp_timestamp = get_jwt()["exp"]
		now = datetime.now(timezone.utc)
		target_timestamp = datetime.timestamp(now + timedelta(minutes=30))

		if target_timestamp > exp_timestamp:
			print('debug: refreshed!')
			access_token = create_access_token(identity=get_jwt_identity())
			set_access_cookies(response, access_token)
		return response
	except (RuntimeError, KeyError):
		print('debug: no valid token no refresh')
		# Case where there is not a valid JWT. Just return the original response
		return response
