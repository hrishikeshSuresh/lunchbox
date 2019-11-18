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
	if request.method!='POST' :
		return jsonify(str({"error":"Method not allowed"})),405
	if user_type=="Canteen" or user_type=="Caterer":
		item_id="it"+ str(db['menu'].find().count()+1)
		uid=request.cookies.get('uid')
	
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
		return jsonify(str({"success":"created","item_id":item_id})),201
	else:
		return jsonify(str({"error":"Method not allowed"})),405



@app.route('/api/v1/establishment/remove_item', methods=['DELETE'])
def removeitem():
	if request.method!='DELETE':
		return jsonify(str({"error":"Method not allowed"})),405
	uid=request.cookies.get('uid')
	user_type=request.cookies.get('user_type')
	print("\n \n \n ")
	print(user_type=="Canteen")
	print("\n \n \n ")
	print(user_type=="Caterer")
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
