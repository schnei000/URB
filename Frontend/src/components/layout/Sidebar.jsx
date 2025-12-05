import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      style={{
        width: "230px",
        height: "100vh",
        background: "#1f2937",
        color: "white",
        paddingTop: "80px",  
        position: "fixed",
        top: 0,
        left: 0
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "20px"
        }}
      >

        {/* Dashboard */}
        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            background: isActive("/dashboard") ? "#374151" : "transparent"
          }}
        >
          Dashboard
        </Link>

        {/* Projects */}
        <Link
          to="/projects"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            background: isActive("/projects") ? "#374151" : "transparent"
          }}
        >
          Projects
        </Link>

        {/* Admin Zone si user.admin === true */}
        {user?.is_admin && (
          <Link
            to="/admin/projects"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "10px 15px",
              borderRadius: "4px",
              background: isActive("/admin/projects") ? "#374151" : "transparent"
            }}
          >
            Admin Projects
          </Link>
        )}
      </nav>
    </aside>
  );
}
