from flask import (
    Flask,
    render_template,
    url_for,
    Markup,
    send_from_directory,
    flash,
    request,
    jsonify
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
app.secret_key = os.urandom(16);
