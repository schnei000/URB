from flask import Flask
from .config import Config
from .extensions import db, migrate, bcrypt, jwt, cors
from .routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

 # Initialisation de nos expensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

 # Enregistrement des blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/")
    def home():
        return "Welcome to the Flask API"
    
    return app