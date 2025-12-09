from flask import Blueprint, request, jsonify
from ..extensions import db, bcrypt
from ..models.user import User
from ..utils.validators import validate_email # Importation du validateur
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

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
        role = "client" 
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id), fresh=True)
    refresh_token = create_refresh_token(identity=str(new_user.id))
    return jsonify({"message": "Utilisateur enregistré avec succès", "user": new_user.to_dict(), "access_token": access_token, "refresh_token": refresh_token}), 201

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

    access_token = create_access_token(identity=str(user.id), fresh=True)
    refresh_token = create_refresh_token(identity=str(user.id))
    return jsonify({"message": "Connexion réussie", "user": user.to_dict(), "access_token": access_token, "refresh_token": refresh_token}), 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    return jsonify(user.to_dict()), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """ Rafraîchit un jeton d'accès expiré. """
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id, fresh=False)
    return jsonify(access_token=new_access_token), 200

# Route de débogage temporaire (à supprimer en production)
@auth_bp.route("/debug/test", methods=["GET"])
def debug_test():
    """Route temporaire pour tester l'API"""
    return jsonify({"status": "ok", "message": "API is working"}), 200

@auth_bp.route("/debug/users", methods=["GET"])
def debug_users():
    """Route temporaire pour voir les utilisateurs"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500