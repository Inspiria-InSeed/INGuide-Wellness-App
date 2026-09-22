const db = require("../config/db");

// Create a journal entry
const createJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, mood, sleep } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Journal content is required"
      });
    }

    const result = await db.query(
      `INSERT INTO journal_entries
      (user_id, title, content, mood, sleep)
      VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
          [userId, title || null, content, mood || null, sleep || null]
    );

    res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Create Journal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create journal entry"
    });
  }
};


// Get all journal entries for the logged-in user
const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT *
       FROM journal_entries
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Get Journal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch journal entries"
    });
  }
};


// Get a specific journal entry
const getJournalEntryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `SELECT *
       FROM journal_entries
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Get Journal Entry Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch journal entry"
    });
  }
};


// Update a journal entry
const updateJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content, mood, sleep } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Journal content is required"
      });
    }

    const result = await db.query(
      `UPDATE journal_entries
       SET title = $1,
           content = $2,
           mood = $3,
             sleep = $4,
             updated_at = CURRENT_TIMESTAMP
           WHERE id = $5 AND user_id = $6
       RETURNING *`,
          [title || null, content, mood || null, sleep || null, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal entry updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Update Journal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update journal entry"
    });
  }
};


// Delete a journal entry
const deleteJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM journal_entries
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal entry deleted successfully"
    });

  } catch (error) {
    console.error("Delete Journal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete journal entry"
    });
  }
};


module.exports = {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
};