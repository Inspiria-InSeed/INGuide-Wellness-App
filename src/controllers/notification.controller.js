const db = require("../config/db");

// Get all notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT *
       FROM notifications
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
    console.error("Get Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};


// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Read Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification"
    });
  }
};


// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = $1
       AND is_read = FALSE`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {
    console.error("Mark All Read Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notifications"
    });
  }
};


module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};