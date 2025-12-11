import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-wrapper flex items-center justify-center px-4">
      <div className="text-center">
        {/* Titre */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
          404
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn btn-primary"
          >
            🏠 Retour à l'accueil
          </Link>
          <Link
            to="/projects"
            className="btn btn-secondary"
          >
            📋 Voir les projets
          </Link>
        </div>
      </div>
    </div>
  );
}
