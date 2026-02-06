<<<<<<< HEAD
from pymongo.collection import Collection
from utils.geo_helpers import meters_to_km


def build_emergency_filter(query: dict):
    filters = {}

    if query.get("pets"):
        filters["pets_allowed"] = True

    if query.get("family"):
        filters["family_friendly"] = True

    if query.get("food"):
        filters["food_available"] = True

    if query.get("max_price") is not None:
        filters["price"] = {"$lte": query["max_price"]}

    return filters


def get_nearest_shelters(
    shelters_collection: Collection,
    lat: float,
    lng: float,
    filters: dict,
    limit: int = 3,
):
    limit = min(limit, 3)

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
=======
from db.mongo import shelters_collection

def get_emergency_shelters(lat, lng, max_distance=3000):
    return list(shelters_collection.find({
        "location": {
            "$near": {
                "$geometry": {
                "type":"Point",
                "coordinates": [lng, lat]
                },
            "$maxDistance": max_distance
            }
        },
        "status":"ACTIVE",
        "emergencyEnabled":True,
        "availableBeds": {"$gt":0}
    }))

>>>>>>> 5a3e7a02fa09fd134c03ecdc3471e7bcef7d7324
