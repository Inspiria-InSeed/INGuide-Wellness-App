const express = require("express");

const router = express.Router();

const {
  createMood,
  getTodayMood,
  getMoodHistory
} = require("../controllers/mood.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");


// Save mood
router.post(
  "/",
  authenticateToken,
  createMood
);


// Get today's mood
router.get(
  "/today",
  authenticateToken,
  getTodayMood
);


// Get mood history
router.get(
  "/history",
  authenticateToken,
  getMoodHistory
);


module.exports = router;