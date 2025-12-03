import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validators';

function Register() {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client'
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

        // Validation des champs
        if (!formData.name.trim()) {
            setError("Le nom d'utilisateur est requis.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setError("Adresse email invalide.");
            return;
        }

        if (!validatePassword(formData.password)) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            navigate('/dashboard');
        } catch (error) {
            setError(error.message || "Échec de l'inscription. Veuillez réessayer.");
        }
    }

    return (
        <div>
            <h2>Inscription</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom d'utilisateur"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmer le mot de passe"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="client">Client</option>
                        <option value="provider">Prestataire</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </button>
            </form>

            <p>
                Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}

export default Register;