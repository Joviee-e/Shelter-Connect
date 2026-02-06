
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


# Blueprint for auth routes
auth_bp = Blueprint("auth_bp", __name__)


# ----------------------------------------
# NGO REGISTER
# ----------------------------------------
@auth_bp.route("/register", methods=["POST"])
def register_ngo():
    """
    Registers a new NGO
    """

    data = request.get_json()

    # Validate required fields
    required_fields = ["ngo_name", "email", "password", "phone"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    db = current_app.db
    ngo_collection = db["ngos"]

    # Check if NGO already exists
    existing_ngo = ngo_collection.find_one({"email": data["email"]})
    if existing_ngo:
        return jsonify({"error": "NGO with this email already exists"}), 409

    # Hash password
    hashed_password = generate_password_hash(data["password"])

    # Create NGO document
    ngo_data = {
        "ngo_name": data["ngo_name"],
        "email": data["email"],
        "phone": data["phone"],
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "role": "ngo"
    }

    ngo_collection.insert_one(ngo_data)

    return jsonify({
        "message": "NGO registered successfully"
    }), 201


# ----------------------------------------
# NGO LOGIN
# ----------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login_ngo():
    """
    NGO login and JWT generation
    """

    data = request.get_json()

    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400

    db = current_app.db
    ngo_collection = db["ngos"]

    ngo = ngo_collection.find_one({"email": data["email"]})

    if not ngo:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check password
    if not check_password_hash(ngo["password"], data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    token = create_access_token(identity=str(ngo["_id"]))

    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "ngo": {
            "id": str(ngo["_id"]),
            "ngo_name": ngo["ngo_name"],
            "email": ngo["email"],
            "phone": ngo["phone"]
        }
    }), 200
