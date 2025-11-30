from flask import Blueprint, jsonify

def test_error_handler(client, test_app):
    """
    Teste si le gestionnaire d'erreur global (500) fonctionne correctement.
    """
    # Crée une route de test qui déclenche une erreur intentionnellement
    error_bp = Blueprint("error_bp", __name__)
    @error_bp.route("/trigger-error")
    def trigger_error():
        # Ceci va lever une ZeroDivisionError
        result = 1 / 0
        return jsonify({"result": result})

    test_app.register_blueprint(error_bp)

    # Appelle la route qui cause une erreur
    response = client.get("/trigger-error")
    
    assert response.status_code == 500
    json_data = response.get_json()
    assert "error" in json_data
    assert json_data['message'] == "Une erreur est survenue lors du traitement de la requête."
