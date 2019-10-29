# connection to database is done by this file
# has to be included in main.py before importing the views

# as we are using mongo-db as our database
# the database name should be lunchbox and collection should be same view names
# I'm guessing we are using pymongo for now
# import necessary libraries & just create a client that is global for now

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['lunchbox']
