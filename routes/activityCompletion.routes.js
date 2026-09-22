const express = require("express");

const router = express.Router();

const {
  completeActivity,
  getCompletedActivities
} = require(
  "../controllers/activityCompletion.controller"
);

const {
  authenticateToken
} = require("../middleware/auth.middleware");


// Mark an activity as completed
router.post(
  "/:activityId/complete",
  authenticateToken,
  completeActivity
);


// Get completed activities
router.get(
  "/completed",
  authenticateToken,
  getCompletedActivities
);


module.exports = router;