# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database
from db_connector import *
from flask_app import *
from common import *
import random

#-----------------------------------------------------------------------------------------------------------
#Customer API 1- View previous orders
@app.route('/api/v1/customer/previous_orders',methods=['GET'])
def view_previous_orders():
    if not request.cookies.get('user_type'):
        return jsonify(str({"error":"Bad Request"})),400 

    user_type = request.cookies.get('user_type')
    if user_type == 'Customer' and (not (request.cookies.get('uid') or request.cookies.get('iid'))):
        return jsonify(str({"error":"Bad Request"})),400 
    else:
        uid = request.cookies.get('uid')
        iid = request.cookies.get('iid')

    orders = db.orders.find({"uid":uid}).sort("timestamp",-1)
    if orders.count() == 0:
        return jsonify(str({"success":"No Content"})),204 
    temp_dict = {}
    for order in orders:
        if order['e_type'] == 'Canteen':
            e = db.canteens.find_one({"can_id":order['eid']})
            temp_e_name = e['establishment_name']
            token_or_did = "token"
            token_or_did_val = order['token']
        elif order['e_type'] == 'Caterer':
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
#Place an order
@app.route('/api/v1/place_order', methods = ['POST'])
def place_order():
    if request.method == 'POST':
        uid = request.cookies.get('uid') 
        items = request.json.get('items')
        amount = request.json.get('amount')
        currency = request.json.get('currency')
        payment = request.json.get('payment_option')
        location = request.json.get('location')

        

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





        

