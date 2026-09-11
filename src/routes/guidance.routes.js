const express = require("express");

const router = express.Router();

const {
  getAllGuidance,
  getRecommendedGuidance,
  getGuidanceById
} = require("../controllers/guidance.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");


// All guidance
router.get("/", authenticateToken, getAllGuidance);

// Personalized guidance
router.get(
  "/recommended",
  authenticateToken,
  getRecommendedGuidance
);

// Single guidance resource
router.get("/:id", authenticateToken, getGuidanceById);

module.exports = router;