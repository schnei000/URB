import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../api/projectApi";
import { useAuth } from "../hooks/useAuth";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        setProject(res);
      } catch (err) {
        setError("Impossible de charger ce projet.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProject();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="page-wrapper flex items-center justify-center">
        <div className="text-center">
          <div className="spinner text-primary-color"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-danger-color text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-wrapper flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg">Projet introuvable</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary mt-6"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container-custom max-w-4xl">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost mb-6"
        >
          ← Retour
        </button>

        {/* Card principal */}
        <div className="card mb-8">
          {/* En-tête */}
          <div className="page-header">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
            </div>
          )}

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
            <InfoBlock emoji="💰" label="Budget" value={project.budget ? `${project.budget}€` : 'N/A'} valueClass="text-blue-600 dark:text-blue-400" />
            <InfoBlock emoji="📅" label="Deadline" value={project.deadline ? new Date(project.deadline).toLocaleDateString('fr-FR') : 'N/A'} />
            <InfoBlock emoji="🏷️" label="Catégorie" value={project.category || 'N/A'} />
          </div>

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.client_name && (
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">👤 Client</p>
                <p className="text-lg font-semibold text-gray-900">{project.client_name}</p>
              </div>
            )}

            {project.created_at && (
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">📌 Créé le</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="btn btn-primary">💬 Contacter</button>
          <button className="btn btn-secondary">⭐ Ajouter aux favoris</button>
        </div>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: '📝 Brouillon', badgeClass: 'badge-warning' },
    active: { label: '✅ Actif', badgeClass: 'badge-success' },
    closed: { label: '🔒 Fermé', badgeClass: 'badge-info' }, // Assuming info for closed
  };

  const config = statusConfig[status] || statusConfig.closed;

  return (
    <span className={`badge ${config.badgeClass} text-sm`}>
      {config.label}
    </span>
  );
};

const InfoBlock = ({ emoji, label, value, valueClass = 'text-gray-900' }) => {
  if (!value) return null;

  return (
    <div>
      <p className="text-gray-600 dark:text-slate-400 text-sm">{emoji} {label}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
};

export default ProjectDetail;