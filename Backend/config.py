import os

# -----------------------
# Environment Config
# -----------------------

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017"
)

DB_NAME = os.getenv(
    "DB_NAME",
    "shelter_connect"
)

FLASK_ENV = os.getenv("FLASK_ENV", "development")
DEBUG = FLASK_ENV == "development"
