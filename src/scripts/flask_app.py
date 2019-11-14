from flask import (
    Flask,
    render_template,
    url_for,
    Markup,
    send_from_directory,
    flash,
    request,
    jsonify,
    session,
    Response,
    make_response
)

import sys
import os
import json
from werkzeug import secure_filename, exceptions

import pprint
pp = pprint.PrettyPrinter(indent=2)

# create application instance
app = Flask(__name__)
# generating a secret key for sessions
app.secret_key = os.urandom(16)

@app.errorhandler(exceptions.BadRequest)
def error_400(e):
    return 'ERROR 404: Bad Request', 400

@app.errorhandler(401)
def error_401(e):
    return 'ERROR 401: Unauthorized', 401

@app.errorhandler(exceptions.NotFound)
def error_404(e):
    return 'ERROR 404: Not Found', 404

@app.errorhandler(exceptions.MethodNotAllowed)
def error_405(e):
    return 'ERROR 405: Method Not Allowed', 405

@app.errorhandler(exceptions.RequestEntityTooLarge)
def error_413(e):
    return 'ERROR 413: Request Entity too large', 413
