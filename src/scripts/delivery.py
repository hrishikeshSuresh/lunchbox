from db_connector import *
from flask_app import *
from common import *


#Signup
@app.route('/api/v1/delivery/signup', methods = [ 'POST' ]   )
def signup_delivery():
    if request.method == 'POST':
        delivery_name = request.json.get('delivery_name')
        username = request.json.get('username')
        password = request.json.get('password').upper()

        #print(json.loads(dumps(db['metadata'].find())))
        metadata = db['metadata'].find_one()
        last_did = metadata['last_did']
        last_uid = metadata['last_uid']
        did = last_did + 1
        uid = last_uid + 1
        db['metadata'].update( { 'last_did': last_did, 'last_uid':last_uid}, { "$set": { 'last_did':did, 'last_uid':uid }} )
        did = 'd' + str(did)
        uid = 'u' + str(uid)
        #print(password)
        d_collection = db['delivery']
        u_collection = db['users']
        d_collection.insert_one({ "did": did, "uid": uid, "d_name": delivery_name })
        u_collection.insert_one({ "uid": uid, "username": username, "password": password, "account_type": "Delivery" })
        resp = make_response(jsonify({"success": "created"}), 201)
        resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
        resp.set_cookie('did',value=did, max_age=60*60*24*365*2)  
        resp.set_cookie('user_type',value="Delivery",max_age=60*60*24*365*2)
        return resp
