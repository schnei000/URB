import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getProjects } from "../api/projectApi";

const ProjectCard = ({ project }) => (
    <div className="card hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 flex-1 pr-2">{project.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                project.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
            }`}>
                {project.status === 'draft' ? 'Brouillon' : 'Actif'}
            </span>
        </div>
        
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-light">{project.description || 'Pas de description'}</p>
        
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-600 dark:text-slate-400">Budget: <span className="font-semibold text-[#2A68FF]">{project.budget}€</span></span>
            <span className="text-xs text-gray-500 dark:text-slate-500">{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
        </div>

        <Link to={`/projects/${project.id}`} className="btn-primary text-center block w-full">
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <div className="text-4xl">🔄</div>
                    </div>
                    <p className="mt-4 text-gray-600 text-lg">Chargement des projets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-red-600 text-lg">{error}</p>
                    <Link to="/" className="btn-primary mt-6 inline-block">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
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
                        className="w-full input-field"
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
                                className="btn-secondary mt-4"
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