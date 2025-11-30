from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.user import User
from ..models.provider import Provider

provider_bp = Blueprint("provider_bp", __name__, url_prefix="/provider")

# Devenir un prestataire
@provider_bp.route("/register", methods=["POST"])
@jwt_required()
def become_provider():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    # Vérifier si l'utilisateur est déjà un prestataire
    existing_provider = Provider.query.filter_by(user_id=user.id).first()
    if existing_provider:
        return jsonify({"message": "Cet utilisateur est déjà un prestataire"}), 409

    data = request.get_json()
    service_type = data.get("service_type")

    if not service_type:
        return jsonify({"message": "Le champ 'service_type' est requis"}), 400

    # Créer le nouveau prestataire
    new_provider = Provider(
        user_id=user.id,
        service_type=service_type,
        bio=data.get("bio"),
        experience=data.get("experience")

    )
    db.session.add(new_provider)

    # Mettre à jour le rôle de l'utilisateur
    user.role = "provider"
    db.session.commit()

    return jsonify({"message": "Vous êtes maintenant enregistré comme prestataire !", "provider": new_provider.to_dict()}), 201


# Mettre à jour le profil du prestataire
@provider_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_provider_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "provider":
        return jsonify({"message": "Accès non autorisé. Seuls les prestataires peuvent modifier leur profil."}), 403

    provider = Provider.query.filter_by(user_id=user.id).first()
    if not provider:
        return jsonify({"message": "Profil prestataire non trouvé"}), 404

    data = request.get_json()
    service_type = data.get("service_type")

    if not service_type:
        return jsonify({"message": "Le champ 'service_type' est requis pour la mise à jour"}), 400

    provider.service_type = service_type
    db.session.commit()

    return jsonify({"message": "Profil mis à jour avec succès", "provider": provider.to_dict()}), 200

# recuperer le profil du prestataire
@provider_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_provider_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "provider":
        return jsonify({"message": "Accès non autorisé. Seuls les prestataires peuvent accéder à leur profil."}), 403

    provider = Provider.query.filter_by(user_id=user.id).first()
    if not provider:
        return jsonify({"message": "Profil prestataire non trouvé"}), 404

    return jsonify({"provider": provider.to_dict()}), 200

# recuperer tous les prestataires
@provider_bp.route("/all", methods=["GET"])
def get_all_providers():
    providers = Provider.query.all()
    return jsonify([provider.to_dict() for provider in providers]), 200
