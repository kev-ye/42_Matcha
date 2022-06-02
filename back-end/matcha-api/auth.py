import os
from flask import Blueprint

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/signup', methods=('GET', 'POST'))
def signup():

	return 'up'
