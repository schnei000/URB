from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

upload_bp = Blueprint("upload_bp", __name__, url_prefix="/upload")
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Fonction pour vérifier les extensions de fichiers autorisées
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route pour gérer le téléchargement de fichiers
@upload_bp.route("/", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "Aucun fichier fourni"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "Aucun fichier sélectionné"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"message": "Type de fichier non autorisé"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file.save(filepath)
    
    return jsonify({"message": "Fichier téléchargé avec succès", "filename": filename}), 201