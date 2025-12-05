import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl hover:text-blue-100 transition">
            <span className="text-2xl">🚀</span>
            <span>ProjectHub</span>
          </Link>

          {/* Navigation droite */}
          <div className="flex items-center gap-6">
            {/* Navigation links */}
            <div className="hidden md:flex gap-4">
              <Link to="/dashboard" className="hover:text-blue-100 transition font-medium">Dashboard</Link>
              <Link to="/projects" className="hover:text-blue-100 transition font-medium">Projets</Link>
              <Link to="/admin/projects" className="hover:text-blue-100 transition font-medium">Gestion</Link>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.name || "Utilisateur"}</p>
                <p className="text-xs text-blue-100">{user?.role || "Client"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-primary hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}