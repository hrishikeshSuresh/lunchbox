show dbs
use lunchbox
show collections
// CANTEEN COLLECTION
db.createCollection("canteen")
db.canteen.insert({"name": "Food Point", "owner": "Shah Rukh", "location": "Banashankari", "city": "Bengaluru"})
db.canteen.insert({"name": "Vidhyarthi Bhavan", "owner": "Basaraj S. N.", "location": "Basavangudi", "city": "Bengaluru"})
// CATERER COLLECTION
db.createCollection("caterer")
db.caterer.insert({"name": "Delhi Marathi Catering Services", "owner": "Shivaji", "location": "Delhi-6", "city": "Bengaluru"})
db.caterer.insert({"name": "Vintage Delhi Catering Services", "owner": "Samuel", "location": "Vasant Kunj", "city": "Delhi"})
// USERS COLLECTION
db.createCollection("users")
db.users.insert({"username": "Shah Rukh", "password": "lunchbox000x", "account_type": "vendor"})
db.users.insert({"username": "Shivaji", "password": "pesu12", "account_type": "vendor"})
db.users.insert({"username": "Hrishi Kesh", "password": "googleme", "account_type": "customer"})
