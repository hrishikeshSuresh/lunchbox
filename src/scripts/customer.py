# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database
from db_connector import *
from flask_app import *
from common import *







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
        establishment_name = request_data['establishment_name']
        rating = request_data['rating']
        review = request_data['review']
        date = str(datetime.now().time())
        payment_option = request_data['payment_option']
        mongo_cmd = { 'username': username,
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





#Get average rating@app.route('/api/v1/get_rating', methods = ['GET'])
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

