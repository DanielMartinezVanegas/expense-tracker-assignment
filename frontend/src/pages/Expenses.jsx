import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const emptyForm = {
  title: "",
  amount: "",
  category: "",
  date: "",
  notes: "",
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        setError(validationErrors.join(" "));
      } else {
        setError(error.response?.data?.message || "Failed to save expense");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.amount || !formData.category) {
      setError("Title, amount, and category are required.");
      return;
    }

    const expenseData = {
      ...formData,
      amount: Number(formData.amount),
    };

    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, expenseData);
        setSuccess("Expense updated successfully.");
      } else {
        await api.post("/expenses", expenseData);
        setSuccess("Expense added successfully.");
      }

      resetForm();
      fetchExpenses();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.slice(0, 10) : "",
      notes: expense.notes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/expenses/${expenseId}`);
      setSuccess("Expense deleted successfully.");
      fetchExpenses();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const filteredExpenses = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return expenses.filter((expense) => {
      return (
        expense.title.toLowerCase().includes(search) ||
        expense.category.toLowerCase().includes(search) ||
        expense.notes?.toLowerCase().includes(search)
      );
    });
  }, [expenses, searchTerm]);

  const totalSpending = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);
  }, [filteredExpenses]);

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Create, view, update, delete, and search your expense records.</p>
        </div>

        <div className="summary-card">
          <span>Total shown</span>
          <strong>${totalSpending.toFixed(2)}</strong>
        </div>
      </div>

      <section className="content-grid">
        <form className="expense-form card" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Lunch"
          />

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Example: 15.50"
            min="0"
            step="0.01"
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes"
            rows="4"
          />

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Expense" : "Add Expense"}
            </button>

            {editingId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="card expense-list-section">
          <div className="list-header">
            <div>
              <h2>Expense List</h2>
              <p>{filteredExpenses.length} expense(s) shown</p>
            </div>

            <input
              className="search-input"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Live search expenses..."
            />
          </div>

          {loading ? (
            <p>Loading expenses...</p>
          ) : filteredExpenses.length === 0 ? (
            <p className="empty-state">No expenses found.</p>
          ) : (
            <div className="expense-list">
              {filteredExpenses.map((expense) => (
                <article className="expense-item" key={expense._id}>
                  <div>
                    <h3>{expense.title}</h3>
                    <p>
                      {expense.category} ·{" "}
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString()
                        : "No date"}
                    </p>
                    {expense.notes && <p className="expense-notes">{expense.notes}</p>}
                  </div>

                  <div className="expense-actions">
                    <strong>${Number(expense.amount).toFixed(2)}</strong>

                    <button type="button" onClick={() => handleEdit(expense)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Expenses;