from flask import request, make_response
from flask_restful import marshal
from flask_jwt_extended import get_jwt_identity
from psycopg2.extras import RealDictCursor

from matcha_api.db import get_db
from matcha_api.common.utils import msg_response
from matcha_api.common.fields import userinfo_limit


def get_user_info():
	identity = get_jwt_identity()
	data = request.get_json(force=True, silent=True)
	response = msg_response('user invalid', 400)

	def __search_user(username):
		if username is None:
			return None
		try:
			with get_db() as db, db.cursor(cursor_factory=RealDictCursor) as cursor:
				cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
				return cursor.fetchone()
		except (AttributeError, db.IntegrityError) as er:
			print('except:', er)
			return None

	def __user(username: str):
		user_data = __search_user(username)

		if user_data is None:
			msg_response('user invalid', 400)
		return make_response(marshal(user_data, userinfo_limit), 200)

	if data is None:
		test = __user(identity['username'])
		return test
	elif data['username'] is not None:
		return __user(data['username'])

	return response


