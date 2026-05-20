import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="page-container">
      <section className="hero-card">
        <h1>Welcome, {user?.username}</h1>
        <p>
          Track your spending, manage your expenses, and review your financial
          activity from one simple dashboard.
        </p>

        <div className="dashboard-actions">
          <Link to="/expenses" className="primary-link">
            Manage Expenses
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="secondary-link">
              Admin Panel
            </Link>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;