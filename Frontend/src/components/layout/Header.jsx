import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Fonctionnalités', path: '/features' },
        { name: 'À Propos', path: '/about' },
    ];

    return (
        <header className="bg-white/80 dark:bg-dark/80 backdrop-blur-lg sticky top-0 z-40 border-b">
            <div className="container-custom mx-auto flex items-center justify-between h-20 px-4">
                <Link to="/" className="text-2xl font-bold text-primary">
                    ProjectHub
                </Link>

                 {/* Navigation et boutons d'action regroupés */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link key={link.name} to={link.path} className="font-medium text-gray-600 hover:text-primary transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="btn btn-ghost">Se connecter</Link>
                        <Link to="/register" className="btn btn-primary">S'inscrire</Link>
                    </div>

                </div>

                {/* Bouton pour menu mobile */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="btn btn-ghost">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            {isOpen && (
                <div className="md:hidden border-t">
                    <nav className="flex flex-col p-4 gap-4">
                        {navLinks.map(link => (
                            <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="font-medium text-gray-600 hover:text-primary transition-colors py-2">
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-outline w-full mt-2">Se connecter</Link>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary w-full">S'inscrire</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;