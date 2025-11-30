from flask_socketio import emit, join_room
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request

from ..extensions import socketio
from ..models.user import User


def init_socketio(app):
    """
    Initialise SocketIO avec l'application Flask.
    """
    socketio.init_app(app)
    
@socketio.on('connect')
def handle_connect():
    """
    Gère la connexion d'un client.
    L'authentification est vérifiée et l'utilisateur rejoint une "room" personnelle.
    """
    try:
        # Vérifie le token JWT pour authentifier la connexion socket
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return False  # Refuse la connexion si l'utilisateur n'est pas valide

        
        join_room(user_id)
        print(f"Client connected and joined room: {user_id}")
        emit('status', {'message': f'Welcome {user.name}! You are connected.'})
    except Exception as e:
        print(f"Socket connection failed: {e}")
        return False

def send_notification_to_user(user_id, event_name, data):
    """
    Fonction utilitaire pour envoyer une notification à un utilisateur spécifique.
    """
    socketio.emit(event_name, data, room=user_id)
    print(f"Sent notification '{event_name}' to user {user_id} with data: {data}")
