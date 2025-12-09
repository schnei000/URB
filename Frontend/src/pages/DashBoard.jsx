import { useMemo } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, FolderKanban, CircleDot } from 'lucide-react';

const ProjectCard = ({ project }) => (
    <div className="card hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2 font-light">{project.description || 'Pas de description'}</p>
        
        <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
            }`}>
                {project.status === 'draft' ? <FileText size={14} /> : <CheckCircle size={14} />}
                {project.status === 'draft' ? 'Brouillon' : 'Actif'}
            </span>
            <span className="text-sm font-semibold text-[#2A68FF]">{project.budget}€</span>
        </div>

        <Link 
            to={`/projects/${project.id}`}
            className="btn-outline text-center block w-full"
        >
            Voir détails
        </Link>
    </div>
);

function DashBoard() {
    const { user } = useAuth();
    const { state: projectState } = useProjects();

    const welcomeMessage = useMemo(() => {
        return user ? `Bienvenue, ${user.name}!` : '';
    }, [user]);

    const { draftProjects, activeProjects } = useMemo(() => {
        const projects = projectState.projects || [];
        const draftProjects = projects.filter(project => project.status === 'draft');
        const activeProjects = projects.filter(project => project.status !== 'draft');
        return { draftProjects, activeProjects };
    }, [projectState.projects]);

    return (
        <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Tableau de bord</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-semibold">{welcomeMessage}</p>
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card">
                        <div className="flex items-center gap-4">
                            <FolderKanban className="text-[#2A68FF]" size={32} />
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Projets totaux</p>
                                <p className="text-3xl font-bold">{projectState.projects?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center gap-4">
                            <CircleDot className="text-green-500" size={32} />
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Projets actifs</p>
                                <p className="text-3xl font-bold text-green-600">{activeProjects.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center gap-4">
                            <FileText className="text-yellow-500" size={32} />
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">En brouillon</p>
                                <p className="text-3xl font-bold text-yellow-600">{draftProjects.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projets en Brouillon */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><FileText className="text-yellow-500" /> Projets en Brouillon</h2>
                        <Link to="/projects" className="btn-secondary">
                            Tous les projets
                        </Link>
                    </div>

                    {draftProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun projet en brouillon</p>
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
                        <h2 className="text-2xl font-bold flex items-center gap-3"><CheckCircle className="text-green-500" /> Projets Actifs</h2>
                    </div>

                    {activeProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun projet actif</p>
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