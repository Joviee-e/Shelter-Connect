from flask import Blueprint, current_app, request, jsonify
from bson import ObjectId

public_bp = Blueprint("public", __name__)


# -----------------------------------
# GET ALL SHELTERS
# -----------------------------------
@public_bp.route("/shelters", methods=["GET"])
def get_public_shelters():
    db = current_app.db

    shelters = list(db.shelters.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for shelter in shelters:
        shelter["_id"] = str(shelter["_id"])

    return jsonify({
        "success": True,
        "count": len(shelters),
        "data": shelters
    })


# -----------------------------------
# GET SHELTER BY ID  (VERY IMPORTANT)
# -----------------------------------
@public_bp.route("/shelters/<id>", methods=["GET"])
def get_shelter_by_id(id):
    db = current_app.db

    try:
        shelter = db.shelters.find_one({"_id": ObjectId(id)})

        if not shelter:
            return jsonify({
                "success": False,
                "message": "Shelter not found"
            }), 404

        shelter["_id"] = str(shelter["_id"])  # convert ObjectId to string

        return jsonify({
            "success": True,
            "data": shelter
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
