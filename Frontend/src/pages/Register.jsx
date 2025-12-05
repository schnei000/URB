import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validators';

function Register() {
    const navigate = useNavigate();
    const { register, loading, error, user, token } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client'
    });

    const [localError, setLocalError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // Rediriger après inscription réussie
    useEffect(() => {
        if (isRegistering && user && token) {
            navigate('/dashboard');
        }
    }, [user, token, isRegistering, navigate]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLocalError("");

        // Validation des champs
        if (!formData.name.trim()) {
            setLocalError("Le nom d'utilisateur est requis.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setLocalError("Adresse email invalide.");
            return;
        }

        if (!validatePassword(formData.password)) {
            setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setIsRegistering(true);
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
        } catch (err) {
            setLocalError(err.message || "Échec de l'inscription. Veuillez réessayer.");
            setIsRegistering(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">ProjectHub</h1>
                        <p className="text-gray-600 mt-2">Créer un nouveau compte</p>
                    </div>

                    {(localError || error) && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {localError || error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Jean Dupont"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rôle
                            </label>
                            <select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="client">Client</option>
                                <option value="provider">Prestataire</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg"
                        >
                            {loading ? "Inscription en cours..." : "S'inscrire"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Déjà inscrit ?{' '}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;