const express = require("express");

const router = express.Router();

const {
  getAllPriorities,
  saveUserPriorities,
  getUserPriorities,
  getTopPriority
} = require("../controllers/priority.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");


// GET ALL AVAILABLE PRIORITIES
router.get(
  "/",
  authenticateToken,
  getAllPriorities
);


// SAVE USER PRIORITIES
router.post(
  "/",
  authenticateToken,
  saveUserPriorities
);


// GET LOGGED-IN USER PRIORITIES
router.get(
  "/my-priorities",
  authenticateToken,
  getUserPriorities
);


// GET USER'S TOP PRIORITY
router.get(
  "/top-priority",
  authenticateToken,
  getTopPriority
);


module.exports = router;