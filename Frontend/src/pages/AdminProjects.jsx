import { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';

function AdminProjects() {
    const { state: projectState } = useProjects();
    const [selectedProject, setSelectedProject] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleEdit = (project) => {
        setSelectedProject(project);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedProject(null);
        setShowForm(true);
    };

    const handleCancel = () => {
        setSelectedProject(null);
        setShowForm(false);
    };

    const handleDelete = (projectId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            // Implémentation de la suppression
            console.log('Suppression du projet:', projectId);
        }
    };

    const filteredProjects = projectState.projects?.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">⚙️ Gestion des Projets</h1>
                        <p className="text-gray-600 mt-2">{filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={handleCreate} className="btn-primary">
                        ➕ Créer un nouveau projet
                    </button>
                </div>

                {/* Modal de formulaire */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {selectedProject ? 'Éditer le projet' : 'Créer un nouveau projet'}
                            </h2>
                            <p className="text-gray-600 mb-6">Formulaire de projet (à implémenter)</p>
                            <div className="flex gap-3">
                                <button onClick={handleCancel} className="btn-secondary flex-1">
                                    Annuler
                                </button>
                                <button className="btn-primary flex-1">
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Barre de recherche */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full input-field"
                    />
                </div>

                {/* Tableau */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-600 text-lg">Aucun projet trouvé</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom du projet</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Budget</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Créé le</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{project.budget}€</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    project.status === 'draft' 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {project.status === 'draft' ? '📝 Brouillon' : '✅ Actif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(project.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                    >
                                                        ✏️ Éditer
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                    >
                                                        🗑️ Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProjects;