# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database
from db_connector import *
from flask_app import *
from common import *
import random
import datetime
import collections
import operator



#-----------------------------------------------------------------------------------------------------------
#Customer View API - Place Order
@app.route('/api/v1/place_order',methods=['POST'])
def customer_place_order():
    if (not request.cookies.get('uid')) or (not request.cookies.get('iid')) or ( not request.cookies.get('user_type')):
        return jsonify(str({"error":"You need to login."})), 400

    uid = request.cookies.get('uid')
    iid = request.cookies.get('iid')
    user_type = request.cookies.get('user_type')
    r = request.json
    
    temp_order = {}
    #update wallet
    if r["payment_option"] == "wallet":
        u_db = db.users.find_one({"uid":uid})
        if r["amount"] > u_db["wallet"]:
            return jsonify(str({"error":"Payment unsuccessful"})), 402
        else:
            db.users.update({"uid":uid},{"$set":{"wallet":u_db["wallet"]-r["amount"]}})
    for eid in r['items']:
        meta = db.metadata.find_one({})
        temp_order={}
        last_order_id = meta['last_order_id']
        new_order_id = last_order_id+1
        temp_order["order_id"] = 'o'+str(new_order_id)
        temp_order["uid"] = uid
        temp_order["eid"] = eid
        if eid[2] == 'n':
            temp_order["e_type"] = "Canteen"
        elif eid[2] == 't':
            temp_order["e_type"] = "Caterer"

        temp_order["items"] = r["items"][eid]
        temp_amount = 0
        for item_id in r["items"][eid]:
            i_db = db.menu.find_one({"item_id":item_id})
            temp_amount = temp_amount + (i_db["item_price"] * r["items"][eid][item_id])
        temp_order["amount"] = temp_amount
        temp_order["currency"] = r["currency"]
        temp_order["payment_option"] = r["payment_option"]
        temp_order["location"] = r["location"]
        temp_order["status"] = 1
        temp_order["timestamp"] = time.time()
        if temp_order["e_type"] == 'Canteen':
            temp_order["token"] = random.randint(100000,999999)
        elif temp_order["e_type"] == 'Caterer':
            temp_order["did"] = ''
        
        db.orders.insert_one(temp_order)
        
        #Update metadata
        db.metadata.update_one({},{"$set":{"last_order_id":new_order_id}})
    return jsonify(str({"success":"created"})), 201

    

#-----------------------------------------------------------------------------------------------------------
#Customer view API - Common - View User details
@app.route('/api/v1/account_details',methods=['GET'])
def view_account_details():
    temp_dict = {}
    if not request.cookies.get('user_type'):
        return jsonify(str({"error":"Bad Request"})),400 
    user_type = request.cookies.get('user_type')
    if user_type == 'Customer':
        if (not request.cookies.get('uid')) or (not request.cookies.get('iid')):
            return jsonify(str({"error":"Bad Request"})),400 
        else:
            uid = request.cookies.get('uid')
            iid = request.cookies.get('iid')
            user_info = db.users.find_one({"uid":uid})
            i_info = db.institutions.find_one({"iid":iid})
            temp_dict["uid"] = uid
            temp_dict["name"] = user_info["name"]
            temp_dict["username"] = user_info["username"]
            temp_dict["user_type"] = user_info["account_type"]
            temp_dict["wallet"] = user_info["wallet"]
            temp_dict["i_name"] = i_info["i_name"]

    elif user_type == 'Canteen':
        if (not request.cookies.get('uid')) or (not request.cookies.get('can_id')):
            return jsonify(str({"error":"Bad Request"})),400 
        else:
            uid = request.cookies.get('uid')
            can_id = request.cookies.get('can_id')
            user_info = db.users.find_one({"uid":uid})
            can_info = db.canteens.find_one({"can_id":can_id})
            i_info = db.institutions.find_one({"iid":user_info["iid"]})
            temp_dict["uid"] = uid
            temp_dict["username"] = user_info["username"]
            temp_dict["user_type"] = user_info["account_type"]
            temp_dict["i_name"] = i_info["i_name"]
            temp_dict["can_id"] = can_info["can_id"]
            temp_dict["establishment_name"] = can_info["establishment_name"]
            temp_dict["owner"] = can_info["owner"]


    elif user_type == 'Caterer':
        if (not request.cookies.get('uid')) or (not request.cookies.get('cat_id')):
            return jsonify(str({"error":"Bad Request"})),400 
        else:
            uid = request.cookies.get('uid')
            cat_id = request.cookies.get('cat_id')
            user_info = db.users.find_one({"uid":uid})
            cat_info = db.caterers.find_one({"cat_id":cat_id})
            temp_dict["uid"] = uid
            temp_dict["username"] = user_info["username"]
            temp_dict["user_type"] = user_info["account_type"]
            temp_dict["cat_id"] = cat_info["cat_id"]
            temp_dict["establishment_name"] = cat_info["establishment_name"]
            temp_dict["owner"] = cat_info["owner"]
            temp_dict["location"] = cat_info["location"]

            
    elif user_type == 'Institution':
        if (not request.cookies.get('uid')) or (not request.cookies.get('iid')):
            return jsonify(str({"error":"Bad Request"})),400 
        else:
            uid = request.cookies.get('uid')
            iid = request.cookies.get('iid')
            user_info = db.users.find_one({"uid":uid})
            i_info = db.institutions.find_one({"iid":iid})
            temp_dict["uid"] = uid
            temp_dict["username"] = user_info["username"]
            temp_dict["user_type"] = user_info["account_type"]
            temp_dict["iid"] = i_info["iid"]
            temp_dict["i_name"] = i_info["i_name"]
    elif user_type == 'Delivery':
        if (not request.cookies.get('uid')) or (not request.cookies.get('did')):
            return jsonify(str({"error":"Bad Request"})),400 
        else:
            uid = request.cookies.get('uid')
            did = request.cookies.get('did')
            user_info = db.users.find_one({"uid":uid})
            d_info = db.delivery.find_one({"did":did})
            temp_dict["uid"] = uid
            temp_dict["username"] = user_info["username"]
            temp_dict["user_type"] = user_info["account_type"]
            temp_dict["did"] = did
            temp_dict["d_name"] = d_info["d_name"]

    if len(temp_dict) == 0:
        return jsonify(str({})), 204
    else:
        print("\n\n\n",type(temp_dict),"\n\n\n")
        print("\n\n\n",temp_dict,"\n\n\n")
        return jsonify(str(temp_dict)), 200

#-----------------------------------------------------------------------------------------------------------
#Customer API 1- View previous orders
@app.route('/api/v1/customer/previous_orders',methods=['GET'])
def view_previous_orders():
    if not request.cookies.get('user_type'):
        return jsonify(str({"error":"Bad Request"})),400 

    user_type = request.cookies.get('user_type')
    if user_type == 'customer' and (not (request.cookies.get('uid') or request.cookies.get('iid'))):
        return jsonify(str({"error":"Bad Request"})),400 
    else:
        uid = request.cookies.get('uid')
        iid = request.cookies.get('iid')

    orders = db.orders.find({"uid":uid}).sort("timestamp",-1)
    if orders.count() == 0:
        return jsonify(str({"success":"No Content"})),204 
    temp_dict = {}
    for order in orders:
        if order['e_type'] == 'canteen':
            e = db.canteens.find_one({"can_id":order['eid']})
            temp_e_name = e['establishment_name']
            token_or_did = "token"
            token_or_did_val = order['token']
        elif order['e_type'] == 'caterer':
            e = db.caterers.find_one({"cat_id":order['eid']})
            temp_e_name = e['establishment_name']
            token_or_did = "did"
            token_or_did_val = order['did']
        temp_dict[order["order_id"]] = {"uid":order['uid'],"eid":order['eid'],"e_name":temp_e_name,"e_type":order['e_type'],"items":order['items'],"amount":order['amount'],"currency":order['currency'],"payment_option":order['payment_option'],"location":order['location'],"status":order['status'],"timestamp":time.ctime(order['timestamp']),token_or_did:token_or_did_val}

    return jsonify(str(temp_dict)),200
#-----------------------------------------------------------------------------------------------------------

#Customer API 5: View rating and reviews of food item
@app.route('/api/v1/item/view_reviews', methods=['GET'])
def item_view_reviews():
    
    if request.args.get('item'):
        item_id = request.args.get('item')
    else:
        return jsonify(str({"error":"Bad Request"})),400 

    reviews = db.reviews.find({"item_id":item_id})
    temp_list=[]
    for review in reviews:
        u = db.users.find_one({"uid":review['uid']})
        temp_dict={}
        temp_dict['username'] = u['username']
        temp_dict['rating'] = review['rating']
        temp_dict['review'] = review['review']
        temp_list.append(temp_dict)

    if len(temp_list) == 0:
        return jsonify(str({})), 204
    else:
        return jsonify(str(temp_list)), 200

#-----------------------------------------------------------------------------------------------------------
#Customer API 6: Add rating and review of food item
@app.route('/api/v1/item/add_review/<item_id>', methods=['POST'])
def add_view_review(item_id):
    if (not request.json.get('rating')) or (not request.json.get('review')) or (not request.cookies.get('uid')):
        return jsonify(str({"error":"Bad Request"})),400 
    rating = request.json.get('rating')
    review = request.json.get('review')
    uid = request.cookies.get('uid')

    reviews_db = db['reviews']
    reviews_db.insert_one({"uid":uid,"item_id":item_id,"rating":rating,"review":review})
    update_avg_rating(item_id)
    return jsonify(str({"success":"created"})), 201

#-----------------------------------------------------------------------------------------------------------


        

#-----------------------------------------------------------------------------------------------------------
#Get Menu
@app.route('/api/v1/menu', methods=['GET'])
def listmenuitems():
    if request.method != 'GET':
        return jsonify(str({"error": "Method not allowed"})),405
    
    iid = request.cookies.get('iid')
    canteens=[]
    caterers=[]
    item_list=[]
    temp_dict={}
    temp_can = db.users.find({"iid":iid,"account_type":"Canteen"})
    for can in temp_can:
        x = db.canteens.find_one({"uid":can['uid']})
        canteens.append(x['can_id'])
    temp_cat = db.institutions.find_one({"iid":iid})
    caterers = temp_cat['caterers']
    for canteen in canteens:
        temp_items = db.menu.find({"eid":canteen})
        for temp_item in temp_items:
            temp_dict={}
            temp_dict["item_id"] = temp_item["item_id"]
            temp_dict["item_name"] = temp_item["item_name"]
            temp_dict["eid"] = temp_item["eid"]
            temp_dict["e_type"] = temp_item["e_type"]
            temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
            temp_dict["item_price"] = temp_item["item_price"]
            temp_dict["currency"] = temp_item["currency"]
            temp_dict["status"] = temp_item["status"]
            temp_dict["avg_rating"] = temp_item["avg_rating"]
            temp_dict["img"] = temp_item["img"]

            item_list.append(temp_dict)

    for caterer in caterers:
        temp_items = db.menu.find({"eid":caterer})
        for temp_item in temp_items:
            temp_dict={}
            temp_dict["item_id"] = temp_item["item_id"]
            temp_dict["item_name"] = temp_item["item_name"]
            temp_dict["eid"] = temp_item["eid"]
            temp_dict["e_type"] = temp_item["e_type"]
            temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
            temp_dict["item_price"] = temp_item["item_price"]
            temp_dict["currency"] = temp_item["currency"]
            temp_dict["status"] = temp_item["status"]
            temp_dict["avg_rating"] = temp_item["avg_rating"]
            temp_dict["img"] = temp_item["img"]
            item_list.append(temp_dict)

    random.shuffle(item_list)

    if len(item_list) == 0:
        return jsonify(str({"success": "No Content"})),204
    else:
        return jsonify(str(item_list)), 200


#-----------------------------------------------------------------------------------------------------------
#Get item by ID
@app.route('/api/v1/item/<item_id>',methods=['GET'])
def get_item_by_id(item_id):
    temp_dict={}
    item = db.menu.find_one({"item_id":item_id})

    if not item:
        return jsonify(str({"error": "Not found"})),404


    if item['e_type'] == 'Canteen':
        menu_temp = db.canteens.find_one({"can_id":item['eid']})
    elif item['e_type'] == 'Caterer':
        menu_temp = db.caterers.find_one({"cat_id":item['eid']})

    temp_dict["item_id"]=item_id
    temp_dict["item_name"]=item['item_name']
    temp_dict["eid"]=item['eid']
    temp_dict["e_type"]=item['e_type']
    temp_dict["e_name"]=menu_temp['establishment_name']
    temp_dict["item_price"]=item['item_price']
    temp_dict["currency"]=item['currency']
    temp_dict['status']=item['status']
    temp_dict["avg_rating"]=item['avg_rating']
    temp_dict["img"]=item['img']

    if len(temp_dict) == 0:
        return jsonify(str({"success": "No Content"})),204
    else:
        return jsonify(str(temp_dict)), 200








#-----------------------------------------------------------------------------------------------------------

#Filter items by tag

@app.route('/api/v1/search_tag/<tag>', methods=['GET'])
def filtermenuitems(tag):
    if request.method != 'GET':
        return jsonify(str({"error": "Method not allowed"})),405
    
    iid = request.cookies.get('iid')
    canteens=[]
    caterers=[]
    item_list=[]
    temp_dict={}
    temp_can = db.users.find({"iid":iid,"account_type":"Canteen"})
    for can in temp_can:
        x = db.canteens.find_one({"uid":can['uid']})
        canteens.append(x['can_id'])
    temp_cat = db.institutions.find_one({"iid":iid})
    caterers = temp_cat['caterers']
    for canteen in canteens:
        temp_items = db.menu.find({"eid":canteen})
        for temp_item in temp_items:
            if tag in temp_item['tags']:
                temp_dict={}
                temp_dict["item_id"] = temp_item["item_id"]
                temp_dict["item_name"] = temp_item["item_name"]
                temp_dict["eid"] = temp_item["eid"]
                temp_dict["e_type"] = temp_item["e_type"]
                temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
                temp_dict["item_price"] = temp_item["item_price"]
                temp_dict["currency"] = temp_item["currency"]
                temp_dict["status"] = temp_item["status"]
                temp_dict["avg_rating"] = temp_item["avg_rating"]
                temp_dict["img"] = temp_item["img"]

                item_list.append(temp_dict)

    for caterer in caterers:
        temp_items = db.menu.find({"eid":caterer})
        for temp_item in temp_items:
            if tag in temp_item['tags']:
                temp_dict={}
                temp_dict["item_id"] = temp_item["item_id"]
                temp_dict["item_name"] = temp_item["item_name"]
                temp_dict["eid"] = temp_item["eid"]
                temp_dict["e_type"] = temp_item["e_type"]
                temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
                temp_dict["item_price"] = temp_item["item_price"]
                temp_dict["currency"] = temp_item["currency"]
                temp_dict["status"] = temp_item["status"]
                temp_dict["avg_rating"] = temp_item["avg_rating"]
                temp_dict["img"] = temp_item["img"]

                item_list.append(temp_dict)

    random.shuffle(item_list)

    if len(item_list) == 0:
        return jsonify(str({"success": "No Content"})),204
    else:
        return jsonify(str(item_list)), 200
#-----------------------------------------------------------------------------------------------------------
#search for a specific item by name or by name of the establishment
@app.route('/api/v1/search_food', methods=['GET'])
def searchforfood():
    if request.method != 'GET':
        return jsonify(str({"error": "Method not allowed"})),405
    
    if not request.args.get('search'):
        return jsonify(str({"error": "Bad Request"})),400

    search = request.args.get('search')
    iid = request.cookies.get('iid')
    canteens=[]
    caterers=[]
    item_list=[]
    temp_can = db.users.find({"iid":iid,"account_type":"Canteen"})
    for can in temp_can:
        x = db.canteens.find_one({"uid":can['uid']})
        canteens.append(x['can_id'])
    temp_cat = db.institutions.find_one({"iid":iid})
    caterers = temp_cat['caterers']
    for canteen in canteens:
        temp_items = db.menu.find({"eid":canteen})
        for temp_item in temp_items:
            est_name = get_est_name_from_item_id(temp_item['item_id'])
            if temp_item['item_name'].lower().find(search.lower()) != -1 or est_name.lower().find(search.lower()) != -1:
                temp_dict={}
                temp_dict["item_id"] = temp_item["item_id"]
                temp_dict["item_name"] = temp_item["item_name"]
                temp_dict["eid"] = temp_item["eid"]
                temp_dict["e_type"] = temp_item["e_type"]
                temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
                temp_dict["item_price"] = temp_item["item_price"]
                temp_dict["currency"] = temp_item["currency"]
                temp_dict["status"] = temp_item["status"]
                temp_dict["avg_rating"] = temp_item["avg_rating"]
                temp_dict["img"] = temp_item["img"]

                item_list.append(temp_dict)

    for caterer in caterers:
        temp_items = db.menu.find({"eid":caterer})
        for temp_item in temp_items:
            est_name = get_est_name_from_item_id(temp_item['item_id'])
            if temp_item['item_name'].lower().find(search.lower()) != -1 or est_name.lower().find(search.lower()) != -1:
                temp_dict={}
                temp_dict["item_id"] = temp_item["item_id"]
                temp_dict["item_name"] = temp_item["item_name"]
                temp_dict["eid"] = temp_item["eid"]
                temp_dict["e_type"] = temp_item["e_type"]
                temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
                temp_dict["item_price"] = temp_item["item_price"]
                temp_dict["currency"] = temp_item["currency"]
                temp_dict["status"] = temp_item["status"]
                temp_dict["avg_rating"] = temp_item["avg_rating"]
                temp_dict["img"] = temp_item["img"]

                item_list.append(temp_dict)

    random.shuffle(item_list)

    if len(item_list) == 0:
        return jsonify(str({"success": "No Content"})),204
    else:
        return jsonify(str(item_list)), 200


#-----------------------------------------------------------------------------------------------------------






'''


# list all available caterers
@app.route('/showAllCaterers', methods = ['GET'])
def showAllCaterers():
    if request.method == 'GET':
        caterer_data = readCatererCollection()
        all_caterers = set()
        for document in caterer_data:
            all_caterers.add(document['establishment_name'])
        return jsonify(str(all_caterers)), 200

# list all available canteens
@app.route('/showAllCanteens', methods = ['GET'])
def showAllCanteens():
    if request.method == 'GET':
        canteen_data = readCanteenCollection()
        all_canteens = set()
        for document in canteen_data:
            all_canteens.add(document['establishment_name'])
        return jsonify(str(all_canteens)), 200

# adding ratings & review to the database
@app.route('/addRatingReview', methods = ['POST'])
def addRatingReview():
    if request.method == 'POST':
        request_data = json.loads(request.get_data().decode())
        username = request_data['username']
        item_name=request_data['item_name']
        establishment_name = request_data['establishment_name']
        rating = request_data['rating']
        review = request_data['review']
        date = str(datetime.now().time())
        payment_option = request_data['payment_option']
        mongo_cmd = { 'username': username,
                        'item_name':item_name,
                      'establishment_name': establishment_name,
                      'rating': rating,
                      'review': review,
                      'date': date,
                      'payment_option': payment_option }
        db['sales'].insert(mongo_cmd)
        pp.pprint(mongo_cmd)
        return jsonify("Added review & rating"), 200

# list average ratings and all reviews for a particular caterer/canteen
@app.route('/<establishment_name>/reviews', methods = ['GET'])
def getAllReviews(establishment_name):
    if request.method == 'GET':
        ratings_data = readRatingsCollection()
        pp.pprint(ratings_data)
        # filter needed reviews
        establishment_reviews = list()
        for document in ratings_data:
            if document['establishment_name'] == establishment_name:
                establishment_reviews.append(document)
        # find average ratings & accumulate reviews
        n_ratings = len(establishment_reviews)
        rating_sum = 0
        for document in establishment_reviews:
            rating_sum = rating_sum + int(document['rating'])
        average_rating = rating_sum/n_ratings
        average_rating_json = { 'average_rating': average_rating }
        establishment_reviews.append(average_rating_json)
        return jsonify(str(establishment_reviews)), 200
'''
#-----------------------------------------------------------
#Change Password
@app.route('/api/v1/change_password', methods= ['POST'])
def change_password():
    if request.method == 'POST':
        
        request_data={}
        request_data["password"] = request.json.get("password").upper()
        request_data["new_password"] = request.json.get("new_password").upper()
        request_data["confirm_password"] = request.json.get("confirm_password").upper()
        if not request.cookies.get('uid'):
              return jsonify(str({"error":"Invalid inputs"})),400
        db_user = db['users'].find_one({"uid":request.cookies.get('uid')})
        
        print(db_user)
        if (db_user['password'].upper() == request_data['password'].upper() and request_data['new_password'] == request_data['confirm_password']) and (request_data['password'] != request_data['new_password']) :
           
            db['users'].update_one({"uid":request.cookies.get('uid')},{"$set":{"password":request_data["new_password"].upper()}})
            return jsonify(str({"success":"Password change successful"})), 201
        else:
            return jsonify(str({"error":"Invalid credentials"})), 400

    else:
        return jsonify({error:"Method not allowed"}), 405

#-----------------------------------------------------------









#Get average rating
@app.route('/api/v1/get_rating', methods = ['GET'])
def get_rating():
    if request.method == 'GET':
        if not request.args.get('item'):
            jsonify({"error":"Bad Request"}), 400

        item_id = request.args.get('item')
        item = db.menu.find_one({"item_id":item_id})

        if not item:
            return jsonify({"success":"No Content"}), 204

        else:
            return jsonify(str({"avg_rating":item['avg_rating']})), 200


@app.route('/api/v1/recommendation', methods = ['GET'])
def recommendation():
    if request.method != 'GET':
        return jsonify(str({"error": "Method not allowed"})),405
    iid = request.cookies.get('iid')
    uid = request.cookies.get('uid')
    canteens=[]
    caterers=[]
    item_list=[]
    temp_dict={}
    temp_can = db.users.find({"iid":iid,"account_type":"Canteen"})
    for can in temp_can:
        x = db.canteens.find_one({"uid":can['uid']})
        canteens.append(x['can_id'])
    temp_cat = db.institutions.find_one({"iid":iid})
    caterers = temp_cat['caterers']
    for canteen in canteens:
        temp_items = db.menu.find({"eid":canteen})
        for temp_item in temp_items:
            temp_dict={}
            temp_dict["item_id"] = temp_item["item_id"]
            temp_dict["item_name"] = temp_item["item_name"]
            temp_dict["eid"] = temp_item["eid"]
            temp_dict["e_type"] = temp_item["e_type"]
            temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
            temp_dict["item_price"] = temp_item["item_price"]
            temp_dict["currency"] = temp_item["currency"]
            temp_dict["status"] = temp_item["status"]
            temp_dict["avg_rating"] = temp_item["avg_rating"]
            temp_dict["img"] = temp_item["img"]

            item_list.append(temp_dict)

    for caterer in caterers:
        temp_items = db.menu.find({"eid":caterer})
        for temp_item in temp_items:
            temp_dict={}
            temp_dict["item_id"] = temp_item["item_id"]
            temp_dict["item_name"] = temp_item["item_name"]
            temp_dict["eid"] = temp_item["eid"]
            temp_dict["e_type"] = temp_item["e_type"]
            temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
            temp_dict["item_price"] = temp_item["item_price"]
            temp_dict["currency"] = temp_item["currency"]
            temp_dict["status"] = temp_item["status"]
            temp_dict["avg_rating"] = temp_item["avg_rating"]
            temp_dict["img"] = temp_item["img"]
            item_list.append(temp_dict)

    random.shuffle(item_list)
    veg=0
    nonveg=0
    spicy=0
    sweet=0
    snacks=0
    breakfast=0
    cold=0
    hot=0
    lunch=0

    now = datetime.datetime.now()
    #print now.year, now.month, now.day, now.hour, now.minute, now.second
    if(now.month==12 or now.month==1 or now.month==2):
        hot+=5
    elif(now.month>=6 and now.month<=8):
        cold+=5
    elif(now.month>=9 and now.month<=11):
        hot+=5
        sweet+=5
    elif(now.month>=3 and now.month<=5):
        cold+=5
        spicy+5
    
    if(now.hour>=12 and now.hour <=4):
        lunch+=10
    elif(now.hour>=7 and now.hour <=11):
        breakfast+=10
    elif(now.hour>=5 and now.hour<=7 ):
        snacks+=10
    
    history_list = []
    o_collection = db['orders']
    for order in o_collection.find({ "uid":uid  }):
        item_list2 = order['items']
        for item_id2 in item_list2.keys():
            history_list.append(item_id2)
    history_list = set(history_list)

    m_collection = db['menu']
    for item_id in history_list:
        record = m_collection.find_one({ "item_id":item_id })
        tags = record["tags"]
        for tag in tags:
            if(tag=="veg"):
                veg+=1
            elif(tag=="nonveg"):
                nonveg+=1
            elif(tag=="spicy"):
                spicy+=1
            elif(tag=="sweet"):
                sweet+=1
            elif(tag=="snacks"):
                snacks+=1
            elif(tag=="breakfast"):
                breakfast+=1
            elif(tag=="cold"):
                cold+=1
            elif(tag=="hot"):
                hot+=1
            elif(tag=="lunch"):
                lunch+=1
    
    final_item_list = []
    tag_dict = { "veg": veg, "nonveg": nonveg, "spicy": spicy, "sweet": sweet, "snacks": snacks, "breakfast": breakfast, 
                "cold": cold, "hot": hot, "lunch": lunch }
    sorted_tags = sorted(tag_dict.items(), key=operator.itemgetter(1))

    sorted_dict = collections.OrderedDict(sorted_tags)

    tags_in_order = list(sorted_dict.items())

    print(item_list)
    for tag in tags_in_order:
        if(len(final_item_list)>=4):
            break
        else:
            tag_one = tag[0]
            for item in item_list:
                if(len(final_item_list)>=4):
                    break
                else:
                    item_id = item["item_id"]
                    record = m_collection.find_one({"item_id": item_id })
                    tags_order = record["tags"]
                    if(tag_one in tags_order):
                        if(item_id not in final_item_list):
                            final_item_list.append(item_id)
    
    return_list = []
    print(len(final_item_list))
    for temp_item in final_item_list:
        temp_dict={}
        temp_item = db.menu.find_one({"item_id":temp_item})
        temp_dict["item_id"] = temp_item["item_id"]
        temp_dict["item_name"] = temp_item["item_name"]
        temp_dict["eid"] = temp_item["eid"]
        temp_dict["e_type"] = temp_item["e_type"]
        temp_dict["e_name"] = get_est_name_from_item_id(temp_item["item_id"])
        temp_dict["item_price"] = temp_item["item_price"]
        temp_dict["currency"] = temp_item["currency"]
        temp_dict["status"] = temp_item["status"]
        temp_dict["avg_rating"] = temp_item["avg_rating"]
        temp_dict["img"] = temp_item["img"]
        return_list.append(temp_dict)

    print(len(return_list))

    if len(return_list) == 0:
        return jsonify(str({"success": "No Content"})),204
    else:
        return jsonify(str(return_list)), 200


#----------------------
#Helper functions
#----------------------
def update_avg_rating(item_id):
    reviews = db.reviews.find({"item_id":item_id})
    s = 0
    count = 0
    for review in reviews:
        s=s+review['rating']
        count=count+1

    avg_rating = s/count
    db.menu.update_one({"item_id":item_id},{"$set":{"avg_rating":avg_rating}})

def get_est_name_from_item_id(item_id):
    item = db.menu.find_one({"item_id":item_id})
    if item['e_type'] == 'Canteen':
        est = db.canteens.find_one({"can_id":item['eid']})
    elif item['e_type'] == 'Caterer':
        est = db.caterers.find_one({"cat_id":item['eid']})

    return est['establishment_name']





        

