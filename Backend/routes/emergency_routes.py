from flask import Blueprint, request, jsonify, current_app

from schemas.emergency_schema import EmergencyQuerySchema
from services.emergency_service import (
    get_nearest_shelters,
    build_emergency_filter,
)

emergency_bp = Blueprint("emergency", __name__, url_prefix="/emergency")


def parse_float(val):
    try:
        return float(val)
    except Exception:
        return None


@emergency_bp.route("/nearest", methods=["GET"])
def emergency_nearest_shelters():

    lat = parse_float(request.args.get("lat"))
    lng = parse_float(request.args.get("lng"))

    if lat is None or lng is None:
        return jsonify({"error": "lat and lng are required"}), 400

    query_data = dict(request.args)
    query_data["lat"] = lat
    query_data["lng"] = lng

    try:
        query = EmergencyQuerySchema(**query_data)
    except Exception as e:
        return jsonify({"error": "Invalid query parameters", "details": str(e)}), 400

    mongo = current_app.config["MONGO_DB"]
    shelters_collection = mongo["shelters"]

    filters = build_emergency_filter(query.dict())

    shelters = get_nearest_shelters(
        shelters_collection=shelters_collection,
        lat=query.lat,
        lng=query.lng,
        filters=filters,
        limit=3,
    )

    return jsonify(
        {
            "mode": "emergency",
            "count": len(shelters),
            "results": shelters,
        }
    )
