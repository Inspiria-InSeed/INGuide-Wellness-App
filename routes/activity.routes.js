const express = require("express");

const router = express.Router();

const {
  getAllActivities,
  getActivityById,
  getRecommendedActivities
} = require("../controllers/activity.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");

// All activities
router.get("/", authenticateToken, getAllActivities);

// Personalized recommendations
router.get(
  "/recommended",
  authenticateToken,
  getRecommendedActivities
);

// Single activity
router.get(
  "/:id",
  authenticateToken,
  getActivityById
);

module.exports = router;