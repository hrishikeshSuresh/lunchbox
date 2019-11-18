# all endpoints related to caterer's view
from db_connector import *
from flask_app import *
from common import *




#Signup
@app.route('/api/v1/caterer/signup', methods = [ 'POST' ]   )
def signup_caterer():
    if request.method == 'POST':
        cat_name = request.json.get('cat_name')
        username = request.json.get('username')
        password = request.json.get('password').upper()
        owner = request.json.get('owner')
        location = request.json.get('location')

        #print(json.loads(dumps(db['metadata'].find())))
        metadata = db['metadata'].find_one()
        last_cat_id = metadata['last_cat_id']
        last_uid = metadata['last_uid']
        cat_id = last_cat_id + 1
        uid = last_uid + 1
        db['metadata'].update( { 'last_cat_id': last_cat_id, 'last_uid':last_uid}, { "$set": { 'last_cat_id':cat_id, 'last_uid':uid }} )
        cat_id = 'cat' + str(cat_id)
        uid = 'u' + str(uid)
        #print(password)
        cat_collection = db['caterers']
        u_collection = db['users']
        cat_collection.insert_one({ "cat_id": cat_id, "uid": uid, "establishment_name": cat_name, "owner": owner, "location": location })
        u_collection.insert_one({ "uid": uid, "username": username, "password": password, "account_type": "Caterer" })
        resp = make_response(jsonify({"success": "created"}), 201)
        resp.set_cookie('uid',value=uid, max_age=60*60*24*365*2)  
        resp.set_cookie('cat_id',value=cat_id, max_age=60*60*24*365*2)  
        resp.set_cookie('user_type',value="Caterer",max_age=60*60*24*365*2)
        return resp





# list menu for a given establishment
@app.route('/<establishment_name>/menu', methods = ['GET'])
def getMenu(establishment_name):
    if request.method == 'GET':
        menu_data = readMenuCollection()
        pp.pprint(menu_data)
        # filter needed menu items
        establishment_menu = list()
        for document in menu_data:
            if document['establishment_name'] == establishment_name:
                menu_item = {'item_name': document['item_name'], 'item_price': document['item_price'], 'currency': document['currency']}
                establishment_menu.append(menu_item)
        print("menu sent")
        return jsonify(str(establishment_menu)), 200

# add new item to the menu
@app.route('/<establishment_name>/menu/addItem', methods = ['POST'])
def addItemToMenu(establishment_name):
    if request.method == 'POST':
        menu_data = readMenuCollection()
        pp.pprint(menu_data)
        request_data = json.loads(request.get_data().decode())
        item_name = request_data['item_name']
        item_price = request_data['item_price']
        currency = request_data['currency']
        # check whether item is already present in the menu
        for document in menu_data:
            if document['establishment_name'] == establishment_name:
                if document['item_name'] == item_name:
                    return jsonify("Item already present"), 200
        mongo_cmd = { 'establishment_name': establishment_name,
                      'item_name': item_name,
                      'item_price': item_price,
                      'currency': currency }
        db['menu'].insert(mongo_cmd)
        pp.pprint(mongo_cmd)
        print("item added to the menu")
        return jsonify("Added " + item_name + " priced at " + item_price), 200
#---------------------------------------------------------------------------------------------------------
@app.route('/api/v1/establishment/add_item', methods=['POST'])
def additem():
	user_type=request.cookies.get('user_type')
	uid=request.cookies.get('uid')

	if request.method!='POST' :
		return jsonify(str({"error":"Method not allowed"})),405
	if((not user_type ) or (not uid)):
		return jsonify(str({"error":"bad request"})),400

	if user_type=="Canteen" or user_type=="Caterer":
		metadata_doc=db['metadata'].find_one({}) 
		last_item_id=metadata_doc['last_item_id']
		item_id="it"+ str(last_item_id+1)
		
	
		if user_type=="Caterer":
			temp_doc=db['caterers'].find_one({"uid":uid})
			eid=temp_doc['cat_id']
		if user_type=="Canteen":
			temp_doc=db['canteens'].find_one({"uid":uid})
			eid=temp_doc['can_id']
		item_name=request.json.get("item_name")
		item_price=request.json.get("item_price")
		currency=request.json.get("currencyu")
		tags=request.json.get("tags")
		img=request.json.get("img")
		result={"item_id":item_id,"eid":eid,"e_type":user_type,"item_name": item_name, "item_price": item_price, "currency": currency,"status":1,"tags":tags,"avg_rating":0,"img":img}
		db['menu'].insert_one(result)
		db['metadata'].update_one({"last_item_id":last_item_id},{"$set":{"last_item_id":last_item_id+1}})
		return jsonify(str({"success":"created","item_id":item_id})),201
	else:
		return jsonify(str({"error":"Method not allowed"})),405



@app.route('/api/v1/establishment/remove_item', methods=['DELETE'])
def removeitem():
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	if request.method!='DELETE':
		return jsonify(str({"error":"Method not allowed"})),405
	if((not user_type ) or (not uid)):
		return jsonify(str({"error":"bad request"})),400

	
	item_id=request.json.get("item_id")
	
	temp_doc=db['menu'].find_one({"item_id":item_id})
	eid=temp_doc['eid']
	e_type=temp_doc['e_type']
	
	if e_type=="Canteen":
		main_doc=db["canteens"].find_one({"can_id":eid})
	elif e_type=="Caterer":
		main_doc=db["caterers"].find_one({"cat_id":eid})

	if uid==main_doc['uid'] and user_type==e_type:
		db['menu'].delete_one({"item_id":item_id})
		return jsonify(str({"success":"deleted"})),200
	else:
		return jsonify(str({"error":"Unauthorised to delete"})),401

@app.route('/api/v1/establishment/update_item', methods=['POST'])
def updateitem():
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	
	if request.method!='POST':
		return jsonify(str({"error":"Method not allowed"})),405
	if((not user_type ) or (not uid)):
		return jsonify(str({"error":"bad request"})),400

	item_id=request.json.get("item_id")
	item_name=request.json.get("item_name")
	item_price=request.json.get("item_price")
	currency=request.json.get("currency")
	tags=request.json.get("tags")
	img=request.json.get("img")

	temp_doc=db['menu'].find_one({"item_id":item_id})
	print("\n \n \n")
	print(not temp_doc)
	print("\n \n \n")
	if not temp_doc:
		return jsonify(str({"error":"item doesn't exist"})),404

	eid=temp_doc['eid']
	e_type=temp_doc['e_type']
	
	if e_type=="Canteen":
		main_doc=db["canteens"].find_one({"can_id":eid})
	elif e_type=="Caterer":
		main_doc=db["caterers"].find_one({"cat_id":eid})

	if uid==main_doc['uid'] and user_type==e_type:
		if(item_name):
			db['menu'].update_one({"item_id":item_id},{"$set":{"item_name":item_name}})
		if(item_price):
			db['menu'].update_one({"item_id":item_id},{"$set":{"item_price":item_price}})
		if(currency):
			db['menu'].update_one({"item_id":item_id},{"$set":{"currency":currency}})
		if(tags):
			db['menu'].update_one({"item_id":item_id},{"$set":{"tags":tags}})
		if(img):
			db['menu'].update_one({"item_id":item_id},{"$set":{"img":img}})
		
		return jsonify(str({"success":"updated"})),201
	else:
		return jsonify(str({"error":"Unauthorised"})),401

@app.route('/api/v1/establishment/toggle_item', methods=['POST'])
def toggleitem():
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	
	if request.method!='POST':
		return jsonify(str({"error":"Method not allowed"})),405
	if((not user_type ) or (not uid)):
		return jsonify(str({"error":"bad request"})),400

	item_id=request.json.get("item_id")
	

	temp_doc=db['menu'].find_one({"item_id":item_id})
	print("\n \n \n")
	print(not temp_doc)
	print("\n \n \n")
	if not temp_doc:
		return jsonify(str({"error":"item doesn't exist"})),404

	eid=temp_doc['eid']
	e_type=temp_doc['e_type']
	
	if e_type=="Canteen":
		main_doc=db["canteens"].find_one({"can_id":eid})
	elif e_type=="Caterer":
		main_doc=db["caterers"].find_one({"cat_id":eid})
	new_status=0
	if uid==main_doc['uid'] and user_type==e_type:
		temp_doc2=db['menu'].find_one({"item_id":item_id})
		status_in_db=temp_doc2['status']

		if status_in_db==1:
			db['menu'].update_one({"item_id":item_id},{"$set":{"status":0}})
			new_status=0
		else:
			db['menu'].update_one({"item_id":item_id},{"$set":{"status":1}})
			new_status=1
		return jsonify(str({"success":"item status toggled", "status":new_status})),201
	else:
		return jsonify(str({"error":"Unauthorised"})),401

@app.route('/api/v1/order/status', methods=['GET','POST'])
def view_or_change_orderstatus():
	if request.method == 'GET':
		uid=request.cookies.get('uid')
		user_type=request.cookies.get('user_type')
		order_id=request.args.get("order_id")
		if request.method!='GET':
			return jsonify(str({"error":"Method not allowed"})),405
		if((not user_type ) or (not uid)):
			return jsonify(str({"error":"bad request"})),400

	
		temp_doc=db['orders'].find_one({"order_id":order_id})
		print("\n \n \n")
		print(not temp_doc)
		print("\n \n \n")
		if not temp_doc:
			return jsonify(str({"error":"order doesn't exist"})),404

		return jsonify(str({"status":temp_doc['status']})),200

	elif request.method == 'POST':
		if not request.cookies.get('user_type'):
			return jsonify(str({"error":"Unauthorized"})), 401

		user_type = request.cookies.get('user_type')

		if user_type == "Canteen":
			if (not request.cookies.get('uid')) or (not request.cookies.get('can_id')):
				return jsonify(str({"error":"Unauthorized"})), 401
			else:
				other_id = request.cookies.get('can_id')

		elif user_type == "Caterer":
			if (not request.cookies.get('uid')) or (not request.cookies.get('cat_id')):
				return jsonify(str({"error":"Unauthorized"})), 401
			else:
				other_id = request.cookies.get('cat_id')

		elif user_type == "Delivery":
			if (not request.cookies.get('uid')) or (not request.cookies.get('did')):
				return jsonify(str({"error":"Unauthorized"})), 401

			else:
				other_id = request.cookies.get('did')

		uid = request.cookies.get('uid')

		if (not request.json.get('order_id')) or (not request.json.get('status')):
			return jsonify(str({"error":"Bad Request - 1"})), 400

		order_id = request.json.get('order_id')
		status_to = request.json.get('status')
		order = db.orders.find_one({"order_id":order_id})

		if not order:
			return jsonify(str({"error":"Order not found"})), 404



		if (user_type == 'Canteen' or user_type == 'Caterer') and (order['eid'] == other_id):
			if order['status'] < status_to and (status_to in [2,3,4]):
				db.orders.update({"order_id":order_id},{"$set":{"status":status_to}})
				return jsonify(str({"success":"updated"})), 201
			else:
				return jsonify(str({"error":"Bad Request - 2"})), 400


		if user_type == 'Delivery' and order['did'] == other_id:
			if order['status'] == 4 and (status_to == 5):
				db.orders.update({"order_id":order_id},{"$set":{"status":status_to}})
				return jsonify(str({"success":"updated"})), 201
			else:
				
				return jsonify(str({"error":"Bad Request - 4"})), 400
		else:

			return jsonify(str({"error":"Bad Request - 5"})), 400








@app.route('/api/v1/order/count',methods=['GET'])
def getordercountitem():
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	item_id=request.args.get("item_id")
	check=db["menu"].find_one({"item_id":item_id})
	
	if request.method!='GET':
		return jsonify(str({"error":"Method not allowed"})),405
	if((not user_type ) or (not uid)):
		return jsonify(str({"error":"bad request"})),400
	#if(not check):
		#return jsonify(str({"error":"item not found"})),404
	count=0
	temp_doc=db['orders'].find({})
	for order in temp_doc:
		if item_id in (order["items"]).keys(): 
			count=count + (order["items"])[item_id]  
	print("\n \n \n")
	print(count)
	print("\n \n \n")
	if not temp_doc:
		return jsonify(str({"error":"order doesn't exist"})),404

	return jsonify(str({"count":count})),200

@app.route('/api/v1/establishment/all_items', methods=['GET'])
def getallitems_for_establishment():
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')

	if request.method!='GET':
		return jsonify(str({"error":"Method not allowed"})),405
	if((not user_type ) or (not uid)):
		return jsonify(str({"error":"bad request"})),400

	
	if user_type=="Canteen":
		main_doc=db["canteens"].find_one({"uid":uid})
		eid=main_doc["can_id"]
	elif user_type=="Caterer":
		main_doc=db["caterers"].find_one({"uid":uid})
		eid=main_doc["cat_id"]
	print("\n \n \n")
	print(eid)
	print("\n \n \n")
	menu_doc=db['menu'].find({"eid":eid})
	result=list()
	for i in menu_doc:
		temp_dict={}
		temp_dict["item_id"] = i["item_id"]
		temp_dict["item_name"] = i["item_name"]
		temp_dict["eid"] = i["eid"]
		temp_dict["e_type"] = i["e_type"]
		temp_dict["e_name"] = get_est_name_from_item_id(i["item_id"])
		temp_dict["item_price"] = i["item_price"]
		temp_dict["currency"] = i["currency"]
		temp_dict["status"] = i["status"]
		temp_dict["avg_rating"] = i["avg_rating"]
		temp_dict["img"] = i["img"]
		result.append(temp_dict)
	if len(result)==0:
		return jsonify(str("no content found")),204
	else:
		return jsonify(str(result)),200

@app.route('/api/v1/establishment/pending_orders', methods=['GET'])
def view_pending_orders():
	if request.method!="GET":
		return jsonify(str({"error":"method not allowed"})),405
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	print("\n \n \n")
	print(user_type)
	print("\n \n \n")
	print(uid)
	print("\n \n \n")
	if (not uid) or (not user_type):
		return jsonify(str({"error":"bad request"})),400

	f=0
	doc=db['canteens'].find_one({})
	if user_type=="Canteen":
		doc=db['canteens'].find_one({"uid":uid})
		f=1
		id=doc['can_id']
		orders=db['orders'].find({"eid":id},{"$or":[{"$eq":["status",1]},{"$eq":["status",2]},{"$eq":["status",3]}]})
	if user_type=="Caterer":
		doc=db['caterers'].find_one({"uid":uid})
		f=2
		id=doc['cat_id']
		orders=db['orders'].find({"eid":id},{"$or":[{"$eq":["status",1]},{"$eq":["status",2]},{"$eq":["status",3]},{"$eq":["status",4]}]})
	else:
		
		
		orders=db['orders'].find({"e_type":"Caterer"})
	if orders.count() == 0:
		return jsonify(str({"success":"No Content"})),204 	
	print(orders)	
	temp_dict={}
	temp_e_name=""
	token_or_did=""
	token_or_did_val=""
	for order in orders:
		order=db['orders'].find_one(order)
		print(order['e_type'])
		if user_type=="Canteen" and order["e_type"]=='Canteen':
			if (order['status']!=1 and order['status']!=2 and order['status']!=3 ):
				continue
			temp_e_name=doc['establishment_name']
			print(temp_e_name)
			token_or_did="token"
			toekn_or_did_val=order['token']
		elif user_type=="Caterer" and order['e_type']=='Caterer':
			if (order['status']!=1 and order['status']!=2 and order['status']!=3 and order['status']!=4):
				continue
			temp_e_name=doc['establishment_name']
			token_or_did="did"
			token_or_did_val=order['did']
		elif user_type=="Delivery":
			if (order['status']!=2 and order['status']!=3 and order['status']!=4 ):
				continue
			doc = db.caterers.find_one({"cat_id":order['eid']})
			temp_e_name=doc['establishment_name']
			token_or_did="did"
			token_or_did_val=order['did']

		temp_dict[order["order_id"]]={"uid":order['uid'],"eid":order['eid'],"e_name":temp_e_name,"e_type":order['e_type'],"items":order['items'],"amount":order['amount'],"currency":order['currency'],"payment_option":order['payment_option'],"customer_location":order['location'],"status":order['status'],"timestamp":time.ctime(order['timestamp']),token_or_did:token_or_did_val}
		if user_type=="Delivery" and order['e_type']=="Caterer":
			(temp_dict[order["order_id"]])["e_location"]=doc["location"]

	return jsonify(str(temp_dict)),200



@app.route('/api/v1/establishment/complete_orders', methods=['GET'])
def complete_order():
	if request.method!="GET":
		return jsonify(str({"error":"method not allowed"})),405
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	print("\n \n \n")
	print(user_type)
	print("\n \n \n")
	print(uid)
	print("\n \n \n")
	if (not uid) or (not user_type):
		return jsonify(str({"error":"bad request"})),400

	f=0
	doc=db['canteens'].find_one({})
	if user_type=="Canteen":
		doc=db['canteens'].find_one({"uid":uid})
		f=1
		id=doc['can_id']
		orders=db['orders'].find({"eid":id},{"$or":[{"$eq":["status",1]},{"$eq":["status",2]},{"$eq":["status",3]}]})
	if user_type=="Caterer":
		doc=db['caterers'].find_one({"uid":uid})
		f=2
		id=doc['cat_id']
		orders=db['orders'].find({"eid":id},{"$or":[{"$eq":["status",1]},{"$eq":["status",2]},{"$eq":["status",3]},{"$eq":["status",4]}]})
	else:
		
		
		orders=db['orders'].find({"e_type":"Caterer"})
	if orders.count() == 0:
		return jsonify(str({"success":"No Content"})),204 	
	print(orders)	
	temp_dict={}
	temp_e_name=""
	token_or_did=""
	token_or_did_val=""
	for order in orders:
		order=db['orders'].find_one(order)
		print(order['e_type'])
		if user_type=="Canteen" and order["e_type"]=='Canteen':
			if (order['status']==1 and order['status']==2 and order['status']==3 ):
				continue
			temp_e_name=doc['establishment_name']
			print(temp_e_name)
			token_or_did="token"
			toekn_or_did_val=order['token']
		elif user_type=="Caterer" and order['e_type']=='Caterer':
			if (order['status']==1 and order['status']==2 and order['status']==3 and order['status']==4):
				continue
			temp_e_name=doc['establishment_name']
			token_or_did="did"
			token_or_did_val=order['did']
		elif user_type=="Delivery":
			
			tdid=(db['delivery'].find_one({"uid":uid}))["did"]
			print("\n \n \n")
			print(tdid)
			print("\n \n \n")
			if (order['status']!=5 or tdid!=order['did'] ):
				continue
			print(order['status'])
			doc = db.caterers.find_one({"cat_id":order['eid']})
			temp_e_name=doc['establishment_name']
			token_or_did="did"
			token_or_did_val=order['did']

		temp_dict[order["order_id"]]={"uid":order['uid'],"eid":order['eid'],"e_name":temp_e_name,"e_type":order['e_type'],"items":order['items'],"amount":order['amount'],"currency":order['currency'],"payment_option":order['payment_option'],"customer_location":order['location'],"status":order['status'],"timestamp":time.ctime(order['timestamp']),token_or_did:token_or_did_val}
		if user_type=="Delivery" and order['e_type']=="Caterer":
			(temp_dict[order["order_id"]])["e_location"]=doc["location"]

	return jsonify(str(temp_dict)),200

	
#----------------------------------------------------------------------------------------------------    
    
    
# edit item to the menu
@app.route('/<establishment_name>/menu/editItem/<item_name>', methods = ['PUT'])
def editItemInMenu(establishment_name, item_name):
    if request.method == 'PUT':
        request_data = json.loads(request.get_data().decode())
        item_price = request_data['item_price']
        # check if item is present in the menu
        if(db['menu'].find({'item_name': item_name}).count == 0):
            return jsonify("Item not found"), 200
        mongo_update = { 'item_price': item_price }
        # update the collection
        db['menu'].update_one({'establishment_name': establishment_name, 'item_name': item_name},
                              { '$set': mongo_update }, upsert = True)
        print("item price edited in the menu")
        return jsonify("Edited " + item_name + " priced at " + item_price), 200

# delete item from the menu
@app.route('/<establishment_name>/menu/deleteItem/<item_name>', methods = ['DELETE'])
def deleteItemFromMenu(establishment_name, item_name):
    if request.method == 'DELETE':
        request_data = json.loads(request.get_data().decode())
        # check if item is present in the menu
        if(db['menu'].find({'item_name': item_name}).count == 0):
            return jsonify("Item not found"), 200
        # delete item from menu
        mongo_delete = { 'establishment_name': establishment_name,
                         'item_name': item_name}
        db['menu'].delete_one(mongo_delete)
        print("item removed from the menu")
        return jsonify("Removed " + item_name + " from " + establishment_name + "'s menu"), 200
def get_est_name_from_item_id(item_id):
    item = db.menu.find_one({"item_id":item_id})
    if item['e_type'] == 'Canteen':
        est = db.canteens.find_one({"can_id":item['eid']})
    elif item['e_type'] == 'Caterer':
        est = db.caterers.find_one({"cat_id":item['eid']})

    return est['establishment_name']
