from flask import current_app
from bson import ObjectId
from datetime import datetime


# ---------------------------------------------------
# CREATE NEW SHELTER REQUEST
# ---------------------------------------------------
def create_shelter_request(shelter_id, user_data):
    """
    Create a new shelter request and link it to the NGO that owns the shelter
    """
    
    db = current_app.db
    shelter_collection = db["shelters"]
    request_collection = db["shelter_requests"]
    
    # First, get the shelter to find the NGO ID
    shelter = shelter_collection.find_one({"_id": ObjectId(shelter_id)})
    
    if not shelter:
        raise ValueError("Shelter not found")
    
    ngo_id = shelter.get("ngo_id")
    
    if not ngo_id:
        raise ValueError("Shelter has no associated NGO")
    
    # Create the request document
    request_document = {
        "shelter_id": ObjectId(shelter_id),
        "ngo_id": ngo_id,  # Link to the NGO
        "shelter_name": shelter.get("name"),  # For easier display
        "user_name": user_data.get("name"),
        "user_phone": user_data.get("phone"),
        "user_email": user_data.get("email"),
        "gender": user_data.get("gender"),
        "age": user_data.get("age"),
        "beds_needed": user_data.get("beds_needed", 1),
        "notes": user_data.get("notes", ""),
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = request_collection.insert_one(request_document)
    
    return str(result.inserted_id)


# ---------------------------------------------------
# GET REQUESTS FOR AN NGO
# ---------------------------------------------------
def get_requests_for_ngo(ngo_id):
    """
    Fetch all shelter requests for an NGO's shelters
    """
    
    db = current_app.db
    request_collection = db["shelter_requests"]
    
    requests = list(request_collection.find({"ngo_id": ngo_id}).sort("created_at", -1))
    
    for request in requests:
        request["_id"] = str(request["_id"])
        request["shelter_id"] = str(request["shelter_id"])
    
    return requests


# ---------------------------------------------------
# UPDATE REQUEST STATUS
# ---------------------------------------------------
def update_request_status(request_id, status):
    """
    Update the status of a shelter request (pending/approved/rejected)
    """
    
    db = current_app.db
    request_collection = db["shelter_requests"]
    
    result = request_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return result.modified_count


# ---------------------------------------------------
# GET ALL REQUESTS (ADMIN)
# ---------------------------------------------------
def get_all_requests():
    """
    Get all shelter requests in the system
    """
    
    db = current_app.db
    request_collection = db["shelter_requests"]
    
    requests = list(request_collection.find().sort("created_at", -1))
    
    for request in requests:
        request["_id"] = str(request["_id"])
        request["shelter_id"] = str(request["shelter_id"])
    
    return requests
