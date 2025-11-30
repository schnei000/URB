import io

def test_upload_file_success(client):
    """
    Teste le succès du téléchargement d'un fichier image.
    """
    # Crée un fichier fictif en mémoire
    data = {
        'file': (io.BytesIO(b"fake_image_content"), 'test.jpg')
    }
    response = client.post('/upload/', data=data, content_type='multipart/form-data')

    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['message'] == "Fichier téléchargé avec succès"
    assert json_data['filename'] == "test.jpg"

def test_upload_no_file(client):
    """
    Teste l'envoi de la requête sans la partie 'file'.
    """
    response = client.post('/upload/', content_type='multipart/form-data')
    assert response.status_code == 400
    assert response.get_json()['message'] == "Aucun fichier fourni"

def test_upload_disallowed_file_type(client):
    """
    Teste le téléchargement d'un type de fichier non autorisé.
    """
    data = {
        'file': (io.BytesIO(b"this is a text file"), 'test.txt')
    }
    response = client.post('/upload/', data=data, content_type='multipart/form-data')

    assert response.status_code == 400
    assert response.get_json()['message'] == "Type de fichier non autorisé"
