const express = require("express");

const ExpenseItem = require("../models/ExpenseItem");
const UserActivity = require("../models/UserActivity");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new expense
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "Title, amount, and category are required",
      });
    }

    const expense = await ExpenseItem.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      notes,
    });

    await UserActivity.create({
      user: req.user._id,
      action: "CREATE_EXPENSE",
      details: `Created expense: ${title}`,
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

    expense.title = req.body.title ?? expense.title;
    expense.amount = req.body.amount ?? expense.amount;
    expense.category = req.body.category ?? expense.category;
    expense.date = req.body.date ?? expense.date;
    expense.notes = req.body.notes ?? expense.notes;

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