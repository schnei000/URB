import json
from app.models.user import User
from app.extensions import db

def test_register_user(client, init_database):
    """
    Teste l'inscription réussie d'un nouvel utilisateur.
    """
    response = client.post('/auth/register', data=json.dumps({
        "name": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }), content_type='application/json')

    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['message'] == "Utilisateur enregistré avec succès"
    assert "access_token" in json_data

    # Vérifie que l'utilisateur a bien été ajouté à la base de données
    user = User.query.filter_by(email="test@example.com").first()
    assert user is not None
    assert user.name == "testuser"

def test_register_existing_user(client, init_database):
    """
    Teste la tentative d'inscription avec un email déjà utilisé.
    """
    # Crée un utilisateur initial
    client.post('/auth/register', data=json.dumps({
        "name": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }), content_type='application/json')

    # Tente de s'inscrire à nouveau avec le même email
    response = client.post('/auth/register', data=json.dumps({
        "name": "anotheruser",
        "email": "test@example.com",
        "password": "password456"
    }), content_type='application/json')

    assert response.status_code == 409
    assert response.get_json()['message'] == "Email dejà utilisé"

def test_login_user(client, init_database):
    """
    Teste la connexion réussie d'un utilisateur.
    """
    # Crée un utilisateur directement dans la base de données pour ce test.
    # C'est une meilleure pratique que d'appeler une autre fonction de test.
    user = User(name="testuser", email="test@example.com")
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()

    response = client.post('/auth/login', data=json.dumps({
        "email": "test@example.com",
        "password": "password123"
    }), content_type='application/json')

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['message'] == "Connexion réussie"
    assert "access_token" in json_data
