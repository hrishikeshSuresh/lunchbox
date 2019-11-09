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
            all_caterers.add(document['name'])
        return jsonify(str(all_caterers)), 200

# list all available canteens
@app.route('/showAllCanteens', methods = ['GET'])
def showAllCanteens():
    if request.method == 'GET':
        canteen_data = readCanteenCollection()
        all_canteens = set()
        for document in canteen_data:
            all_canteens.add(document['name'])
        return jsonify(str(all_canteens)), 200
