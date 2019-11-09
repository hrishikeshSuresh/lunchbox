# all endpoints related to caterer's view
from db_connector import *
from flask_app import *
from common import *

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
