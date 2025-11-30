from flask import Flask
from flasgger import Swagger
from .extensions import db, bcrypt
from .models import User, Category, Product, Provider, Request, Review, ServiceType, Admin
from .routes.auth_routes import auth_bp
from .routes.admin_routes import admin_bp
from .routes.provider_routes import provider_bp
from .routes.request_routes import request_bp
from .routes.service_type_routes import service_type_bp
from .routes.upload_routes import upload_bp
from .routes.user_routes import user_bp
from .utils.error_handlers import handle_error
from flask_jwt_extended import JWTManager
import os
from .config import Config # Importer la configuration

def create_app(config_class=Config, testing=False):
    """
    Factory pour créer et configurer l'application Flask.
    """
    app = Flask(__name__)

    # --- Configuration depuis l'objet Config ---
    if testing:
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
        app.config['JWT_SECRET_KEY'] = "test-secret-key"
    else:
        app.config.from_object(config_class)

    # --- Initialisation des extensions ---
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    # --- Configuration de Flasgger (Swagger UI) ---
    # C'est la partie cruciale pour que /apidocs fonctionne.
    app.config['SWAGGER'] = {
        'title': 'API du Portfolio',
        'uiversion': 3,
        'openapi': '3.0.0',
        'doc_dir': './apidocs/' # Optionnel, mais recommandé
    }
    # Le chemin vers votre fichier swagger.yaml est essentiel.
    # Depuis app/__init__.py, le chemin correct est '../swagger.yaml'
    swagger = Swagger(app, template_file='../swagger.yaml')

    # --- Enregistrement des Blueprints (routes) ---
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(provider_bp)
    app.register_blueprint(request_bp)
    app.register_blueprint(service_type_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(user_bp)

    # --- Enregistrement du gestionnaire d'erreur ---
    app.register_error_handler(Exception, handle_error)



    # --- Création de la base de données (si elle n'existe pas) ---
    with app.app_context():
        db.create_all()

    return app