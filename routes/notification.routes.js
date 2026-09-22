const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require(
  "../controllers/notification.controller"
);

const {
  authenticateToken
} = require("../middleware/auth.middleware");

router.get(
  "/",
  authenticateToken,
  getNotifications
);

router.put(
  "/:id/read",
  authenticateToken,
  markAsRead
);

router.put(
  "/read-all",
  authenticateToken,
  markAllAsRead
);

module.exports = router;