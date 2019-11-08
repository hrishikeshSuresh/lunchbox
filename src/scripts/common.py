# all functions common to all files
from db_connector import *
from flask_app import *

def readCanteenCollection():
    print("reading canteen data...")
    canteen_collection = db['canteens']
    cursor = canteen_collection.find({})
    canteen_data = []
    for i in cursor:
        canteen_data.append(i)
    print("\nCANTEEN DATA")
    pp.pprint(canteen_data)
    return canteen_data

def readCatererCollection():
    print("reading caterer data...")
    caterer_collection = db['caterers']
    cursor = caterer_collection.find({})
    caterer_data = []
    for i in cursor:
        caterer_data.append(i)
    print("\nCATERER DATA")
    pp.pprint(caterer_data)
    return caterer_data

