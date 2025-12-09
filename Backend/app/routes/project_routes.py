from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

project_bp = Blueprint("project_bp", __name__, url_prefix="/projects")

@project_bp.route("", methods=["GET"])
@jwt_required()
def get_projects():
    """Récupérer tous les projets de l'utilisateur connecté"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"message": "Utilisateur non trouvé"}), 404
        
        # Pour l'instant, retourner une liste vide ou des projets simulés
        # puisque nous n'avons pas encore de modèle Project
        projects = [
            {
                "id": 1,
                "name": "Projet Test 1",
                "description": "Description du projet test 1",
                "budget": 1000,
                "status": "draft",
                "created_at": "2025-12-05T00:00:00"
            },
            {
                "id": 2,
                "name": "Projet Test 2",
                "description": "Description du projet test 2",
                "budget": 2000,
                "status": "active",
                "created_at": "2025-12-04T00:00:00"
            }
        ]
        
        return jsonify(projects), 200
    except Exception as e:
        return jsonify({"message": "Erreur lors du chargement des projets", "error": str(e)}), 500

@project_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    """Récupérer un projet spécifique"""
    project = {
        "id": project_id,
        "name": f"Projet {project_id}",
        "description": f"Description du projet {project_id}",
        "budget": 1500,
        "status": "active",
        "category": "Web Development",
        "client_name": "Client Test",
        "created_at": "2025-12-05T00:00:00",
        "deadline": "2025-12-31T00:00:00"
    }
    
    return jsonify(project), 200

@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    """Créer un nouveau projet"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("name"):
        return jsonify({"message": "Le nom du projet est requis"}), 400
    
    return jsonify({
        "message": "Projet créé avec succès",
        "project": {
            "id": 3,
            "name": data.get("name"),
            "description": data.get("description", ""),
            "budget": data.get("budget", 0),
            "status": "draft"
        }
    }), 201

@project_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    """Mettre à jour un projet"""
    data = request.get_json()
    
    return jsonify({
        "message": "Projet mis à jour avec succès",
        "project": {
            "id": project_id,
            "name": data.get("name"),
            "description": data.get("description", ""),
            "budget": data.get("budget", 0),
            "status": data.get("status", "draft")
        }
    }), 200

@project_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    """Supprimer un projet"""
    return jsonify({"message": f"Projet {project_id} supprimé avec succès"}), 200
