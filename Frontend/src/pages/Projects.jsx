import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getProjects } from "../api/projectApi";

const ProjectCard = ({ project }) => (
    <div className="card card-hover">
        <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-2">{project.name}</h3>
            <span className={`badge ${
                project.status === 'draft' 
                    ? 'badge-warning' 
                    : 'badge-success'
            }`}>
                {project.status === 'draft' ? 'Brouillon' : 'Actif'}
            </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light">{project.description || 'Pas de description'}</p>
        
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <span className="text-sm text-gray-600">Budget: <span className="font-semibold text-primary-color">{project.budget}€</span></span>
            <span className="text-xs text-gray-500">{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
        </div>

        <Link to={`/projects/${project.id}`} className="btn btn-primary text-center block w-full">
            Voir détails
        </Link>
    </div>
);

function Projects() {
    const { token } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(res);
            } catch (err) {
                setError(err.message || "Erreur lors du chargement des projets.");
            } finally {
                setLoading(false);
            }
        };
        
        if (token) {
            fetchProjects();
        }
    }, [token]);

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="page-wrapper flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner text-primary-color"></div>
                    <p className="mt-4 text-gray-600 text-lg">Chargement des projets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-danger-color text-lg">{error}</p>
                    <Link to="/" className="btn btn-primary mt-6 inline-block">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container-custom">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">📋 Tous les Projets</h1>
                    <p className="text-gray-600">{filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Barre de recherche */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full"
                    />
                </div>

                {/* Grille de projets */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-600 text-lg">Aucun projet trouvé</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="btn btn-secondary mt-4"
                            >
                                Effacer la recherche
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;