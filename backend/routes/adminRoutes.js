const express = require("express");

const User = require("../models/User");
const ExpenseItem = require("../models/ExpenseItem");
const UserActivity = require("../models/UserActivity");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// Get all user activity logs
router.get("/activities", protect, adminOnly, async (req, res) => {
  try {
    const activities = await UserActivity.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
});

// Update a user's role
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either user or admin",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = role;
    const updatedUser = await user.save();

    await UserActivity.create({
      user: req.user._id,
      action: "UPDATE_USER_ROLE",
      details: `Changed ${updatedUser.email} role to ${role}`,
    });

    res.json({
      message: "User role updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// Delete a user and their related expenses/activity records
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "Admins cannot delete their own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await ExpenseItem.deleteMany({ user: user._id });
    await UserActivity.deleteMany({ user: user._id });
    await user.deleteOne();

    await UserActivity.create({
      user: req.user._id,
      action: "DELETE_USER",
      details: `Deleted user account: ${user.email}`,
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;