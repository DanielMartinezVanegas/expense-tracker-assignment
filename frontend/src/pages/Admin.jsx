import { useEffect, useState } from "react";
import api from "../services/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const usersResponse = await api.get("/admin/users");
      const activitiesResponse = await api.get("/admin/activities");

      setUsers(usersResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setError("");
    setSuccess("");

    try {
      await api.put(`/admin/users/${userId}`, {
        role: newRole,
      });

      setSuccess("User role updated successfully.");
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This will also delete their expenses and activity records."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccess("User deleted successfully.");
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage user accounts and review user activity logs.</p>
        </div>

        <div className="summary-card">
          <span>Total users</span>
          <strong>{users.length}</strong>
        </div>
      </div>

      {error && <div className="error-message page-message">{error}</div>}
      {success && <div className="success-message page-message">{success}</div>}

      {loading ? (
        <section className="card">
          <p>Loading admin data...</p>
        </section>
      ) : (
        <section className="admin-grid">
          <div className="card admin-section">
            <h2>Users</h2>
            <p>View registered users, update roles, or delete accounts.</p>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(user._id, event.target.value)
                          }
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="danger-button table-button"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card admin-section">
            <h2>Activity Logs</h2>
            <p>Review login, registration, expense, and admin actions.</p>

            <div className="activity-list">
              {activities.map((activity) => (
                <article className="activity-item" key={activity._id}>
                  <div>
                    <h3>{activity.action}</h3>
                    <p>{activity.details}</p>
                    <span>
                      {activity.user?.username || "Unknown user"} ·{" "}
                      {activity.user?.email || "No email"}
                    </span>
                  </div>

                  <time>{new Date(activity.createdAt).toLocaleString()}</time>
                </article>
              ))}

              {activities.length === 0 && (
                <p className="empty-state">No activity logs found.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Admin;