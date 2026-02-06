from flask import Blueprint, request, jsonify, current_app

from services.search_service import (
    build_public_filters,
    get_paginated_shelters,
    get_nearby_shelters,
    get_offline_snapshot,
)

public_bp = Blueprint("public", __name__, url_prefix="/public")


def parse_int(value, default, min_val=None, max_val=None):
    try:
        value = int(value)
    except Exception:
        return default

    if min_val is not None:
        value = max(value, min_val)

    if max_val is not None:
        value = min(value, max_val)

    return value


@public_bp.route("/shelters", methods=["GET"])
def list_shelters():

    page = parse_int(request.args.get("page"), 1, 1)
    limit = parse_int(request.args.get("limit"), 10, 1, 50)

    filters = build_public_filters(request.args)

    mongo = current_app.config["MONGO_DB"]
    shelters_collection = mongo["shelters"]

    payload = get_paginated_shelters(
        shelters_collection=shelters_collection,
        filters=filters,
        page=page,
        limit=limit,
    )

    return jsonify(payload)


@public_bp.route("/nearby", methods=["GET"])
def nearby_shelters():

    try:
        lat = float(request.args["lat"])
        lng = float(request.args["lng"])
    except Exception:
        return jsonify({"error": "lat and lng are required"}), 400

    radius_km = parse_int(request.args.get("radius_km"), 10, 1, 50)
    limit = parse_int(request.args.get("limit"), 20, 1, 50)

    filters = build_public_filters(request.args)

    mongo = current_app.config["MONGO_DB"]
    shelters_collection = mongo["shelters"]

    results = get_nearby_shelters(
        shelters_collection=shelters_collection,
        lat=lat,
        lng=lng,
        filters=filters,
        radius_km=radius_km,
        limit=limit,
    )

    return jsonify({"count": len(results), "results": results})


@public_bp.route("/offline-snapshot", methods=["GET"])
def offline_snapshot():

    limit = parse_int(request.args.get("limit"), 50, 1, 100)

    lat = request.args.get("lat")
    lng = request.args.get("lng")

    lat_f = float(lat) if lat else None
    lng_f = float(lng) if lng else None

    filters = build_public_filters(request.args)

    mongo = current_app.config["MONGO_DB"]
    shelters_collection = mongo["shelters"]

    snapshot = get_offline_snapshot(
        shelters_collection=shelters_collection,
        filters=filters,
        limit=limit,
        lat=lat_f,
        lng=lng_f,
    )

    return jsonify(snapshot)
