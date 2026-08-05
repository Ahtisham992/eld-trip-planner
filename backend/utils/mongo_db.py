import os
from pymongo import MongoClient

# Use the provided MongoDB URI
MONGO_URI = "mongodb://shamimuhammad77:helloAhtisham@cluster1-shard-00-00.yvtj5.mongodb.net:27017,cluster1-shard-00-01.yvtj5.mongodb.net:27017,cluster1-shard-00-02.yvtj5.mongodb.net:27017/?replicaSet=atlas-ewagxf-shard-0&tls=true&authSource=admin"

# Initialize MongoClient
try:
    client = MongoClient(MONGO_URI)
    db = client['eld_planner']
    trips_collection = db['trips']
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    db = None
    trips_collection = None
