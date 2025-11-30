import json
import pytest

# Marquer tous les tests de ce fichier pour qu'ils soient sautés
# car la fonctionnalité n'est pas encore implémentée.
# Retirez la ligne ci-dessous lorsque les routes de projet seront prêtes.
pytestmark = pytest.mark.skip(reason="Les routes pour les projets ne sont pas encore implémentées")

def test_create_project(client, auth_token):
    """
    Teste la création d'un nouveau projet (nécessite une authentification).
    """
    response = client.post('/projects', data=json.dumps({
        "name": "Nouveau Projet Test",
        "description": "Description de mon projet."
    }), content_type='application/json', headers={
        "Authorization": f"Bearer {auth_token}"
    })

    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['message'] == "Projet créé avec succès"

def test_get_projects(client):
    """
    Teste la récupération de la liste des projets.
    """
    # Supposons que cette route est publique
    response = client.get('/projects')
    assert response.status_code == 200
    json_data = response.get_json()
    assert isinstance(json_data, list)
