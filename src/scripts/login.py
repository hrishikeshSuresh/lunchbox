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
        password = request.json.get('password').upper()
        #print(password)
        user_type = request.json.get('user_type')
        if(user_type=="customer"):
            user_collection = db['users']
        elif(user_type=="caterer"):
            user_collection = db['caterers']
        elif(user_type=="canteen"):
            user_collection = db['canteens']
        elif(user_type=="institution"):
            user_collection = db['institutions']
        elif(user_type=="delivery"):
            user_collection = db['delivery']
        if(user_collection.find_one({ "username": username  , "password": password , "account_type": user_type   })):
            '''#Random string
            N = 7 
            res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = N)) 
            session [ 'id' ] = res
            session['logged_in'] = True''' #This code is just in case we need to change it to sessions
            found = user_collection.find_one({ "username": username  , "password": password , "account_type": user_type})
            if(user_type=="customer"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)
                uid = found['uid']  
                iid = found['iid']
                resp.set_cookie('uid',value=uid, expires= None)  
                resp.set_cookie('iid',value=iid, expires= None)  
                return resp  
            
            elif(user_type=="caterer"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)  
                uid = found['uid']  
                cat_id = found['cat_id']
                resp.set_cookie('uid',value=uid, expires= None)  
                resp.set_cookie('cat_d',value=cat_id, expires= None)  
                return resp  
            elif(user_type=="canteen"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)  
                uid = found['uid']  
                can_id = found['can_id']
                resp.set_cookie('uid',value=uid, expires= None)  
                resp.set_cookie('can_d',value=can_id, expires= None)  
                return resp  
            elif(user_type=="institution"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)
                uid = found['uid']  
                iid = found['iid']
                resp.set_cookie('uid',value=uid, expires= None)  
                resp.set_cookie('iid',value=iid, expires= None)   
                return resp
            elif(user_type=="delivery"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)
                uid = found['uid']  
                did = found['did']
                resp.set_cookie('uid',value=uid, expires= None)  
                resp.set_cookie('did',value=did, expires= None)  
                return resp  


        else:
            return jsonify ( { "Success":'Invalid credentials' }), 401

       
