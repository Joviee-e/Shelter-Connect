import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """
    Central configuration file for Shelter Connect backend.
    Handles Flask, MongoDB, JWT, and environment settings.
    """

    # --------------------------------------------------
    # Flask Core Config
    # --------------------------------------------------
    SECRET_KEY = os.getenv("SECRET_KEY")

    # --------------------------------------------------
    # MongoDB Configuration
    # --------------------------------------------------
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")

    # --------------------------------------------------
    # JWT Configuration
    # --------------------------------------------------
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_ALGORITHM = "HS256"

    # --------------------------------------------------
    # Security Settings
    # --------------------------------------------------
    PASSWORD_HASH_SALT = os.getenv("PASSWORD_HASH_SALT")

    # --------------------------------------------------
    # Environment
    # --------------------------------------------------
    ENV = os.getenv("ENV", "development")
    DEBUG = ENV == "development"
