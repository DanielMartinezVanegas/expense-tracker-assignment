const express = require("express");

const ExpenseItem = require("../models/ExpenseItem");
const UserActivity = require("../models/UserActivity");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const validCategories = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Education",
  "Other",
];

// Reusable validation function for expense data.
// This prevents invalid data from being saved even if someone bypasses the frontend.
const validateExpenseInput = (data) => {
  const errors = [];

  const title = data.title?.trim();
  const category = data.category?.trim();
  const notes = data.notes?.trim() || "";
  const amount = Number(data.amount);

  if (!title) {
    errors.push("Title is required.");
  } else if (title.length < 2) {
    errors.push("Title must be at least 2 characters long.");
  } else if (title.length > 80) {
    errors.push("Title must be less than 80 characters long.");
  }

  if (data.amount === undefined || data.amount === null || data.amount === "") {
    errors.push("Amount is required.");
  } else if (Number.isNaN(amount)) {
    errors.push("Amount must be a valid number.");
  } else if (amount <= 0) {
    errors.push("Amount must be greater than 0.");
  } else if (amount > 1000000) {
    errors.push("Amount is too large.");
  }

  if (!category) {
    errors.push("Category is required.");
  } else if (!validCategories.includes(category)) {
    errors.push("Category must be one of the allowed categories.");
  }

  if (data.date) {
    const date = new Date(data.date);

    if (Number.isNaN(date.getTime())) {
      errors.push("Date must be valid.");
    }
  }

  if (notes.length > 300) {
    errors.push("Notes must be less than 300 characters long.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanedData: {
      title,
      amount,
      category,
      date: data.date || Date.now(),
      notes,
    },
  };
};

// Create a new expense
router.post("/", protect, async (req, res) => {
  try {
    const validation = validateExpenseInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Invalid expense data",
        errors: validation.errors,
      });
    }

    const expense = await ExpenseItem.create({
      user: req.user._id,
      title: validation.cleanedData.title,
      amount: validation.cleanedData.amount,
      category: validation.cleanedData.category,
      date: validation.cleanedData.date,
      notes: validation.cleanedData.notes,
    });

    await UserActivity.create({
      user: req.user._id,
      action: "CREATE_EXPENSE",
      details: `Created expense: ${expense.title}`,
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create expense",
      error: error.message,
    });
  }
});

// Read all expenses for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await ExpenseItem.find({ user: req.user._id }).sort({
      date: -1,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
});

// Update an expense
router.put("/:id", protect, async (req, res) => {
  try {
    const expense = await ExpenseItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const validation = validateExpenseInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Invalid expense data",
        errors: validation.errors,
      });
    }

    expense.title = validation.cleanedData.title;
    expense.amount = validation.cleanedData.amount;
    expense.category = validation.cleanedData.category;
    expense.date = validation.cleanedData.date;
    expense.notes = validation.cleanedData.notes;

    const updatedExpense = await expense.save();

    await UserActivity.create({
      user: req.user._id,
      action: "UPDATE_EXPENSE",
      details: `Updated expense: ${updatedExpense.title}`,
    });

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update expense",
      error: error.message,
    });
  }
});

// Delete an expense
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await ExpenseItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    await UserActivity.create({
      user: req.user._id,
      action: "DELETE_EXPENSE",
      details: `Deleted expense: ${expense.title}`,
    });

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete expense",
      error: error.message,
    });
  }
});

module.exports = router;