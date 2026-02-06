from datetime import datetime

def build_shelter(data):
    return {
        "ngoId": data["ngoId"],
        "name": data["name"],
        "address": data["address"],
        "city": data["city"],
        "phone": data["phone"],

    "location": {
        "type":"Point",
        "coordinates": [data["lng"], data["lat"]]
    },

    "pricePerNight": data.get("pricePerNight",0),

    "capacity": data["capacity"],
    "availableBeds": data["availableBeds"],

    "emergencyEnabled": data.get("emergencyEnabled",True),

    "features": {
        "petFriendly": data.get("petFriendly",False),
        "accessibility": data.get("accessibility",False),
        "languages": data.get("languages", [])
    },

    "status":"ACTIVE",

    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
    }

