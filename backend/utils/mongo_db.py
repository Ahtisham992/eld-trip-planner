import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Initialize MongoClient
try:
    client = MongoClient(MONGO_URI)
    db = client['eld_planner']
    trips_collection = db['trips']
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    db = None
    trips_collection = None
