const db = require("../config/db");

const VALID_CATEGORIES = ["technical", "account", "wellness", "feedback", "other"];
const VALID_PRIORITIES = ["low", "normal", "high"];

const createTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, description, category = "other", priority = "normal" } = req.body;

    if (typeof subject !== "string" || !subject.trim()) {
      return res.status(400).json({ success: false, message: "Subject is required" });
    }
    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }
    if (!VALID_CATEGORIES.includes(category) || !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ success: false, message: "Invalid support category or priority" });
    }

    const result = await db.query(
      `INSERT INTO support_tickets
       (user_id, subject, description, category, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, subject, description, category, priority, status, created_at, updated_at`,
      [userId, subject.trim(), description.trim(), category, priority]
    );

    return res.status(201).json({
      success: true,
      message: "Support request submitted successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Create Support Ticket Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit support request" });
  }
};

const getTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 50);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);

    const result = await db.query(
      `SELECT id, subject, description, category, priority, status,
              resolution, created_at, updated_at
       FROM support_tickets
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      limit,
      offset,
      data: result.rows
    });
  } catch (error) {
    console.error("Get Support Tickets Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch support requests" });
  }
};

const getTicketById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, subject, description, category, priority, status,
              resolution, created_at, updated_at
       FROM support_tickets
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Support request not found" });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Get Support Ticket Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch support request" });
  }
};

module.exports = { createTicket, getTickets, getTicketById };