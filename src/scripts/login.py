from pymongo import MongoClient
#from flask import Flask, flash request, session, Response Import main Flask class and request object
from flask_app import *
from db_connector import *
from datetime import datetime
import string, random


@app.route('/api/v1/login', methods = [ 'POST' ]   )
def login():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        user_type = request.json.get('user_type')
        user_collection = db['users']
        if(user_collection.find({ "username": username  , "password": password , "account_type": user_type   })):
            '''#Random string
            N = 7 
            res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = N)) 
            session [ 'id' ] = res
            session['logged_in'] = True''' #This code is just in case we need to change it to sessions

            resp = make_response(jsonify({"Success": "Log in successful"}), 200)  
            resp.set_cookie('username',username)  
            return resp  


        else:
            return jsonify ( { 'Invalid credentials' }), 401

       
