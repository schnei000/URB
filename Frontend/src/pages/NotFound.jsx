import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Emoji grande taille */}
        <div className="text-9xl mb-6 animate-bounce">404</div>

        {/* Titre */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Oups! Page non trouvée
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          La page que tu cherches n'existe pas. Pas génial, mais ça arrive! 
          Ne t'inquiète pas, tu peux toujours retourner à l'accueil.
        </p>

        {/* Icônes décoratives */}
        <div className="flex justify-center gap-4 mb-8 text-4xl">
          <span className="animate-pulse">🤔</span>
          <span className="animate-pulse delay-100">📍</span>
          <span className="animate-pulse delay-200">🔍</span>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-block"
          >
            🏠 Retour à l'accueil
          </Link>
          <Link
            to="/projects"
            className="btn-secondary inline-block"
          >
            📋 Voir les projets
          </Link>
        </div>

        {/* Message humoristique */}
        <p className="mt-12 text-gray-500 text-sm italic">
          Indice: La page n'a jamais existé... ou elle s'est cachée quelque part! 🙈
        </p>
      </div>
    </div>
  );
}
