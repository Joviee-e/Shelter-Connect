from datetime import datetime
from bson import ObjectId
from db.mongo import shelters_collection

def update_available_beds(shelter_id, beds):
    shelters_collection.update_one(
        {"_id": ObjectId(shelter_id)},
        {
        "$set": {
        "availableBeds": beds,
        "updatedAt": datetime.utcnow()
        }
        }
    )

