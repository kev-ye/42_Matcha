import os
import psycopg2
import click

from flask import current_app, g
from flask.cli import with_appcontext


def get_db():
	if 'db' not in g:
		print('debug: db connected')
		g.db = psycopg2.connect(
			host='localhost',
			database='matcha',
			user=os.environ['DB_USERNAME'],
			password=os.environ['DB_PASSWORD']
		)

	return g.db


def close_db(e=None):
	db = g.pop('db', None)

	if db is not None:
		print('debug: db closed')
		db.close()


def init_db():
	with get_db() as db, current_app.open_resource('schema.sql') as f:
		with db.cursor() as cursor:
			cursor.execute(f.read().decode('utf8'))
			# commit call automatically if the connection is used in a with statement


@click.command('init-db')
@with_appcontext
def init_db_command():
	"""Clear the existing data and create new tables."""
	init_db()
	click.echo('Initialized the database.')


def init_app(app):
	app.teardown_appcontext(close_db)
	app.cli.add_command(init_db_command)
