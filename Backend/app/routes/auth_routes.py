from flask import Blueprint, request, jsonify
from ..extensions import db, bcrypt
from ..models.user import User
from ..utils.validators import validate_email # Importation du validateur
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "name, email, et password sont requis"}), 400
    
    if not validate_email(email):
        return jsonify({"message": "Format d'email invalide"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "Email dejà utilisé"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(
        name = name,
        email = email,
        password_hash = hashed_password,
        role = "client" # Le rôle doit être "client" (singulier)
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return jsonify({"message": "Utilisateur enregistré avec succès", "user": new_user.name, "access_token": access_token}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "email et password sont requis"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"message" : "Email ou mot de passe invalide"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Connexion réussie", "user": user.name, "access_token": access_token}), 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    # Utiliser filter_by(id=...) est plus explicite que .get()
    # et db.session.get(User, user_id) est la méthode plus moderne.
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    return jsonify(user.to_dict()), 200