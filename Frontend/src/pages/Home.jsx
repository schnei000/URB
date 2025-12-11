import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Rocket } from 'lucide-react';

function Home() {
  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-white dark:from-[#1A1B2D] dark:to-[#111220] text-[#202225] dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
          {/* Colonne de texte */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
              Débloquez la simplicité, <br />
              <span className="text-primary-color">maîtrisez la puissance.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-light">
              ProjectHub est l'outil tout-en-un pour centraliser vos projets, synchroniser les équipes et garantir que vous ne manquiez plus jamais une date limite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4" style={{ animationDelay: '0.2s' }}>
              <Link to="/register" className="btn btn-primary text-lg transform transition-transform hover:scale-105">
                Commencer Gratuitement
              </Link>
              <Link to="/demo" className="btn btn-outline text-lg transform transition-transform hover:scale-105 ">
                Demander une démo (15 min)
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 pt-2">
              ✓ Pas de carte de crédit requise. | Annulez à tout moment.
            </p>
          </div>

          {/* Colonne de l'image */}
          <div className="hidden lg:block animate-float">
            <div className="card p-4">
              <img src="https://via.placeholder.com/600x450.png/F5F7FA/202225?text=Tableau+de+Bord+ProjectHub" alt="Aperçu du tableau de bord de ProjectHub" className="rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Preuve Sociale */}
      <section className="py-16 bg-white dark:bg-slate-800/50">
        <div className="container-custom">
          <h3 className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400">
            Ils nous font confiance pour gérer leurs projets complexes
          </h3>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {['Company', 'Statamic', 'Current', 'Tuple', 'Transistor', 'LogoIpsum'].map(name => (
              <div key={name} className="flex justify-center grayscale hover:grayscale-0 transition-all duration-300 transform hover:-translate-y-1">
                <span className="text-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Pourquoi ProjectHub ? La solution conçue pour la croissance.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up">
              <LayoutDashboard size={40} className="mx-auto mb-4 text-primary-color" />
              <h3 className="text-xl font-bold mb-2">Tableaux de bord en temps réel</h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">Visualisez l'état, les statistiques et les goulots d'étranglement de tous vos projets en une seule interface claire.</p>
            </div>
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Users size={40} className="mx-auto mb-4 text-primary-color" />
              <h3 className="text-xl font-bold mb-2">Collaboration sans friction</h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">Partagez des fichiers, assignez des tâches et communiquez avec vos clients ou votre équipe sans changer d'outil.</p>
            </div>
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Rocket size={40} className="mx-auto mb-4 text-primary-color" />
              <h3 className="text-xl font-bold mb-2">Simplicité et Accessibilité</h3>
              <p className="text-slate-600 dark:text-slate-400 font-light">Une courbe d'apprentissage minimale pour une efficacité maximale. Lancez votre premier projet en moins de 5 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Appel à l'Action Final */}
      <section className="bg-gradient-to-r from-[#2A68FF] to-blue-500 dark:from-[#2A68FF] dark:to-blue-800">
        <div className="container-custom text-center py-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Prêt à simplifier votre flux de travail ?
          </h2>
          <p className="mt-4 text-lg text-blue-100 font-light">
            Joignez les milliers d'équipes qui utilisent ProjectHub pour livrer à temps.
          </p>
          <Link to="/register" className="mt-8 btn btn-primary bg-white hover:bg-slate-100 text-primary-color text-lg transform transition-transform hover:scale-105">
            Commencer l'essai gratuit maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;