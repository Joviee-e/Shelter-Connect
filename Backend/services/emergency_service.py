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

