from db.mongo import shelters_collection

def create_indexes():
    shelters_collection.create_index([("location","2dsphere")])
    print("✅ Geo index created on shelters.location")

if __name__ =="__main__":
    create_indexes()

