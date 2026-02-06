from datetime import datetime
from bson import ObjectId
from db.mongo import requests_collection

def create_request(shelter_id, ngo_id, user_location):
    requests_collection.insert_one({
    "shelterId": ObjectId(shelter_id),
    "ngoId": ObjectId(ngo_id),
    "userLocation": user_location,
    "status":"PENDING",
    "createdAt": datetime.utcnow()
    })

