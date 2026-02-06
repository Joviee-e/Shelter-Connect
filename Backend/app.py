# Flask entry point
from flask import Flask, request
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config

# Import route blueprints
from routes.auth_routes import auth_bp
from routes.ngo_routes import ngo_bp
from routes.shelter_routes import shelter_bp
from routes.public_routes import public_bp


# -------------------------------
# App Factory
# -------------------------------
def create_app():
    """
    Creates and configures the Flask application.
    """

    app = Flask(__name__)

    # 🔥 FIXED CORS CONFIG (important)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    # -------------------------------
    # Load Configuration
    # -------------------------------
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = Config.JWT_ACCESS_TOKEN_EXPIRES

    # -------------------------------
    # MongoDB Initialization
    # -------------------------------
    from pymongo import MongoClient

    try:
        mongo_client = MongoClient(Config.MONGO_URI)
        mongo_client.admin.command('ping')   # test connection
        print("✅ MongoDB Connected Successfully!")

        app.db = mongo_client[Config.DB_NAME]

    except Exception as e:
        print("❌ MongoDB Connection Failed:", e)

    # -------------------------------
    # JWT Initialization
    # -------------------------------
    jwt = JWTManager(app)

    # -------------------------------
    # Register Blueprints (Routes)
    # -------------------------------
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(ngo_bp, url_prefix="/api/ngo")
    app.register_blueprint(shelter_bp, url_prefix="/api/shelters")
    app.register_blueprint(public_bp, url_prefix="/api/public")

    # -------------------------------
    # Health Check Route
    # -------------------------------
    @app.route("/")
    def home():
        return {
            "message": "Shelter Connect Backend Running 🚀"
        }

    # -------------------------------
    # MongoDB Test Route
    # -------------------------------
    @app.route("/db-test")
    def db_test():
        try:
            collections = app.db.list_collection_names()
            return {
                "status": "MongoDB connected",
                "collections": collections
            }
        except Exception as e:
            return {
                "status": "MongoDB NOT connected",
                "error": str(e)
            }

    # -------------------------------
    # Print ALL routes in terminal
    # -------------------------------
    print("\n📌 REGISTERED ROUTES:")
    for rule in app.url_map.iter_rules():
        methods = ",".join(rule.methods)
        print(f"{rule.endpoint:30s} {methods:25s} {str(rule)}")
    print("--------------------------------------------------\n")

    # -------------------------------
    # Live request logger
    # -------------------------------
    @app.before_request
    def log_request():
        print(f"📩 {request.method} {request.path}")

    return app


# -------------------------------
# Run Server
# -------------------------------
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
