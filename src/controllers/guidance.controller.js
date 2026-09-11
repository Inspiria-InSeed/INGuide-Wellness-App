const db = require("../config/db");

// Get all guidance resources
const getAllGuidance = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT *
       FROM guidance
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Guidance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch guidance"
    });
  }
};


// Get personalized guidance
const getRecommendedGuidance = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT DISTINCT
          g.id,
          g.title,
          g.description,
          g.content,
          g.category
       FROM guidance g

       INNER JOIN priority_guidance pg
          ON g.id = pg.guidance_id

       INNER JOIN user_priorities up
          ON pg.priority_id = up.priority_id

       WHERE up.user_id = $1

       ORDER BY g.id
       LIMIT 10`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Recommendation Guidance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch personalized guidance"
    });
  }
};


// Get a specific guidance resource
const getGuidanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT *
       FROM guidance
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Guidance not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Get Guidance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch guidance"
    });
  }
};


module.exports = {
  getAllGuidance,
  getRecommendedGuidance,
  getGuidanceById
};