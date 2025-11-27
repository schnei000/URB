from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.user import User
from ..models.service_type import ServiceType

service_type_bp = Blueprint("service_type_bp", __name__, url_prefix="/service-types")

# Obtenir tous les types de service
@service_type_bp.route("/", methods=["GET"])
def get_all_service_types():
    """Retourne une liste de tous les types de services disponibles."""
    service_types = ServiceType.query.order_by(ServiceType.name).all()
    return jsonify([st.to_dict() for st in service_types]), 200

# Créer un nouveau type de service (action pour administrateur)
@service_type_bp.route("/", methods=["POST"])
@jwt_required()
def create_service_type():
    """Crée un nouveau type de service. Devrait être limité aux administrateurs."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Note : Le rôle 'admin' n'existe pas encore. C'est une suggestion pour sécuriser cette route.
    # Vous pourriez le créer ou utiliser un autre mécanisme d'autorisation.
    if not user or user.role != "admin":
        return jsonify({"message": "Accès non autorisé. Seuls les administrateurs peuvent ajouter des types de service."}), 403

    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"message": "Le champ 'name' est requis"}), 400

    if ServiceType.query.filter_by(name=name).first():
        return jsonify({"message": f"Le type de service '{name}' existe déjà"}), 409

    new_service_type = ServiceType(
        name=name,
        description=description
    )
    db.session.add(new_service_type)
    db.session.commit()

    return jsonify({"message": "Type de service créé avec succès", "service_type": new_service_type.to_dict()}), 201

# recupérer un type de service par son ID
@service_type_bp.route("/<int:service_type_id>", methods=["GET"])
def get_service_type(service_type_id):
    """Retourne les détails d'un type de service spécifique par son ID."""
    service_type = ServiceType.query.get(service_type_id)
    if not service_type:
        return jsonify({"message": "Type de service non trouvé"}), 404

    return jsonify(service_type.to_dict()), 200

# Mettre à jour un type de service (action pour administrateur)
@service_type_bp.route("/<int:service_type_id>", methods=["PUT"])
@jwt_required()
def update_service_type(service_type_id):
    """Met à jour un type de service existant. Devrait être limité aux administrateurs."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "admin":
        return jsonify({"message": "Accès non autorisé. Seuls les administrateurs peuvent modifier les types de service."}), 403

    service_type = ServiceType.query.get(service_type_id)
    if not service_type:
        return jsonify({"message": "Type de service non trouvé"}), 404

    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if name:
        service_type.name = name
    if description:
        service_type.description = description

    db.session.commit()

    return jsonify({"message": "Type de service mis à jour avec succès", "service_type": service_type.to_dict()}), 200

# Supprimer un type de service (action pour administrateur)
@service_type_bp.route("/<int:service_type_id>", methods=["DELETE"])
@jwt_required()
def delete_service_type(service_type_id):
    """Supprime un type de service spécifique. Devrait être limité aux administrateurs."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != "admin":
        return jsonify({"message": "Accès non autorisé. Seuls les administrateurs peuvent supprimer les types de service."}), 403

    service_type = ServiceType.query.get(service_type_id)
    if not service_type:
        return jsonify({"message": "Type de service non trouvé"}), 404

    db.session.delete(service_type)
    db.session.commit()

    return jsonify({"message": "Type de service supprimé avec succès"}), 200