const db = require("../config/db");

// Get all activities
const getAllActivities = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT *
       FROM activities
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Get Activities Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities"
    });
  }
};


// Get a specific activity
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT *
       FROM activities
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Get Activity Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity"
    });
  }
};


// Get activities recommended for the logged-in user
const getRecommendedActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT DISTINCT
          a.id,
          a.title,
          a.description,
          a.category,
          a.duration_minutes,
          a.content_url
       FROM activities a
       INNER JOIN priority_activities pa
          ON a.id = pa.activity_id
       INNER JOIN user_priorities up
          ON pa.priority_id = up.priority_id
       WHERE up.user_id = $1
       ORDER BY a.id`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Recommendation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations"
    });
  }
};


module.exports = {
  getAllActivities,
  getActivityById,
  getRecommendedActivities
};