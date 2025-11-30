from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.user import User
from ..models.service_type import ServiceType
from .admin_routes import admin_required # Réutilisation du décorateur admin

service_type_bp = Blueprint("service_type_bp", __name__, url_prefix="/service-types")

# Obtenir tous les types de service
@service_type_bp.route("/", methods=["GET"])
def get_all_service_types():
    """Retourne une liste de tous les types de services disponibles."""
    service_types = ServiceType.query.order_by(ServiceType.name).all()
    return jsonify([st.to_dict() for st in service_types]), 200

# Créer un nouveau type de service (action pour administrateur)
@service_type_bp.route("/", methods=["POST"])
@admin_required
def create_service_type():
    """Crée un nouveau type de service. Devrait être limité aux administrateurs."""
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"message": "Le champ 'name' est requis"}), 400

    if ServiceType.query.filter_by(name=name).first():
        return jsonify({"message": f"Le type de service '{name}' existe déjà"}), 409

    new_service_type = ServiceType(name=name, description=description)
    db.session.add(new_service_type)
    db.session.commit()

    return jsonify(new_service_type.to_dict()), 201

# recupérer un type de service par son ID
@service_type_bp.route("/<int:service_type_id>", methods=["GET"])
def get_service_type(service_type_id):
    """Retourne les détails d'un type de service spécifique par son ID."""
    service_type = ServiceType.query.get_or_404(service_type_id)
    return jsonify(service_type.to_dict()), 200

# Mettre à jour un type de service (action pour administrateur)
@service_type_bp.route("/<int:service_type_id>", methods=["PUT"])
@admin_required
def update_service_type(service_type_id):
    """Met à jour un type de service existant. Devrait être limité aux administrateurs."""
    service_type = ServiceType.query.get_or_404(service_type_id)
    data = request.get_json()
    name = data.get("name")
    if name and ServiceType.query.filter(ServiceType.name == name, ServiceType.id != service_type_id).first():
        return jsonify({"message": f"Le type de service '{name}' existe déjà"}), 409
    
    service_type.name = name or service_type.name
    service_type.description = data.get("description", service_type.description)
    db.session.commit()
    return jsonify(service_type.to_dict()), 200

# Supprimer un type de service (action pour administrateur)
@service_type_bp.route("/<int:service_type_id>", methods=["DELETE"])
@admin_required
def delete_service_type(service_type_id):
    """Supprime un type de service spécifique. Devrait être limité aux administrateurs."""
    service_type = ServiceType.query.get_or_404(service_type_id)
    db.session.delete(service_type)
    db.session.commit()
    
    return jsonify({"message": "Type de service supprimé avec succès"}), 200