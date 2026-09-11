const express = require("express");

const router = express.Router();

const {
  getRecommendations
} = require("../controllers/recommendation.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");

router.get(
  "/",
  authenticateToken,
  getRecommendations
);

module.exports = router;