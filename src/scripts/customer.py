# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database
from db_connector import *
from flask_app import *
from common import *


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
    return jsonify(str({"success":"created"})), 201

#-----------------------------------------------------------------------------------------------------------


#list all menu items
@app.route('/api/v1/menu', methods=['GET'])
def listmenuitems():
    if request.method != 'GET':
        return jsonify(str({error: "Method not allowed"})),405
    menu_data = readMenuCollection()
    count=0
    pp.pprint(menu_data)
    
    item_list = list()
    for document in menu_data:
        if document['status']==1:
            count=count+1
            menu_item = {"establishment_name":document['establishment_name'],"item_name": document['item_name'], "item_price": document['item_price'], "currency": document['currency'], "img": document['img'], "rating":readRatingsForItem( document['item_name'])}
            item_list.append(menu_item)
    print("menu sent")
    print(len(item_list))
    print(request.cookies)
    if count==0:
        return jsonify(str({})),204
    return jsonify(str(item_list)), 200

#Filter items by tag

@app.route('/api/v1/search_tag/<tag>', methods=['GET'])
def filtermenuitems(tag):
    if request.method != 'GET':
        return jsonify(str({error: "Method not allowed"})),405
    menu_data = readMenuCollection()
    count=0
    pp.pprint(menu_data)
    
    item_list = list()
    for document in menu_data:
        if document['status']==1 and (tag in document['tags']):
            count=count+1
            menu_item = {"establishment_name":document['establishment_name'],"item_name": document['item_name'], "item_price": document['item_price'], "currency": document['currency'], "img": document['img'], "rating":readRatingsForItem( document['item_name'])}
            item_list.append(menu_item)
    print("filter menu sent")
    if count==0:
        return jsonify(str({})),204
    return jsonify(str(item_list)), 200

#search for a specific item by name or by name of the establishment
@app.route('/api/v1/<searchstr>/search_food', methods=['GET'])
def searchforfood(searchstr):
    if request.method != 'GET':
        return jsonify(str({error: "Method not allowed"})),405
    menu_data = readMenuCollection()
    count=0
    pp.pprint(menu_data)
    searchstr=searchstr.lower()
    item_list = list()
    for document in menu_data:
        item_flag=(document['item_name'].lower()).find(searchstr)
        est_pat=(document['establishment_name'].lower()).find(searchstr)
        
        if (item_flag!=-1 or est_pat!=-1) and document['status']==1:
            count=count+1
            search_item = {"establishment_name":document['establishment_name'],"item_name": document['item_name'], "item_price": document['item_price'], "currency": document['currency'], "img": document['img'], "rating":readRatingsForItem( document['item_name'])}
            item_list.append(search_item)
            
    print("menu sent")
    if count==0:
        return jsonify(str({})),204
    return jsonify(str(item_list)), 200












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


@app.route('/api/v1/change_password', methods= ['POST'])
def change_password():
    if request.method == 'POST':
        
        request_data={}
        request_data["username"] = request.json.get("username")
        request_data["password"] = request.json.get("password").upper()
        request_data["new_password"] = request.json.get("new_password").upper()
        request_data["confirm_password"] = request.json.get("confirm_password").upper()
        #if not request.cookies.get('username'):
            #   return {},400
        db_user = db['users'].find_one({"username":request_data['username']})
        print("\n\n\n Fucked\n\n\n")
        print(db_user)
        if (db_user['password'] == request_data['password'] and request_data['new_password'] == request_data['confirm_password']) and (request_data['password'] != request_data['new_password']) :
            print("\n\n\n Fucked2\n\n\n")
            db['users'].update_one({"username":request_data['username']},{"$set":{"password":request_data["new_password"]}})
            print(' \n \n \n \n jadoskad \n')
            return jsonify(str({"success":"Password change successful"})), 201
        else:
            return jsonify(str({"error":"Invalid credentials"}))




    else:
        return jsonify({error:"Method not allowed"}), 405



#Place an order
@app.route('/api/v1/place_order', methods = ['POST'])
def place_order():
    if request.method == 'POST':
        username = request.json.get('username') 
        estdname = request.json.get('establishment_name') 
        item = request.json.get('item') 
        amount = request.json.get('amount')
        city = request.json.get('city')
        currency = request.json.get('currency')
        payment_option = request.json.get('payment_option')
        db['sales'].insert({"username": username, "establishment_name": estdname, "item":item,  "city": city, "amount": amount, "currency": currency, "payment_option": payment_option})   
        return jsonify("Redirect to payment for approval"), 200





#Get average rating
@app.route('/api/v1/get_rating', methods = ['GET'])
def get_rating():
    if request.method == 'GET':
        item = request.json.get('item')
        rating = 0
        count = 0 
        for query in db['ratings'].find({"item": item  }):
            rating = rating + query.json.get("rating")
            count+=1
        print("\n\n\n\n\n")
        print(count)
        print("\n\n\n\n\n") 
        if count==0:
            return jsonify({"rating": -1}),204
        else:
            rating = rating / count
            return jsonify ( { "rating": rating }), 200

