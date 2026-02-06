from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)

db = client[DB_NAME]

ngos_collection = db["ngos"]
shelters_collection = db["shelters"]
requests_collection = db["requests"]