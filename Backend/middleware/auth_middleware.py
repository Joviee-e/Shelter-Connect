from functools import wraps
from flask import request, jsonify, current_app, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from bson import ObjectId


# -------------------------------------------------
# JWT PROTECTED ROUTE DECORATOR
# -------------------------------------------------
def jwt_required_ngo(fn):
    """
    Protects routes so only authenticated NGOs can access them.

    - Verifies JWT
    - Fetches NGO from MongoDB
    - Attaches NGO object to flask global context (g.ngo)
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Verify JWT token in request header
            verify_jwt_in_request()

            # Extract NGO ID from token
            ngo_id = get_jwt_identity()

            if not ngo_id:
                return jsonify({"error": "Invalid token"}), 401

            # Fetch NGO from database
            db = current_app.db
            ngo_collection = db["ngos"]

            ngo = ngo_collection.find_one({"_id": ObjectId(ngo_id)})

            if not ngo:
                return jsonify({"error": "NGO not found"}), 404

            # Attach NGO to request context
            g.ngo = {
                "id": str(ngo["_id"]),
                "ngo_name": ngo.get("ngo_name"),
                "email": ngo.get("email"),
                "phone": ngo.get("phone")
            }

        except Exception as e:
            return jsonify({"error": "Authentication failed", "details": str(e)}), 401

        return fn(*args, **kwargs)

    return wrapper


# -------------------------------------------------
# OPTIONAL ROLE CHECK (FUTURE SAFE)
# -------------------------------------------------
def ngo_role_required(fn):
    """
    Extra protection to ensure only NGO role users access certain routes.
    Useful if later admin/users are added.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not hasattr(g, "ngo"):
            return jsonify({"error": "Unauthorized access"}), 403

        # Role pulled from DB if needed later
        return fn(*args, **kwargs)

    return wrapper
