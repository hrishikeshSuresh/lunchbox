# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database
from db_connector import *
from flask_app import *

# list all available canteens
@app.route('/showAllCanteens', methods = ['GET'])
def showAllCanteens():
    if request.method == 'GET':
        canteens = db['canteen']
        cursor = canteens.find({})
        result = []
        for i in cursor:
            result.append(i);
        print(result)
        return jsonify(str(result))

# list all available caterers
@app.route('/showAllCaterers', methods = ['GET'])
def showAllCaterers():
    if request.method == 'GET':
        caterers = db['caterers']
        data = caterers.find({})
        return jsonify(data)
