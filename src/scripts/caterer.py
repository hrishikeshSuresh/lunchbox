# all endpoints related to caterer's view

# list all available caterers
@app.route('/showAllCaterers', methods = ['GET'])
def showAllCaterers():
    if request.method == 'GET':
        caterers = db['caterers']
        data = caterers.find({})
        return jsonify(data)
