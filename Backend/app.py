# Flask entry point

from flask import Flask
from pymongo import MongoClient

# Import blueprints
from routes.public_routes import public_bp
from routes.emergency_routes import emergency_bp


def create_app():
    app = Flask(__name__)

    # -----------------------
    # MongoDB Connection
    # -----------------------
    # Change URI if needed
    MONGO_URI = "mongodb://localhost:27017"
    client = MongoClient(MONGO_URI)

    db = client["shelter_connect"]

    app.config["MONGO_DB"] = db

    # -----------------------
    # Register Routes
    # -----------------------
    app.register_blueprint(public_bp)
    app.register_blueprint(emergency_bp)

    # -----------------------
    # Health Check (Optional)
    # -----------------------
    @app.route("/health")
    def health():
        return {"status": "ok", "service": "shelter-connect"}

    return app


# -----------------------
# Run Server
# -----------------------

if __name__ == "__main__":
    app = create_app()

    # Print all routes on startup
    print("\n=== REGISTERED ROUTES ===")
    for rule in app.url_map.iter_rules():
        print(rule)

    print("========================\n")

    app.run(debug=True, port=5000)
