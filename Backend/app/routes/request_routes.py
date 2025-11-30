from flask import Blueprint,request,jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from ..extensions import db
from ..models.user import User
from ..models.provider import Provider
from ..models.request import Request
from ..sockets.notification import send_notification_to_user # Importation de la fonction de notification

request_bp = Blueprint("request_bp", __name__, url_prefix="/request")

# Creation nouveau service Client
@request_bp.route("/create", methods=["POST"])
@jwt_required()
def create_request():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    if user.role != "client":
        return jsonify({"message": "Seuls les clients peuvent créer des demandes de service"}), 403
    
    required_fields = ["service_type", "description", "preferred_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Le champ {field} est requis"}), 400
        
    new_request = Request(
        client_id=user.id,
        service_type=data["service_type"],
        description=data["description"],    
        preferred_date=data["preferred_date"],
        status="pending"
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Demande de service créée avec succès"}), 201


# recuperer toutes les demandes de service d'un client
@request_bp.route("/client/requests", methods=["GET"])
@jwt_required()
def get_client_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404
    
    if user.role != "client":
        return jsonify({"message": "Seuls les clients peuvent accéder à leurs demandes de service"}), 403
    
    requests = Request.query.filter_by(client_id=user.id).all()

    return jsonify([req.to_dict() for req in requests]), 200


# recuperer toutes les demandes de service d'un prestataire
@request_bp.route("/provider/requests", methods=["GET"])
@jwt_required()
def get_provider_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404
    
    if user.role != "provider":
        return jsonify({"message": "Seuls les prestataires peuvent accéder aux demandes de service"}), 403
    
    provider = Provider.query.filter_by(user_id=user.id).first()
    if not provider:
        return jsonify({"message": "Prestataire non trouvé"}), 404

    requests = Request.query.filter_by(service_type=provider.service_type, status="pending").all()

    return jsonify([req.to_dict() for req in requests]), 200

# Accepter une demande de service par un prestataire
@request_bp.route("/provider/accept/<int:request_id>", methods=["POST"])
@jwt_required()
def accept_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404
    
    if user.role != "provider":
        return jsonify({"message": "Seuls les prestataires peuvent accepter les demandes de service"}), 403
    
    provider = Provider.query.filter_by(user_id=user.id).first()
    if not provider:
        return jsonify({"message": "Prestataire non trouvé"}), 404

    service_request = Request.query.get(request_id)
    if not service_request:
        return jsonify({"message": "Demande de service non trouvée"}), 404

    if service_request.service_type != provider.service_type:
        return jsonify({"message": "Vous ne pouvez pas accepter cette demande de service"}), 403

    if service_request.status != "pending":
        return jsonify({"message": "Cette demande de service a déjà été traitée"}), 400

    service_request.status = "accepted"
    service_request.provider_id = provider.id

    db.session.commit()

    # Envoyer une notification au client via Socket.IO
    send_notification_to_user(
        user_id=service_request.client_id,
        event_name='request_accepted',
        data={'request_id': service_request.id, 'message': f'Votre demande de service a été acceptée par le prestataire {provider.user.name}!'}
    )

    return jsonify({"message": "Demande de service acceptée avec succès"}), 200

# Refuser une demande de service par un prestataire
@request_bp.route("/provider/reject/<int:request_id>", methods=["POST"])
@jwt_required()
def reject_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404
    
    if user.role != "provider":
        return jsonify({"message": "Seuls les prestataires peuvent refuser les demandes de service"}), 403
    
    provider = Provider.query.filter_by(user_id=user.id).first()
    if not provider:
        return jsonify({"message": "Prestataire non trouvé"}), 404

    service_request = Request.query.get(request_id)
    if not service_request:
        return jsonify({"message": "Demande de service non trouvée"}), 404

    if service_request.service_type != provider.service_type:
        return jsonify({"message": "Vous ne pouvez pas refuser cette demande de service"}), 403

    if service_request.status != "pending":
        return jsonify({"message": "Cette demande de service a déjà été traitée"}), 400

    service_request.status = "rejected"
    db.session.commit()

    return jsonify({"message": "Demande de service refusée avec succès"}), 200

# Mettre à jour le statut d'une demande de service par un client
@request_bp.route("/client/update_status/<int:request_id>", methods=["POST"])
@jwt_required()
def update_request_status(request_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if "status" not in data:
        return jsonify({"message": "Le champ status est requis"}), 400
    
    new_status = data["status"]
    if new_status not in ["in_progress", "completed", "cancelled"]:
        return jsonify({"message": "Le statut doit être 'in_progress', 'completed' ou 'cancelled'"}), 400
    
    service_request = Request.query.get(request_id)
    if not service_request:
        return jsonify({"message": "Demande de service non trouvée"}), 404
    
    # Action du client
    if user.role == "client":
        if service_request.client_id != user.id:
            return jsonify({"message": "Vous n'êtes pas autorisé à mettre à jour cette demande de service"}), 403
        
        if new_status != "cancelled":
            return jsonify({"message": "Les clients ne peuvent annuler que leurs propres demandes"}), 403
        
        service_request.status = new_status
        db.session.commit()
        return jsonify({"message": "Demande de service annulée avec succès"}), 200

    # Action du prestataire
    elif user.role == "provider":
        provider = Provider.query.filter_by(user_id=user.id).first()
        if not provider or service_request.provider_id != provider.id:
            return jsonify({"message": "Vous n'êtes pas autorisé à mettre à jour cette demande de service"}), 403
        
        service_request.status = new_status
        db.session.commit()
        return jsonify({"message": "Statut de la demande de service mis à jour avec succès"}), 200

    return jsonify({"message": "Action non autorisée"}), 403
