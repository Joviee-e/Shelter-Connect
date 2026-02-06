from flask import Blueprint, request, jsonify, g
from services.request_service import (
    create_shelter_request,
    get_requests_for_ngo,
    update_request_status
)
from middleware.auth_middleware import jwt_required_ngo

request_bp = Blueprint("request_routes", __name__)


# ---------------------------------------------------
# CREATE SHELTER REQUEST (PUBLIC - NO AUTH)
# ---------------------------------------------------
@request_bp.route("/create", methods=["POST"])
def create_request():
    """
    Public endpoint for users to submit shelter requests
    """
    
    data = request.get_json()
    shelter_id = data.get("shelter_id")
    
    if not shelter_id:
        return jsonify({"error": "shelter_id is required"}), 400
    
    try:
        request_id = create_shelter_request(shelter_id, data)
        
        return jsonify({
            "message": "Request submitted successfully",
            "request_id": request_id
        }), 201
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Failed to create request"}), 500


# ---------------------------------------------------
# GET REQUESTS FOR LOGGED-IN NGO
# ---------------------------------------------------
@request_bp.route("/ngo", methods=["GET"])
@jwt_required_ngo
def get_ngo_requests():
    """
    Get all shelter requests for the logged-in NGO
    """
    
    ngo_id = g.ngo["id"]
    
    try:
        requests = get_requests_for_ngo(ngo_id)
        
        return jsonify({
            "success": True,
            "count": len(requests),
            "requests": requests
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch requests"}), 500


# ---------------------------------------------------
# UPDATE REQUEST STATUS
# ---------------------------------------------------
@request_bp.route("/<request_id>/status", methods=["PUT"])
@jwt_required_ngo
def update_status(request_id):
    """
    Update the status of a request (approve/reject)
    """
    
    data = request.get_json()
    status = data.get("status")
    
    if status not in ["pending", "approved", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400
    
    try:
        modified = update_request_status(request_id, status)
        
        if modified:
            return jsonify({"message": "Request status updated"}), 200
        else:
            return jsonify({"error": "Request not found"}), 404
            
    except Exception as e:
        return jsonify({"error": "Failed to update status"}), 500
