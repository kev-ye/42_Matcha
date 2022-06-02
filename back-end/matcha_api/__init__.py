from flask import Flask


def create_app():
	app = Flask(__name__)

	@app.route('/hello')
	def hello():
		return 'Hello, world!'

	from . import db
	db.init_app(app)

	from . import auth
	app.register_blueprint(auth.bp)

	return app
