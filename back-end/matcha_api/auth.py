from flask import Blueprint, g

from matcha_api.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/signup', methods=('GET', 'POST'))
def signup():

	return 'up'
