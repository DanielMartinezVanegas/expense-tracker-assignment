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

      <section className="feature-grid">
        <article className="feature-card">
          <h2>Expense CRUD</h2>
          <p>
            Add, view, edit, and delete expense records stored in the MongoDB
            database.
          </p>
        </article>

        <article className="feature-card">
          <h2>Live Search</h2>
          <p>
            Search expenses instantly by title, category, or notes without
            reloading the page.
          </p>
        </article>

        <article className="feature-card">
          <h2>Secure Login</h2>
          <p>
            User accounts are protected using password hashing and JWT-based
            authentication.
          </p>
        </article>

        {user?.role === "admin" && (
          <article className="feature-card">
            <h2>Admin Tools</h2>
            <p>
              Admin users can manage accounts and review activity logs for
              important user actions.
            </p>
          </article>
        )}
      </section>
    </main>
  );
};

export default Dashboard;