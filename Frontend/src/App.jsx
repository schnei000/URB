import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css';

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
// import Navbar from './components/layout/Navbar';
// import Sidebar from './components/layout/Sidebar';

// Route protégée
function ProtectedRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

function App() {
    const { token } = useAuth();

    return (
        <Router>
            <div className="App">
                {/* {token && <Navbar />} */}
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />

                    {/* Routes protégées */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashBoard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/projects" 
                        element={
                            <ProtectedRoute>
                                <Projects />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/projects/:id" 
                        element={
                            <ProtectedRoute>
                                <ProjectDetail />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/projects" 
                        element={
                            <ProtectedRoute>
                                <AdminProjects />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Route 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
