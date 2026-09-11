const db = require("../config/db");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get activities related to the user's priorities
    // Exclude activities that the user has already completed
    const result = await db.query(
      `
      SELECT DISTINCT
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

      ORDER BY a.id ASC

      LIMIT 10
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Recommendations fetched successfully",
      count: result.rows.length,
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
  getRecommendations
};