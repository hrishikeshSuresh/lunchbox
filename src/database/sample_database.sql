show dbs
use lunchbox
db.dropDatabase()
show dbs
use lunchbox
show collections

// CANTEEN COLLECTION
db.createCollection("canteens")
db.canteens.insert({"establishment_name": "Food Point", "owner": "Shah Rukh", "location": "Banashankari", "city": "Bengaluru"})
db.canteens.insert({"establishment_name": "Vidhyarthi Bhavan", "owner": "Basaraj S. N.", "location": "Basavangudi", "city": "Bengaluru"})

// CATERER COLLECTION
db.createCollection("caterers")
db.caterers.insert({"establishment_name": "Delhi Marathi Catering Services", "owner": "Shivaji", "location": "Delhi-6", "city": "Bengaluru"})
db.caterers.insert({"establishment_name": "Vintage Delhi Catering Services", "owner": "Samuel", "location": "Vasant Kunj", "city": "Delhi"})

// USERS COLLECTION
db.createCollection("users")
db.users.insert({"username": "Shah Rukh", "password": "lunchbox000x", "account_type": "vendor"})
db.users.insert({"username": "Shivaji", "password": "pesu12", "account_type": "vendor"})
db.users.insert({"username": "Hrishi Kesh", "password": "googleme", "account_type": "customer"})

// REVIEWS AND RATINGS
db.createCollection("ratings")
db.ratings.insert({"username": "Shah Rukh", "establishment_name": "Delhi Marathi Catering Services", "city": "Bengaluru", "rating": 4, "review" : "I loved the food they served in my wedding!"})
db.ratings.insert({"username": "Shivaji", "establishment_name": "Delhi Marathi Catering Services", "city": "Bengaluru", "rating": 2, "review" : "Bad food. Bad management."})
db.ratings.insert({"username": "Shah Rukh", "establishment_name": "Vidhyarthi Bhavan", "city": "Delhi", "rating": 1, "review" : "Bad food. Place is crawling with critters!"})
db.ratings.insert({"username": "Shivaji", "establishment_name": "Vidhyarthi Bhavan", "city": "Delhi", "rating": 5, "review" : "Best food. Mera parivar ka favourite place in Delhi!"})

//SALES INFORMATION
db.createCollection("sales")
db.sales.insert({"username": "Shivaji", "establishment_name": "Vidhyarthi Bhavan", "city": "Delhi", "amount": 5000, "currency" : "INR", "payment_option": "Debit Card", "date": ISODate()})
db.sales.insert({"username": "Shah Rukh", "establishment_name": "Delhi Marathi Catering Services", "city": "Bengaluru", "amount": 10000, "currency" : "INR", "payment_option": "Credit Card", "date": ISODate()})
db.sales.insert({"username": "Shivaji", "establishment_name": "Delhi Marathi Catering Services", "city": "Bengaluru", "amount": 500, "currency" : "INR", "payment_option": "Cash", "date": new Date()})
db.sales.insert({"username": "Shah Rukh", "establishment_name": "Vidhyarthi Bhavan", "city": "Delhi", "amount": 30000, "currency" : "INR", "payment_option": "Cash", "date": new Date()})

//MENU INFORMATION
db.createCollection("menu")
db.menu.insert({"establishment_name": "Vidhyarthi Bhavan", "item_name": "Idly Vada", "item_price": "35", "currency": "INR"})
db.menu.insert({"establishment_name": "Vidhyarthi Bhavan", "item_name": "Masala Dosa", "item_price": "60", "currency": "INR"})
db.menu.insert({"establishment_name": "Food Point", "item_name": "Gobi Manchuri", "item_price": "50", "currency": "INR"})
db.menu.insert({"establishment_name": "Food Point", "item_name": "Chicken Fried Rice", "item_price": "90", "currency": "INR"})
db.menu.insert({"establishment_name": "Delhi Marathi Catering Services", "item_name": "Marathi Lunch", "item_price": "200", "currency": "INR"})
db.menu.insert({"establishment_name": "Vintage Delhi Catering Services", "item_name": "South Indian Tamil Meals", "item_price": "300", "currency": "INR"})
