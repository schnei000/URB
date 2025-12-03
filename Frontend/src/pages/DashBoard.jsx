import { useEffect, useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../hooks/useAuth';

function DashBoard() {
    const { user } = useAuth();
    const { state: projectState } = useProjects();
    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        if (user) {
            setWelcomeMessage(`Bienvenue, ${user.name}!`);
        }
    }, [user]);
    return (
        <section>
            <h1>Tableau de bord</h1>
            <p>{welcomeMessage}</p>
            <div>
                <h3>Vos Projets</h3>
                {!projectState.projects || projectState.projects.length === 0 ? (
                    <p>Aucun projet disponible.</p>
                ) : (
                    <ul>
                        {projectState.projects.map(project => (
                            <li key={project.id}>{project.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Projets en Brouillon */}
            <div>
                <h3>Projets en Brouillon</h3>
                {!projectState.projects || projectState.projects.length === 0 ? (
                    <p>Aucun projet en brouillon.</p>
                ) : (
                    <ul>
                        {projectState.projects
                            .filter(project => project.status === 'draft')
                            .map(project => (
                                <li key={project.id}>{project.name}</li>
                            ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default DashBoard;