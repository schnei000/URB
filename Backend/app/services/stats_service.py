from ..models.user import User
# Supposons que vous ayez un modèle Project
# from ..models.project import Project 
from ..extensions import db

def get_user_stats():
    """
    Récupère les statistiques sur les utilisateurs.
    """
    try:
        count = User.query.count()
        return {"total_users": count}
    except Exception as e:
        # Gérer les erreurs de base de données, par exemple
        print(f"Erreur lors de la récupération des statistiques utilisateurs: {e}")
        return {"total_users": 0}

def get_dashboard_stats():
    """
    Récupère un ensemble de statistiques pour un tableau de bord.
    """
    user_stats = get_user_stats()
    return {**user_stats}
