import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo">
        Expense Tracker
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>

            {user.role === "admin" && <Link to="/admin">Admin</Link>}

            <span className="nav-user">Hi, {user.username}</span>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;