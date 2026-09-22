const express = require("express");

const router = express.Router();

const {
  getProgress
} = require("../controllers/progress.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");

router.get(
  "/",
  authenticateToken,
  getProgress
);

module.exports = router;