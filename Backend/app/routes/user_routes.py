from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.user import User
from ..utils.validators import validate_email

user_bp = Blueprint("user_bp", __name__, url_prefix="/user")


@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_user_profile():
    """Met à jour le profil de l'utilisateur actuellement connecté."""
    user_id = get_jwt_identity()
    user_to_update = User.query.get(user_id)

    if not user_to_update:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    data = request.get_json()
    
    # Mettre à jour les champs fournis, en excluant le rôle et l'email pour la sécurité
    if 'name' in data:
        user_to_update.name = data['name']

    # Vous pouvez ajouter d'autres champs modifiables ici

    db.session.commit()

    return jsonify({"message": "Profil mis à jour avec succès", "user": user_to_update.to_dict()}), 200
