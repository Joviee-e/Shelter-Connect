from datetime import datetime
from bson import ObjectId
from db.mongo import shelters_collection


# ---------------------------------------------------
# ADD NEW SHELTER
# ---------------------------------------------------
def create_shelter(ngo_id, shelter_data):
    """
    Create a new shelter under an NGO
    """

    shelter_document = {
        "ngo_id": ngo_id,
        "name": shelter_data.get("name"),
        "address": shelter_data.get("address"),
        "city": shelter_data.get("city"),
        "state": shelter_data.get("state"),
        "pincode": shelter_data.get("pincode"),
        "total_beds": shelter_data.get("total_beds", 0),
        "available_beds": shelter_data.get("available_beds", 0),
        "emergency_mode": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = shelters_collection.insert_one(shelter_document)

    return str(result.inserted_id)


# ---------------------------------------------------
# GET SHELTER BY ID
# ---------------------------------------------------
def get_shelter_by_id(shelter_id):
    """
    Fetch shelter using shelter ID
    """

    shelter = shelters_collection.find_one({"_id": ObjectId(shelter_id)})

    if shelter:
        shelter["_id"] = str(shelter["_id"])

    return shelter


# ---------------------------------------------------
# GET ALL SHELTERS FOR AN NGO
# ---------------------------------------------------
def get_shelters_by_ngo(ngo_id):
    """
    Fetch all shelters belonging to a specific NGO
    """

    shelters = list(shelters_collection.find({"ngo_id": ngo_id}))

    for shelter in shelters:
        shelter["_id"] = str(shelter["_id"])

    return shelters


# ---------------------------------------------------
# UPDATE SHELTER DETAILS
# ---------------------------------------------------
def update_shelter(shelter_id, update_data):
    """
    Update shelter details like name, address etc.
    """

    update_data["updated_at"] = datetime.utcnow()

    result = shelters_collection.update_one(
        {"_id": ObjectId(shelter_id)},
        {"$set": update_data}
    )

    return result.modified_count


# ---------------------------------------------------
# DELETE SHELTER
# ---------------------------------------------------
def delete_shelter(shelter_id):
    """
    Remove a shelter
    """

    result = shelters_collection.delete_one({"_id": ObjectId(shelter_id)})

    return result.deleted_count


# ---------------------------------------------------
# UPDATE AVAILABLE BEDS
# ---------------------------------------------------
def update_available_beds(shelter_id, beds_count):
    """
    Update the number of available beds
    """

    result = shelters_collection.update_one(
        {"_id": ObjectId(shelter_id)},
        {
            "$set": {
                "available_beds": beds_count,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.modified_count


# ---------------------------------------------------
# TOGGLE EMERGENCY MODE
# ---------------------------------------------------
def toggle_emergency_mode(shelter_id, status):
    """
    Turn emergency mode ON/OFF for shelter
    """

    result = shelters_collection.update_one(
        {"_id": ObjectId(shelter_id)},
        {
            "$set": {
                "emergency_mode": status,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.modified_count


# ---------------------------------------------------
# LIST ALL SHELTERS
# ---------------------------------------------------
def list_all_shelters():
    """
    Returns all shelters in the system
    """

    shelters = list(shelters_collection.find())

    for shelter in shelters:
        shelter["_id"] = str(shelter["_id"])

    return shelters
