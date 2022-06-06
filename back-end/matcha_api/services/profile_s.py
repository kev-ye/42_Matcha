from flask import request, make_response
from flask_restful import marshal
from flask_jwt_extended import get_jwt_identity
from psycopg2.extras import RealDictCursor

from matcha_api.db import get_db
from matcha_api.common.utils import msg_response
from matcha_api.common.fields import (
	userinfo_limit,
	userinfo_history,
	userinfo_black_list,
	userinfo_reported_list
)
from matcha_api.common.validator import data_validator as validator


# restful

# get: get user public information
def get_user_info():
	identity, data = _common_data()
	response = msg_response('user invalid', 400)

	try:
		if data is None:
			return _result(identity['username'], userinfo_limit)
		elif data['username'] is not None:
			return _result(data['username'], userinfo_limit)
		return response
	except KeyError as e:
		print('except:', e)
		return response


# get: get user information with params
def get_user_info_params(param):
	params = {
		'history': _common_result(get_jwt_identity(), userinfo_history),
		'black_list': _common_result(get_jwt_identity(), userinfo_black_list),
		'reported_list': _common_result(request.get_json(force=True, silent=True), userinfo_reported_list)
	}

	if param is not None:
		for k, v in params.items():
			if k == param:
				return v

	return msg_response('invalid params', 400)


# post: update user info
def update_user_info():
	identity, data = _common_data()
	response = msg_response('invalid user', 400);

	try:
		if validator(data) is True:
			pass
		return response
	except KeyError as e:
		print('except in update user info:', e)
		return response


# utils

# private: jwt payload & request json data
def _common_data():
	return get_jwt_identity(), request.get_json(force=True, silent=True)


# private: common result
def _common_result(data: {}, fields_obj: {}):
	response = msg_response('user invalid', 400)

	try:
		return response if data is None else _result(data['username'], fields_obj)
	except KeyError as e:
		print('except:', e)
		return response


# private: result filtered by fields
def _result(username: str, fields_obj: {}):
	def __search_user(uname):
		if uname is None:
			return None
		try:
			with get_db() as db, db.cursor(cursor_factory=RealDictCursor) as cursor:
				cursor.execute('SELECT * FROM users WHERE username = %s', (uname,))
				return cursor.fetchone()
		except (AttributeError, db.IntegrityError) as er:
			print('except:', er)
			return None

	user_data = __search_user(username)

	return msg_response('user invalid', 400)\
		if user_data is None else make_response(marshal(user_data, fields_obj), 200)

