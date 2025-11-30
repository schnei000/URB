def handle_error(error):
    response = {
        "error": str(error),
        "message": "Une erreur est survenue lors du traitement de la requête."
    }
    return response, 500