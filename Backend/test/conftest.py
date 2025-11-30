import sys
import os
import pytest

# Ajoute le répertoire racine du projet (Backend) au sys.path
# pour permettre les imports relatifs comme 'from app import ...'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.extensions import db
from app.models.user import User

@pytest.fixture(scope='function')
def test_app():
    """Crée une instance de l'application Flask pour les tests."""
    app = create_app(testing=True)
    
    # Configure l'application pour les tests, par exemple avec une base de données en mémoire
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key"
    })

    yield app # Fournit l'application aux tests

@pytest.fixture()
def client(test_app):
    """Crée un client de test pour envoyer des requêtes aux routes."""
    return test_app.test_client()

@pytest.fixture()
def runner(test_app):
    """Crée un runner de commandes CLI pour les tests."""
    return test_app.test_cli_runner()

@pytest.fixture()
def init_database(test_app):
    """Initialise la base de données avant chaque test et la nettoie après."""
    with test_app.app_context():
        db.create_all()
        yield db
        db.session.remove()
        db.drop_all()
