import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { token, logout } = useAuth();

    return (
        <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white">ProjectHub</Link>
                    </div>

                    {/* Navigation principale (milieu) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            <Link to="/features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium">Fonctionnalités</Link>
                            <Link to="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium">Tarifs</Link>
                            <Link to="/resources" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium">Ressources</Link>
                            <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium">Contact</Link>
                        </div>
                    </div>

                    {/* Actions (droite) */}
                    <div className="hidden md:flex items-center gap-4">
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 text-sm font-medium">Tableau de bord</Link>
                                <button onClick={logout} className="btn-secondary">Déconnexion</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 text-sm font-medium">Se connecter</Link>
                                <Link to="/register" className="btn-primary">Commencer l'essai gratuit</Link>
                            </>
                        )}
                    </div>

                    {/* Menu Hamburger (mobile) */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-slate-100 dark:bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white focus:outline-none">
                            <span className="sr-only">Ouvrir le menu</span>
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">{isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}</svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenu du menu mobile */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/features" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">Fonctionnalités</Link>
                    <Link to="/pricing" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">Tarifs</Link>
                    <Link to="/register" className="btn-primary w-full text-center mt-2 block">Commencer l'essai gratuit</Link>
                    <Link to="/login" className="btn-outline w-full text-center mt-2 block">Se connecter</Link>
                </div>
            </div>
        </nav>
    );
}