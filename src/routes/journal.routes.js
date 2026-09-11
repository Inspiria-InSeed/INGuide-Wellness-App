const express = require("express");

const router = express.Router();

const {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
} = require("../controllers/journal.controller");

const {
  authenticateToken
} = require("../middleware/auth.middleware");

router.post("/", authenticateToken, createJournalEntry);

router.get("/", authenticateToken, getJournalEntries);

router.get("/:id",authenticateToken,getJournalEntryById);

router.put("/:id",authenticateToken, updateJournalEntry);

router.delete("/:id", authenticateToken, deleteJournalEntry);

  
module.exports = router;