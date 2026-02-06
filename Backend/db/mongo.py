from pymongo import MongoClient
from config import Config

# Initialize Mongo client using Config class
client = MongoClient(Config.MONGO_URI)

db = client[Config.DB_NAME]

# Collections
ngos_collection = db["ngos"]
shelters_collection = db["shelters"]
requests_collection = db["requests"]
