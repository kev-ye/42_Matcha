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
from werkzeug.security import generate_password_hash, check_password_hash

from matcha_api.db import get_db
from matcha_api.common.validator import data_validator as validator
from matcha_api.common.utils import msg_response


# refresh jwt token
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


# sign up logic
def handle_signup():
	data = request.get_json(force=True, silent=True)
	response = msg_response('signup failed', 400)

	def __insert_data(obj):
		try:
			with get_db() as db, db.cursor() as cursor:
				cursor.execute(
					"INSERT INTO users(name, fname, username, password, email) VALUES (%s, %s, %s, %s, %s)",
					(obj['name'], obj['fname'], obj['username'], generate_password_hash(obj['password']), obj['email'])
				)
				# commit() call automatically in with block
		except (AttributeError, db.IntegrityError) as er:
			print('Exception:', er)
			return False
		return True

	try:
		if _check_data(data) is True and __insert_data(data) is True:
			response = msg_response('signup success', 200)
	except KeyError as e:
		print('Exception:', e)
		return response

	return response


# dev test
def handle_signin_dev():
	response = msg_response('signin success', 200)
	access_token = create_access_token(identity={"id": "4", "username": "username"})
	set_access_cookies(response, access_token)
	return response


# sign in logic
def handle_signin():
	data = request.get_json(force=True, silent=True)
	response = msg_response('signin failed', 400)

	def __authentication(obj):
		try:
			with get_db() as db, db.cursor(cursor_factory=RealDictCursor) as cursor:
				cursor.execute(
					'SELECT * FROM users WHERE username = %s', (data['username'],)
				)
				user = cursor.fetchone()

				if user is None:
					return msg_response('username invalid', 400)
				elif not check_password_hash(user['password'], obj['password']):
					return msg_response('password invalid', 400)

				access_token = create_access_token(identity={"id": user['id'], "username": user['username']})
				set_access_cookies(response, access_token)
				return msg_response('msg": "signin success', 200)
		except (AttributeError, db.IntegrityError) as er:
			print('debug:', er)
			return msg_response('signin failed', 400)

	try:
		if _check_data(data) is True:
			response = __authentication(data)
	except KeyError as e:
		print('Exception:', e)
		return response
	return response


# sign out logic
def handle_signout():
	response = msg_response('signout successful', 200)
	unset_jwt_cookies(response)
	return response


# common Tools
# data validator
def _check_data(obj):
	if obj is None:
		return False
	for k, v in obj.items():
		if v is None or validator[k](v) is False:
			return False
	return True
