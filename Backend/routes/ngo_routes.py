from flask import Blueprint, jsonify, request, g

from middleware.auth_middleware import jwt_required_ngo
from services.ngo_service import (
    get_ngo_by_id,
    update_ngo_profile
)

# Blueprint
ngo_bp = Blueprint("ngo_bp", __name__)


# ---------------------------------------------------
# GET NGO PROFILE
# ---------------------------------------------------
@ngo_bp.route("/profile", methods=["GET"])
@jwt_required_ngo
def get_profile():
    """
    Fetch logged-in NGO profile
    """

    ngo_id = g.ngo["id"]

    ngo = get_ngo_by_id(ngo_id)

    if not ngo:
        return jsonify({"error": "NGO not found"}), 404

    # Remove sensitive info if present
    ngo.pop("password", None)

    return jsonify({
        "ngo": ngo
    }), 200


# ---------------------------------------------------
# UPDATE NGO PROFILE
# ---------------------------------------------------
@ngo_bp.route("/update-profile", methods=["PUT"])
@jwt_required_ngo
def update_profile():
    """
    Update NGO details like name, phone
    """

    ngo_id = g.ngo["id"]
    data = request.get_json()

    if not data:
        return jsonify({"error": "No update data provided"}), 400

    updated = update_ngo_profile(ngo_id, data)

    if updated == 0:
        return jsonify({"error": "Profile not updated"}), 400

    return jsonify({
        "message": "NGO profile updated successfully"
    }), 200


# ---------------------------------------------------
# GET NGO DASHBOARD DATA (BASIC)
# ---------------------------------------------------
@ngo_bp.route("/dashboard", methods=["GET"])
@jwt_required_ngo
def ngo_dashboard():
    """
    Basic dashboard info for NGO
    """

    ngo_id = g.ngo["id"]

    ngo = get_ngo_by_id(ngo_id)

    if not ngo:
        return jsonify({"error": "NGO not found"}), 404

    ngo.pop("password", None)

    return jsonify({
        "message": "NGO dashboard loaded",
        "ngo": ngo
    }), 200
