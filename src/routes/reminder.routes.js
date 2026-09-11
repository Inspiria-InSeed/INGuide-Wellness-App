const express = require("express");

const router = express.Router();

const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
} = require("../controllers/reminder.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");


// Create reminder
router.post("/", authenticateToken, createReminder);

// Get reminders
router.get("/", authenticateToken, getReminders);

// Update reminder
router.put("/:id", authenticateToken, updateReminder);

// Delete reminder
router.delete("/:id", authenticateToken, deleteReminder);

module.exports = router;