# all endpoints related to institution view
from flask_app import *
from db_connector import *
from common import *
from bson.json_util import dumps
import json

#Signup
@app.route('/api/v1/institution/signup', methods = [ 'POST' ]   )
def signup():
    if request.method == 'POST':
        i_name = request.json.get('i_name')
        username = request.json.get('username')
        password = request.json.get('password').upper()
        #print(json.loads(dumps(db['metadata'].find())))
        metadata = db['metadata'].find_one()
        last_iid = metadata['last_iid']
        last_uid = metadata['last_uid']
        iid = last_iid + 1
        uid = last_uid + 1
        db['metadata'].update( { 'last_iid': last_iid, 'last_uid':last_uid}, { "$set": { 'last_iid':iid, 'last_uid':uid }} )
        iid = 'i' + str(iid)
        uid = 'u' + str(uid)
        #print(password)
        i_collection = db['institutions']
        u_collection = db['users']
        i_collection.insert_one({ "iid": iid, "uid": uid, "i_name": i_name, "caterers": {} })
        u_collection.insert_one({ "uid": uid, "username": username, "password": password, "account_type": "Institution" , "iid":iid, "name" :i_name })
        resp = make_response(jsonify({"success": "created"}), 201)
        resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
        resp.set_cookie('iid',value=iid, max_age=60*60*24*365*2)  
        resp.set_cookie('user_type',value="Institution",max_age=60*60*24*365*2)
        return resp


#Add customer/canteen
@app.route('/api/v1/institution/add/<user_type>', methods = [ 'PUT' ])
def add(user_type):
    if request.method == 'PUT':
        if user_type == 'Customer':
            for request_one in request.json:
                #print(len(request.json))
                username = request_one['username']
                password = request_one['password'].upper()
                name = request_one['name']
                iid = request.cookies.get('iid')
                user_collection = db['users']
                metadata = db['metadata'].find_one() #CHECK
                last_uid = metadata['last_uid']
                uid = last_uid + 1
                db['metadata'].update({'last_uid':last_uid}, { "$set": {'last_uid':uid }})
                uid = 'u' + str(uid)
                user_collection.insert_one({ "uid": uid, "name":name, "username": username, "password": password, "account_type": "Customer", "wallet": 5000, "iid":iid  })
                return jsonify ( { "success":'Created' }), 201
        elif user_type == 'Canteen':
            for request_one in request.json:
                username = request_one['username']
                password = request_one['password'].upper()
                establishment_name = request_one['establishment_name']
                owner = request_one['owner']
                iid = request.cookies.get('iid')
                
                metadata = db['metadata'].find_one()
                last_uid = metadata['last_uid']
                last_can_id = metadata['last_can_id']
                uid = last_uid + 1
                can_id = last_can_id + 1
                db['metadata'].update({'last_uid':last_uid, 'last_can_id':last_can_id }, { "$set" :{'last_uid':uid, 'last_can_id':can_id }})
                uid = 'u' + str(uid)
                can_id = 'can' + str(can_id)
                user_collection = db['users']
                user_collection.insert_one({ "uid": uid, "username": username, "password": password, "account_type": "Canteen",  "iid":iid  })

                can_collection = db['canteens']
                can_collection.insert_one({ 'can_id': can_id, 'uid': uid, 'establishment_name': establishment_name, 'owner': owner   })
                return jsonify ( { "success":'created' }), 201


@app.route('/api/v1/institution/add_cat', methods = [ 'PUT' ])
def add_cat():
    if request.method == 'PUT':
        iid = request.cookies.get('iid')
        i_collection = db['institutions']
        cat_id = request.json.get('cat_id')
        found = i_collection.find_one({'iid': iid })
        i_collection.update(  { 'iid' : iid }, { "$push": { "caterers": cat_id  }} )
        return jsonify ( { "success":'created' }), 201


@app.route('/api/v1/institution/view/<user_type>', methods = [ 'GET' ])
def view(user_type):
    if request.method == 'GET':
        if(user_type == 'Customer'):
            return_list = []
            iid = request.cookies.get('iid')
            user_collection = db['users']
            for record in user_collection.find({ 'iid':iid, "account_type":"Customer" }):
                #record = dumps(record)
                record_json={}
                record_json["uid"] = record["uid"]
                record_json["username"] = record["username"]
                record_json["wallet"] = record["wallet"]
                record_json["iid"] = record["iid"]
                record_json["name"] = record["name"]
                return_list.append(record_json)
            return jsonify(return_list), 200
        elif(user_type == 'Canteen'):
            return_list = []
            iid = request.cookies.get('iid')
            user_collection = db['users']
            can_collection = db['canteens']
            for record in user_collection.find({ 'iid':iid, "account_type":"Canteen" }):
                #record = dumps(record)
                print(dumps(record))
                record_json={}
                record_json["uid"] = record["uid"]
                uid_temp = record_json["uid"]
                record2 = can_collection.find_one({ "uid": uid_temp }) 
                record_json["can_id"] = record2["can_id"]
                record_json["estabishment_name"] = record2["establishment_name"]
                record_json["owner"] = record2["owner"]
                return_list.append(record_json)
            return jsonify(return_list), 200
        elif(user_type == 'Caterer'):
            return_list = []
            iid = request.cookies.get('iid')
            i_collection = db['institutions']
            record_2 = i_collection.find_one({'iid':iid})
            cat_list = record_2['caterers']
            cat_collection = db['caterers']
            for value in cat_list:
                #record = dumps(record)
                record = cat_collection.find_one({ 'cat_id':value })
                record_json={}
                record_json["cat_id"] = record["cat_id"]
                record_json["uid"] = record["uid"]
                record_json["estabishment_name"] = record["establishment_name"]
                record_json["location"] = record["location"]
                record_json["owner"] = record["owner"]
                return_list.append(record_json)
            return jsonify(return_list), 200
        
@app.route('/api/v1/institution/view_all_cat', methods = [ 'GET' ])
def view_all_cat():
    cat_collection = db['caterers']
    return_list = []
    for record in cat_collection.find():
        #record = dumps(record)
        record_json={}
        record_json["cat_id"] = record["cat_id"]
        record_json["uid"] = record["uid"]
        record_json["estabishment_name"] = record["establishment_name"]
        record_json["location"] = record["location"]
        record_json["owner"] = record["owner"]
        return_list.append(record_json)
    return jsonify(return_list), 200

@app.route('/api/v1/institution/update_can', methods = ['POST'] )
def update_can():
    if request.method == 'POST':
        establishment_name = request.json.get('establishment_name')
        can_id = request.json.get('can_id')
        owner = request.json.get('owner')
        username = request.json.get('username')
        db.canteens.update( { "can_id": can_id }, { "$set" :{ "establishment_name":establishment_name, "owner":owner } })
        record=db.canteens.find_one({"can_id":can_id})
        uid = record['uid']
        db.users.update({ "uid": uid }, { "$set" :{ "username":username, "establishment_name":establishment_name, "owner":owner } })
        return jsonify ( { "success":'updated' }), 200


@app.route('/api/v1/institution/remove_user/<user_type>',methods = ['DELETE'])
def remove_user(user_type):
    if request.method == 'DELETE':
        if user_type == 'Customer':
            uid = request.json.get('uid')
            db.users.remove( { 'uid': uid })
        elif user_type == 'Canteen':
            can_id = request.json.get('can_id')
            record=db.canteens.find_one({"can_id":can_id})
            uid = record['uid']
            db.canteens.remove( { 'can_id': can_id } )
            db.users.remove({ 'uid':uid })
        elif user_type == 'Caterer':
            cat_id = request.json.get('cat_id')
            iid = request.cookies.get('iid')
            record = db.institutions.find_one({ 'iid': iid })
            cat_list = record['caterers']
            print(cat_list)
            cat_list.remove(cat_id)
            db.institutions.update( { "iid":iid }, { "$set" : { "caterers": cat_list  }})
        return jsonify ( { "success":'deleted' }), 200

@app.route('/api/v1/institution/count', methods = ['GET'])
def count():
    if request.method == 'GET':
        user_type = request.args.get('user_type')
        cnt = 0
        for record in db.users.find({ 'account_type' : user_type  }):
            cnt=cnt+1
        return jsonify( { "success": "return", "count": cnt } ), 200