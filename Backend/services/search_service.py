from pymongo.collection import Collection
from datetime import datetime
from utils.geo_helpers import meters_to_km

MAX_LIMIT = 50
MAX_RADIUS_KM = 50


def build_public_filters(params: dict):
    filters = {}

    if params.get("pets"):
        filters["pets_allowed"] = True

    if params.get("family"):
        filters["family_friendly"] = True

    if params.get("food"):
        filters["food_available"] = True

    if params.get("max_price") is not None:
        try:
            filters["price"] = {"$lte": int(params["max_price"])}
        except Exception:
            pass

    return filters


def get_paginated_shelters(
    shelters_collection: Collection,
    filters: dict,
    page: int,
    limit: int,
):
    page = max(page, 1)
    limit = min(limit, MAX_LIMIT)

    skip = (page - 1) * limit

    total = shelters_collection.count_documents(filters)

    cursor = (
        shelters_collection.find(filters)
        .skip(skip)
        .limit(limit)
    )

    results = []

    for shelter in cursor:
        results.append(
            {
                "id": str(shelter["_id"]),
                "name": shelter["name"],
                "address": shelter["address"],
                "pets_allowed": shelter.get("pets_allowed", False),
                "family_friendly": shelter.get("family_friendly", False),
                "food_available": shelter.get("food_available", False),
                "price": shelter.get("price", 0),
            }
        )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "has_next": skip + limit < total,
        "results": results,
    }


def get_nearby_shelters(
    shelters_collection: Collection,
    lat: float,
    lng: float,
    filters: dict,
    limit: int,
    radius_km: int = 10,
):
    limit = min(limit, MAX_LIMIT)
    radius_km = min(radius_km, MAX_RADIUS_KM)

    pipeline = [
        {
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [lng, lat],
                },
                "distanceField": "distance",
                "spherical": True,
                "maxDistance": radius_km * 1000,
                "query": filters,
            }
        },
        {"$sort": {"distance": 1}},
        {"$limit": limit},
    ]

    docs = shelters_collection.aggregate(pipeline)

    results = []

    for shelter in docs:
        results.append(
            {
                "id": str(shelter["_id"]),
                "name": shelter["name"],
                "address": shelter["address"],
                "distance_km": meters_to_km(shelter["distance"]),
                "pets_allowed": shelter.get("pets_allowed", False),
                "family_friendly": shelter.get("family_friendly", False),
                "food_available": shelter.get("food_available", False),
                "price": shelter.get("price", 0),
            }
        )

    return results


def get_offline_snapshot(
    shelters_collection,
    filters: dict,
    limit: int = 50,
    lat=None,
    lng=None,
):
    limit = min(limit, 100)

    results = []

    if lat is not None and lng is not None:
        pipeline = [
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [lng, lat],
                    },
                    "distanceField": "distance",
                    "spherical": True,
                    "query": filters,
                }
            },
            {"$limit": limit},
        ]

        docs = shelters_collection.aggregate(pipeline)

        for shelter in docs:
            results.append(
                {
                    "id": str(shelter["_id"]),
                    "name": shelter["name"],
                    "address": shelter["address"],
                    "distance_km": meters_to_km(shelter["distance"]),
                    "pets_allowed": shelter.get("pets_allowed", False),
                    "family_friendly": shelter.get("family_friendly", False),
                    "food_available": shelter.get("food_available", False),
                    "price": shelter.get("price", 0),
                }
            )

    else:
        cursor = shelters_collection.find(filters).limit(limit)

        for shelter in cursor:
            results.append(
                {
                    "id": str(shelter["_id"]),
                    "name": shelter["name"],
                    "address": shelter["address"],
                    "pets_allowed": shelter.get("pets_allowed", False),
                    "family_friendly": shelter.get("family_friendly", False),
                    "food_available": shelter.get("food_available", False),
                    "price": shelter.get("price", 0),
                }
            )

    return {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "count": len(results),
        "results": results,
    }
