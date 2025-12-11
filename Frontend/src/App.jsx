import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css';
import './index.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashBoard from './pages/DashBoard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AdminProjects from './pages/AdminProjects';
import NotFound from './pages/NotFound';

// Composants
import AppLayout from './components/layout/AppLayout'; // Layout pour l'application connectée
import PublicLayout from './components/layout/PublicLayout';

// Route protégée
function ProtectedRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

// Layout pour les pages publiques
function PublicRoutes() {
    return (
        <PublicLayout>
            <Outlet />
        </PublicLayout>
    );
}

// Layout pour les pages de l'application (une fois connecté)
function AppRoutes() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <Outlet />
            </AppLayout>
        </ProtectedRoute>
    );
}

function App() {
    const { token } = useAuth();

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Routes publiques avec leur propre layout */}
                    <Route element={<PublicRoutes />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
                        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
                    </Route>

                    {/* Routes protégées avec le layout de l'application */}
                    <Route element={<AppRoutes />}>
                        <Route path="/dashboard" element={<DashBoard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/admin/projects" element={<AdminProjects />} />
                    </Route>

                    {/* Route 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
