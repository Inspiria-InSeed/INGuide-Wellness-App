const express = require("express");
const {
  createTicket,
  getTickets,
  getTicketById
} = require("../controllers/support.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticateToken);
router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);

module.exports = router;