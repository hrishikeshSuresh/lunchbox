show dbs
use lunchbox
db.dropDatabase()
show dbs
use lunchbox
show collections
// CANTEEN COLLECTION
db.createCollection("canteens")
db.canteens.insert({"name": "Food Point", "owner": "Shah Rukh", "location": "Banashankari", "city": "Bengaluru"})
db.canteens.insert({"name": "Vidhyarthi Bhavan", "owner": "Basaraj S. N.", "location": "Basavangudi", "city": "Bengaluru"})
// CATERER COLLECTION
db.createCollection("caterers")
db.caterers.insert({"name": "Delhi Marathi Catering Services", "owner": "Shivaji", "location": "Delhi-6", "city": "Bengaluru"})
db.caterers.insert({"name": "Vintage Delhi Catering Services", "owner": "Samuel", "location": "Vasant Kunj", "city": "Delhi"})
// USERS COLLECTION
db.createCollection("users")
db.users.insert({"username": "Shah Rukh", "password": "lunchbox000x", "account_type": "vendor"})
db.users.insert({"username": "Shivaji", "password": "pesu12", "account_type": "vendor"})
db.users.insert({"username": "Hrishi Kesh", "password": "googleme", "account_type": "customer"})
// REVIEWS AND RATINGS
db.createCollection("ratings")
db.ratings.insert({"username": "Shah Rukh", "name": "Delhi Marathi Catering Services", "city": "Bengaluru", "rating": 4, "review" : "I loved the food they served in my wedding!"})
db.ratings.insert({"username": "Shivaji", "name": "Delhi Marathi Catering Services", "city": "Bengaluru", "rating": 2, "review" : "Bad food. Bad management."})
db.ratings.insert({"username": "Shah Rukh", "name": "Vidhyarthi Bhavan", "city": "Delhi", "rating": 1, "review" : "Bad food. Place is crawling with critters!"})
db.ratings.insert({"username": "Shivaji", "name": "Vidhyarthi Bhavan", "city": "Delhi", "rating": 5, "review" : "Best food. Mera parivar ka favourite place in Delhi!"})
//SALES INFORMATION
db.createCollection("sales")
db.sales.insert({"username": "Shivaji", "name": "Vidhyarthi Bhavan", "city": "Delhi", "amount": 5000, "currency" : "INR", "payment_option": "Debit Card"})
db.sales.insert({"username": "Shah Rukh", "name": "Delhi Marathi Catering Services", "city": "Bengaluru", "amount": 10000, "currency" : "INR", "payment_option": "Credit Card"})
db.sales.insert({"username": "Shivaji", "name": "Delhi Marathi Catering Services", "city": "Bengaluru", "amount": 500, "currency" : "INR", "payment_option": "Cash"})
db.sales.insert({"username": "Shah Rukh", "name": "Vidhyarthi Bhavan", "city": "Delhi", "amount": 30000, "currency" : "INR", "payment_option": "Cash"})

//PAYMENT INFORMATION
