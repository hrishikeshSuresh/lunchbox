# main file where all modules & sub-modules are imported
# only main function should be here
# import necessary files
# IP Address, port number are passed as arguments
from flask_app import *
# importing other views 
import caterer
import customer
import institution
import login
import delivery

def main():
    print("Lunchbox starting...")
    app.run(debug = True, host = sys.argv[1], port = int(sys.argv[2]))
    print("Lunchbox closing...")

if __name__ == "__main__":
    main()

