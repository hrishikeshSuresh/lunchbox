# all endpoints related to customer view
# assuming the connection to database is called client
# where client = MongoClient('localhost', ...)
# and db = client.lunchbox where lunchbox is the name of the database

# list all available canteens
@app.route('/showAllCanteens', methods = ['GET'])
def showAllCanteens():
    if request.method == 'GET':
        canteens = db['canteens']
        data = canteens.find({})
        return jsonify(data)
