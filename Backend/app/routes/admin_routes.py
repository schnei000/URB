from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.user import User, Category, Product
from ..models.provider import Provider
from ..models.request import Request

admin_bp = Blueprint("admin_bp", __name__, url_prefix="/admin")

# Fonction décorateur pour vérifier le rôle d'administrateur
def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"message": "Accès réservé aux administrateurs."}), 403
        return fn(*args, **kwargs)

    wrapper.__name__ = fn.__name__
    return wrapper

# --- Gestion des Utilisateurs ---

# Obtenir la liste de tous les utilisateurs
@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    """Retourne une liste de tous les utilisateurs. (Admin seulement)"""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# Changer le rôle d'un utilisateur
@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@admin_required
def change_user_role(user_id):
    """Modifie le rôle d'un utilisateur spécifique. (Admin seulement)"""
    user_to_modify = User.query.get(user_id)
    if not user_to_modify:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    data = request.get_json()
    new_role = data.get("role")

    if not new_role:
        return jsonify({"message": "Le champ 'role' est requis"}), 400

    allowed_roles = ["client", "provider", "admin"]
    if new_role not in allowed_roles:
        return jsonify({"message": f"Rôle invalide. Les rôles autorisés sont : {', '.join(allowed_roles)}"}), 400

    user_to_modify.role = new_role
    db.session.commit()
    return jsonify(user_to_modify.to_dict()), 200

# Supprimer un utilisateur
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    """Supprime un utilisateur spécifique. (Admin seulement)"""
    current_user_id = get_jwt_identity()
    if user_id == current_user_id:
        return jsonify({"message": "Un administrateur ne peut pas se supprimer lui-même."}), 403

    user_to_delete = User.query.get(user_id)
    if not user_to_delete:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    db.session.delete(user_to_delete)
    db.session.commit()

    return jsonify({"message": f"L'utilisateur '{user_to_delete.name}' a été supprimé avec succès."}), 200

# --- Statistiques Générales ---

@admin_bp.route("/stats", methods=["GET"])
@admin_required
def get_stats():
    """Retourne des statistiques générales sur l'application. (Admin seulement)"""
    stats = {
        "total_users": User.query.count(),
        "total_providers": Provider.query.count(),
        "total_requests": Request.query.count(),
        "total_categories": Category.query.count(),
        "total_products": Product.query.count()
    }
    return jsonify(stats), 200

# --- CRUD pour les Catégories ---

@admin_bp.route("/categories", methods=["POST"])
@admin_required
def create_category():
    """Crée une nouvelle catégorie. (Admin seulement)"""
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"message": "Le champ 'name' est requis"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"message": f"La catégorie '{name}' existe déjà"}), 409

    new_category = Category(name=name, description=data.get("description"))
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.to_dict()), 201

# recuperer tout les categories
@admin_bp.route("/categories", methods=["GET"])
@admin_required
def get_all_categories():
    """Retourne toutes les catégories. (Admin seulement)"""
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories]), 200

@admin_bp.route("/categories/<int:category_id>", methods=["PUT"])
@admin_required
def update_category(category_id):
    """Met à jour une catégorie. (Admin seulement)"""
    category = Category.query.get_or_404(category_id)
    data = request.get_json()

    name = data.get("name")
    if name and Category.query.filter(Category.name == name, Category.id != category_id).first():
        return jsonify({"message": f"La catégorie '{name}' existe déjà"}), 409

    category.name = name or category.name
    category.description = data.get("description", category.description)
    db.session.commit()
    return jsonify(category.to_dict()), 200

@admin_bp.route("/categories/<int:category_id>", methods=["DELETE"])
@admin_required
def delete_category(category_id):
    """Supprime une catégorie. (Admin seulement)"""
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Catégorie supprimée avec succès"}), 200

# --- CRUD pour les Produits ---

@admin_bp.route("/products", methods=["POST"])
@admin_required
def create_product():
    """Crée un nouveau produit. (Admin seulement)"""
    data = request.get_json()
    required_fields = ["name", "price", "category_id"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": f"Les champs requis sont : {', '.join(required_fields)}"}), 400

    if not Category.query.get(data["category_id"]):
        return jsonify({"message": "L'ID de la catégorie est invalide"}), 400

    new_product = Product(
        name=data["name"],
        price=data["price"],
        category_id=data["category_id"],
        description=data.get("description")
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@admin_bp.route("/products", methods=["GET"])
@admin_required
def get_all_products():
    """Retourne tous les produits. (Admin seulement)"""
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200

@admin_bp.route("/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):
    """Met à jour un produit. (Admin seulement)"""
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    if "category_id" in data and not Category.query.get(data["category_id"]):
        return jsonify({"message": "L'ID de la catégorie est invalide"}), 400

    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)
    product.description = data.get("description", product.description)
    product.category_id = data.get("category_id", product.category_id)
    db.session.commit()
    return jsonify(product.to_dict()), 200

@admin_bp.route("/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    """Supprime un produit. (Admin seulement)"""
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Produit supprimé avec succès"}), 200
