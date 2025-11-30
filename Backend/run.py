import os
from app import create_app # Assurez-vous que create_app est dans app/__init__.py
from app.config import Config

app = create_app(Config)

if __name__ == "__main__":
    # Le port et l'hôte peuvent aussi être configurés via des variables d'environnement
    app.run(port=5000, host="0.0.0.0", debug=True)