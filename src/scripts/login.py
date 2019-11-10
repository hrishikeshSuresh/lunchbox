from pymongo import MongoClient
#from flask import Flask, flash request, session, Response #Import main Flask class and request object
from flask_app import *
from db_connector import *
from datetime import datetime
import string, random

app = Flask(__name__) #create the Flask app

@app.route('/api/v1/login', methods = [ 'POST' ]   )
def login():
    if request.method == 'GET':
        username = request.json.get('username')
        password = request.json.get('password')
        user_type = request.json.get('user_type')
        user_collection = db['users']
        if(user_collection.find({ "username": username  , "password": password , "account_type":    })):
            '''#Random string
            N = 7 
            res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = N)) 
            session [ 'id' ] = res
            session['logged_in'] = True'''

            resp = make_response(None, 200)  
            resp.set_cookie('username',username)  
            return resp  

            #return jsonify({ 'User logged in': True }), 200; 

        else:
            return jsonify ( { 'Invalid credentials' }), 401

        #return jsonify({ 'username': user.username }), 201, {'Location': url_for('get_user', id = user.id, _external = True)
