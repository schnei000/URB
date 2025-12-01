import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import './App.css'

function App() {
  const { user, token, loading, error, register, login, logout } = useContext(AuthContext);

  // États pour les formulaires
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('client');

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email: loginEmail, password: loginPassword });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    register({ name: registerName, email: registerEmail, password: registerPassword, role: registerRole });
  };

  return (
    <div className="App">
      <h1>Mon Application de Services</h1>
      
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}

      {token ? (
        <div>
          <h2>Bienvenue, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <p>Rôle: {user?.role}</p>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <h2>Inscription</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '250px' }}>
              <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Nom complet" required />
              <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Email" required />
              <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Mot de passe" required />
              <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)}>
                <option value="client">Client</option>
                <option value="provider">Prestataire</option>
              </select>
              <button type="submit">S'inscrire</button>
            </form>
          </div>

          <div>
            <h2>Connexion</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '250px' }}>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" required />
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Mot de passe" required />
              <button type="submit">Se connecter</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
