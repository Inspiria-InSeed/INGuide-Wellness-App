const db = require("../config/db");

// Create a reminder
const createReminder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      reminderTime
    } = req.body;

    if (!title || !reminderTime) {
      return res.status(400).json({
        success: false,
        message: "Title and reminder time are required"
      });
    }

    const result = await db.query(
      `INSERT INTO reminders
       (user_id, title, description, reminder_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        userId,
        title,
        description || null,
        reminderTime
      ]
    );

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Create Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create reminder"
    });
  }
};


// Get all reminders
const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT *
       FROM reminders
       WHERE user_id = $1
       ORDER BY reminder_time ASC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Get Reminders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reminders"
    });
  }
};


// Update a reminder
const updateReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      reminderTime,
      isActive
    } = req.body;

    const result = await db.query(
      `UPDATE reminders
       SET title = $1,
           description = $2,
           reminder_time = $3,
           is_active = $4
       WHERE id = $5
       AND user_id = $6
       RETURNING *`,
      [
        title,
        description || null,
        reminderTime,
        isActive,
        id,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Update Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update reminder"
    });
  }
};


// Delete a reminder
const deleteReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM reminders
       WHERE id = $1
       AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully"
    });

  } catch (error) {
    console.error("Delete Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete reminder"
    });
  }
};


module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
};