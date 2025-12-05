import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                                Bienvenue sur <span className="text-blue-600">ProjectHub</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Une plateforme moderne pour gérer vos services et suivre vos projets en temps réel. Collaborez efficacement avec votre équipe.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Link to="/login">
                                <button className="btn-primary px-8 py-3 text-lg hover:scale-105 transition transform">
                                    Se connecter
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="btn-outline px-8 py-3 text-lg hover:scale-105 transition transform">
                                    S'inscrire
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-20 grid md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Tableaux de bord</h3>
                            <p className="text-gray-600">Visualisez vos projets et leurs statistiques en temps réel</p>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion facile</h3>
                            <p className="text-gray-600">Créez, modifiez et supprimez vos projets facilement</p>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
                            <p className="text-gray-600">Travaillez en équipe avec des outils collaboratifs</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2025 ProjectHub. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;