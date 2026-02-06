from flask import current_app
from bson import ObjectId
from datetime import datetime


# ---------------------------------------------------
# Internal Helper
# ---------------------------------------------------

def _collection():
    db = current_app.config["MONGO_DB"]
    return db["shelters"]


# ---------------------------------------------------
# ADD NEW SHELTER
# ---------------------------------------------------

def create_shelter(ngo_id, shelter_data):
    """
    Create a new shelter under an NGO
    """

    shelters = _collection()

    shelter_document = {
        "ngo_id": ngo_id,
        "name": shelter_data.get("name"),
        "address": shelter_data.get("address"),
        "city": shelter_data.get("city"),
        "state": shelter_data.get("state"),
        "pincode": shelter_data.get("pincode"),
        "totalBeds": shelter_data.get("totalBeds", 0),
        "availableBeds": shelter_data.get("availableBeds", 0),
        "emergencyEnabled": False,
        "status": "ACTIVE",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }

    result = shelters.insert_one(shelter_document)

    return str(result.inserted_id)


# ---------------------------------------------------
# GET SHELTER BY ID
# ---------------------------------------------------

def get_shelter_by_id(shelter_id):

    shelters = _collection()

    shelter = shelters.find_one({"_id": ObjectId(shelter_id)})

    if shelter:
        shelter["_id"] = str(shelter["_id"])

    return shelter


# ---------------------------------------------------
# GET ALL SHELTERS FOR AN NGO
# ---------------------------------------------------

def get_shelters_by_ngo(ngo_id):

    shelters = _collection()

    docs = list(shelters.find({"ngo_id": ngo_id}))

    for shelter in docs:
        shelter["_id"] = str(shelter["_id"])

    return docs


# ---------------------------------------------------
# UPDATE SHELTER DETAILS
# ---------------------------------------------------

def update_shelter(shelter_id, update_data):

    shelters = _collection()

    update_data["updatedAt"] = datetime.utcnow()

    result = shelters.update_one(
        {"_id": ObjectId(shelter_id)},
        {"$set": update_data},
    )

    return result.modified_count


# ---------------------------------------------------
# DELETE SHELTER
# ---------------------------------------------------

def delete_shelter(shelter_id):

    shelters = _collection()

    result = shelters.delete_one({"_id": ObjectId(shelter_id)})

    return result.deleted_count


# ---------------------------------------------------
# UPDATE AVAILABLE BEDS
# ---------------------------------------------------

def update_available_beds(shelter_id, beds_count):

    shelters = _collection()

    result = shelters.update_one(
        {"_id": ObjectId(shelter_id)},
        {
            "$set": {
                "availableBeds": beds_count,
                "updatedAt": datetime.utcnow(),
            }
        },
    )

    return result.modified_count


# ---------------------------------------------------
# TOGGLE EMERGENCY MODE
# ---------------------------------------------------

def toggle_emergency_mode(shelter_id, status):

    shelters = _collection()

    result = shelters.update_one(
        {"_id": ObjectId(shelter_id)},
        {
            "$set": {
                "emergencyEnabled": status,
                "updatedAt": datetime.utcnow(),
            }
        },
    )

    return result.modified_count


# ---------------------------------------------------
# LIST ALL SHELTERS (ADMIN / FUTURE)
# ---------------------------------------------------

def list_all_shelters():

    shelters = _collection()

    docs = list(shelters.find())

    for shelter in docs:
        shelter["_id"] = str(shelter["_id"])

    return docs
