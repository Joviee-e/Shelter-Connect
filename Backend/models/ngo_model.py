from datetime import datetime

def build_ngo(data):
    return {
    "name": data["name"],
    "email": data["email"],
    "phone": data["phone"],
    "verified":False,
    "createdAt": datetime.utcnow()
    }

