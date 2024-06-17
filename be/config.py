from os import environ, path

from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))

class Config:
    SECRET_KEY = environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = environ.get("SQLALCHEMY_TRACK_MODIFICATIONS")

    COMPRESSOR_DEBUG = environ.get("COMPRESSOR_DEBUG")
    FRONTEND_URL = environ.get("FRONTEND_URL")
    SESSION_COOKIE_SECURE = environ.get("SESSION_COOKIE_SECURE")
    SESSION_COOKIE_SAMESITE = environ.get("SESSION_COOKIE_SAMESITE")