# all functions common to all files
from db_connector import *
from flask_app import *
from datetime import datetime

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

def readSalesCollection():
    print("reading sales data...")
    sales_collection = db['sales']
    cursor = sales_collection.find({})
    sales_data = []
    for i in cursor:
        sales_data.append(i)
    print("\nSALES DATA")
    pp.pprint(sales_data)
    return sales_data

def readRatingsCollection():
    print("reading ratings data...")
    ratings_collection = db['ratings']
    cursor = ratings_collection.find({})
    ratings_data = []
    for i in cursor:
        ratings_data.append(i)
    print("\nRATINGS DATA")
    pp.pprint(ratings_data)
    return ratings_data

def readMenuCollection():
    print("reading menu data...")
    menu_collection = db['menu']
    cursor = menu_collection.find({})
    menu_data = []
    for i in cursor:
        menu_data.append(i)
    print("\nMENU DATA")
    pp.pprint(menu_data)
    return menu_data
