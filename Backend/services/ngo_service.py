from flask import current_app
from bson import ObjectId
from datetime import datetime


# ---------------------------------------------------
# CREATE NGO (used during registration if needed)
# ---------------------------------------------------
def create_ngo(ngo_data):
    """
    Inserts a new NGO into the database
    """

    db = current_app.db
    ngo_collection = db["ngos"]

    ngo_data["created_at"] = datetime.utcnow()

    result = ngo_collection.insert_one(ngo_data)

    return str(result.inserted_id)


# ---------------------------------------------------
# GET NGO BY EMAIL
# ---------------------------------------------------
def get_ngo_by_email(email):
    """
    Fetch NGO using email
    """

    db = current_app.db
    ngo_collection = db["ngos"]

    ngo = ngo_collection.find_one({"email": email})

    if ngo:
        ngo["_id"] = str(ngo["_id"])

    return ngo


# ---------------------------------------------------
# GET NGO BY ID
# ---------------------------------------------------
def get_ngo_by_id(ngo_id):
    """
    Fetch NGO using Mongo ObjectId
    """

    db = current_app.db
    ngo_collection = db["ngos"]

    ngo = ngo_collection.find_one({"_id": ObjectId(ngo_id)})

    if ngo:
        ngo["_id"] = str(ngo["_id"])

    return ngo


# ---------------------------------------------------
# UPDATE NGO PROFILE
# ---------------------------------------------------
def update_ngo_profile(ngo_id, update_data):
    """
    Update NGO details like name, phone etc.
    """

    db = current_app.db
    ngo_collection = db["ngos"]

    result = ngo_collection.update_one(
        {"_id": ObjectId(ngo_id)},
        {"$set": update_data}
    )

    return result.modified_count


# ---------------------------------------------------
# DELETE NGO (rarely used but future safe)
# ---------------------------------------------------
def delete_ngo(ngo_id):
    """
    Deletes an NGO from database
    """

    db = current_app.db
    ngo_collection = db["ngos"]

    result = ngo_collection.delete_one({"_id": ObjectId(ngo_id)})

    return result.deleted_count


# ---------------------------------------------------
# LIST ALL NGOs (admin/future analytics)
# ---------------------------------------------------
def list_all_ngos():
    """
    Returns all NGOs in the system
    """

    db = current_app.db
    ngo_collection = db["ngos"]

    ngos = list(ngo_collection.find())

    for ngo in ngos:
        ngo["_id"] = str(ngo["_id"])

    return ngos
