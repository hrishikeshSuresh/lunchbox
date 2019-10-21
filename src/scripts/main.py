# main file where all modules & sub-modules are imported
# only main function should be here
# import necessary files
# IP Address, port number are passed as arguments

import sys
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
# create application instance
app = Flask(__name__)
# generating a secret key for sessions
app.secret_key = os.urandom(16);

import os
import json
from werkzeug import secure_filename, exceptions

# importing other views
import caterer
import customer
import institution

def main():
    print("Lunchbox...");
    app.run(debug = True, host = sys.argv[0], port = int(sys.argv[1]))

if __name__ == "__main__":
    main()

