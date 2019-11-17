from pymongo import MongoClient
#from flask import Flask, flash request, session, Response Import main Flask class and request object
from flask_app import *
from db_connector import *
from datetime import datetime
import string, random


@app.route('/api/v1/login', methods = [ 'POST' ]   )
def login():
    if request.method == 'POST':
        if ( not request.json.get('username') or ( not request.json.get('password'))  or (not request.json.get('user_type'))):
            return jsonify(str({"error":"Bad Request"})), 400
        username = request.json.get('username')
        password = request.json.get('password').upper()
        user_type = request.json.get('user_type')
        user_db = db.users.find_one({"username":username,"password":password,"account_type":user_type})

        if user_type == 'canteen':
            temp = db['canteens']
        elif user_type == 'caterers':
            temp = db['caterers']
        elif user_type == 'institution':
            temp = db['institutions']
        elif user_type == 'delivery':
            temp = db['delivery']


        if user_db:
            '''#Random string
            N = 7 
            res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = N)) 
            session [ 'id' ] = res
            session['logged_in'] = True''' #This code is just in case we need to change it to sessions
            if(user_type=="customer"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)
                uid = user_db['uid']  
                iid = user_db['iid']
                resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
                resp.set_cookie('iid',value=iid, max_age=60*60*24*365*2) 
                resp.set_cookie('user_type',value=user_type,max_age=60*60*24*365*2) 
                return resp  
            
            elif(user_type=="caterer"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)  
                uid = user_db['uid']  
                t = temp.find_one({"uid":uid})
                cat_id = t['cat_id']
                resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
                resp.set_cookie('cat_id',value=cat_id, max_age=60*60*24*365*2) 
                resp.set_cookie('user_type',value=user_type,max_age=60*60*24*365*2) 
                return resp  
            elif(user_type=="canteen"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)  
                uid = user_db['uid']  
                t = temp.find_one({"uid":uid})
                can_id = t['can_id']
                resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
                resp.set_cookie('can_id',value=can_id, max_age=60*60*24*365*2) 
                resp.set_cookie('user_type',value=user_type,max_age=60*60*24*365*2) 
                return resp  
            elif(user_type=="institution"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)
                uid = user_db['uid']  
                t = temp.find_one({"uid":uid})
                iid = t['iid']
                resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
                resp.set_cookie('iid',value=iid, max_age=60*60*24*365*2)  
                resp.set_cookie('user_type',value=user_type,max_age=60*60*24*365*2) 
                return resp
            elif(user_type=="delivery"):
                resp = make_response(jsonify({"Success": "Log in successful"}), 200)
                uid = user_db['uid']  
                t = temp.find_one({"uid":uid})
                did = t['did']
                resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
                resp.set_cookie('did',value=did, max_age=60*60*24*365*2)  
                resp.set_cookie('user_type',value=user_type,max_age=60*60*24*365*2)
                return resp  


        else:
            return jsonify ( { "Success":'Invalid credentials' }), 401

       
