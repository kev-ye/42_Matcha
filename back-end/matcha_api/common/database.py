from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash

from matcha_api.db import get_db


def insert_one(table_name: str, cols: tuple, data: dict):
	"""Insert a row of data into the table

	Returns 'True' if the insertion was successful otherwise returns 'False'.

	:param table_name: name of table
	:param cols: list of columns name
	:param data: data object
	"""
	if type(table_name) is not str or type(cols) is not tuple or type(data) is not dict:
		return False

	columns, values = "", ""
	data_values = []
	data_sorted_by_cols = {}

	for idx, arg in enumerate(cols):
		columns += str(f'{arg}, ' if idx != len(cols) - 1 else f'{arg}')
		values += str('%s, ' if idx != len(cols) - 1 else '%s')
		data_sorted_by_cols[arg] = data[arg]

	for k, v in data_sorted_by_cols.items():
		if k == 'password':
			data[k] = generate_password_hash(v)
		data_values.append(data[k])

	data_tuples = tuple(data_values)

	sql = f'INSERT INTO {table_name}({columns}) VALUES ({values})'

	try:
		with get_db() as db, db.cursor() as cursor:
			cursor.execute(sql, data_tuples)
			# commit() call automatically in with block
			return True
	except (AttributeError, db.IntegrityError) as e:
		print('Exception:', e)
		return False


def find_one(table_name: str, key: str, value: str):
	"""find a data from table

	Returns data dict if data is found otherwise returns 'None'.

	:param table_name: name of table
	:param key: to find key
	:param value: to find value
	"""
	if type(table_name) is not str or type(key) is not str or type(value) is not str:
		return None

	sql = f'SELECT * FROM {table_name} WHERE {key} = %s'

	try:
		with get_db() as db, db.cursor(cursor_factory=RealDictCursor) as cursor:
			cursor.execute(sql, (value,))
			return cursor.fetchone()
	except (AttributeError, db.IntegrityError) as e:
		print('Exception:', e)
		return None
