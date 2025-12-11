import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const { login, loading, error, user, token } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [localError, setLocalError] = useState("");

    // Rediriger après connexion réussie
    useEffect(() => {
        if (user && token) {
            navigate('/dashboard');
        }
    }, [user, token, navigate]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLocalError("");
        const success = await login(formData);
        if (!success) {
            setLocalError("Échec de la connexion. Email ou mot de passe incorrect.");
        }
    }

    return (
        <div className="page-wrapper flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">ProjectHub</h1>
                        <p className="text-gray-600 mt-2">Connexion à votre compte</p>
                    </div>

                    {(localError || error) && (
                        <div className="alert alert-error mb-4">
                            {localError || error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">
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
                            <label className="label">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="text-primary-color font-medium hover:underline">
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
