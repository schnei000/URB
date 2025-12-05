import { useState, useEffect } from 'react';
import { createProject, updateProject } from '../../api/projectApi';

function ProjectForm({ project, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);
            setStatus(project.status);
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("le titre est requis");
            return;
        }
        const data = new FormData();
        data.append("title", title);
        data.append("description", description);
        data.append("status", status);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            if (project) {
                await updateProject(project.id, data);
            } else {
                await createProject(data);
            }
            onCancel();
        } catch (error) {
            alert(error.message || "Erreur lors de la sauvegarde du projet.");
        }
    }
    return (
        <div>
            <h2>{project ? "Modifier le projet" : "Créer un nouveau projet"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Titre */}
                <div>
                    <label>Titre:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>

                {/* Description */}
                <div>
                    <label>Description:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>

                {/* Statut */}
                <div>
                    <label>Statut:</label>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="draft">Brouillon</option>
                    </select>
                </div>
                
                {/* Image */}
                <div>
                    <label>Image:</label>
                    <input 
                        type="file" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                    />
                </div>

                {/* Bouton de soumission */}
                <div>
                    <button type="submit">{project ? "Modifier" : "Créer"}</button>
                    <button type="button" onClick={onCancel}>Annuler</button>
                </div>
            </form>
        </div>
    )
}

export default ProjectForm;