# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database
from db_connector import *
from flask_app import *
from common import *

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
        print(mongo_cmd, " added.")
        return jsonify("Added review & rating"), 200
