import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message || "Échec de la connexion. Veuillez réessayer.");
        }
    }
    return (
        <div>
            <h2>Connexion</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <p>
                Pas encore de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    );
}

export default Login;
