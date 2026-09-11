const db = require("../config/db");

// Mark an activity as completed
const completeActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId } = req.params;

    // Check whether the activity exists
    const activityResult = await db.query(
      `SELECT id, title, duration_minutes
       FROM activities
       WHERE id = $1`,
      [activityId]
    );

    if (activityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    const result = await db.query(
      `INSERT INTO activity_completions
       (user_id, activity_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, activityId]
    );

    res.status(201).json({
      success: true,
      message: "Activity completed successfully",
      data: {
        completion: result.rows[0],
        activity: activityResult.rows[0]
      }
    });

  } catch (error) {
    console.error("Activity Completion Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete activity"
    });
  }
};


// Get user's completed activities
const getCompletedActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT
          ac.id AS completion_id,
          ac.completed_at,
          a.id AS activity_id,
          a.title,
          a.category,
          a.duration_minutes
       FROM activity_completions ac
       INNER JOIN activities a
          ON ac.activity_id = a.id
       WHERE ac.user_id = $1
       ORDER BY ac.completed_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Completed Activities Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch completed activities"
    });
  }
};


module.exports = {
  completeActivity,
  getCompletedActivities
};