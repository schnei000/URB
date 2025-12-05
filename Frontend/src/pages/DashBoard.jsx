import { useEffect, useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

function DashBoard() {
    const { user } = useAuth();
    const { state: projectState } = useProjects();
    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        if (user) {
            setWelcomeMessage(`Bienvenue, ${user.name}!`);
        }
    }, [user]);

    const draftProjects = projectState.projects?.filter(project => project.status === 'draft') || [];
    const activeProjects = projectState.projects?.filter(project => project.status !== 'draft') || [];

    const ProjectCard = ({ project }) => (
        <div className="card hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description || 'Pas de description'}</p>
            
            <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'draft' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                }`}>
                    {project.status === 'draft' ? '📝 Brouillon' : '✅ Actif'}
                </span>
                <span className="text-sm font-semibold text-blue-600">{project.budget}€</span>
            </div>

            <Link 
                to={`/projects/${project.id}`}
                className="btn-primary text-center block"
            >
                Voir détails
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
                    <p className="text-lg text-blue-600 font-semibold">{welcomeMessage}</p>
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Projets totaux</p>
                        <p className="text-3xl font-bold text-gray-900">{projectState.projects?.length || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Projets actifs</p>
                        <p className="text-3xl font-bold text-green-600">{activeProjects.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">En brouillon</p>
                        <p className="text-3xl font-bold text-yellow-600">{draftProjects.length}</p>
                    </div>
                </div>

                {/* Projets en Brouillon */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">📝 Projets en Brouillon</h2>
                        <Link to="/projects" className="btn-secondary">
                            Tous les projets
                        </Link>
                    </div>

                    {draftProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">Aucun projet en brouillon</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {draftProjects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Projets Actifs */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">✅ Projets Actifs</h2>
                    </div>

                    {activeProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">Aucun projet actif</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeProjects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashBoard;