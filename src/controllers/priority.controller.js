const db = require("../config/db");

// ==========================================
// 1. GET ALL AVAILABLE PRIORITIES
// ==========================================
const getAllPriorities = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description
       FROM priorities
       ORDER BY id ASC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Get Priorities Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch priorities"
    });
  }
};


// ==========================================
// 2. SAVE USER PRIORITIES
// ==========================================
const saveUserPriorities = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      priorityIds,
      topPriorityId
    } = req.body;


    // Validate priority IDs
    if (
      !Array.isArray(priorityIds) ||
      priorityIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one priority"
      });
    }


    // Validate top priority
    if (
      topPriorityId &&
      !priorityIds.map(Number).includes(Number(topPriorityId))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Top priority must be one of the selected priorities"
      });
    }


    // Delete old priorities
    await db.query(
      `DELETE FROM user_priorities
       WHERE user_id = $1`,
      [userId]
    );


    // Save selected priorities
    for (const priorityId of priorityIds) {

      const isTopPriority =
        Number(priorityId) === Number(topPriorityId);

      await db.query(
        `INSERT INTO user_priorities
         (user_id, priority_id, is_top_priority)
         VALUES ($1, $2, $3)`,
        [
          userId,
          priorityId,
          isTopPriority
        ]
      );
    }


    res.status(200).json({
      success: true,
      message: "Priorities saved successfully"
    });

  } catch (error) {

    console.error(
      "Save Priorities Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save priorities"
    });
  }
};


// ==========================================
// 3. GET LOGGED-IN USER PRIORITIES
// ==========================================
const getUserPriorities = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT
        p.id,
        p.name,
        p.description,
        up.is_top_priority
       FROM priorities p
       INNER JOIN user_priorities up
       ON p.id = up.priority_id
       WHERE up.user_id = $1
       ORDER BY
         up.is_top_priority DESC,
         up.created_at ASC`,
      [userId]
    );


    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {

    console.error(
      "Get User Priorities Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user priorities"
    });
  }
};


// ==========================================
// 4. GET USER'S TOP PRIORITY
// ==========================================
const getTopPriority = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT
        p.id,
        p.name,
        p.description
       FROM priorities p
       INNER JOIN user_priorities up
       ON p.id = up.priority_id
       WHERE up.user_id = $1
       AND up.is_top_priority = TRUE
       LIMIT 1`,
      [userId]
    );


    // No top priority selected
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No top priority selected",
        data: null
      });
    }


    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Get Top Priority Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch top priority"
    });
  }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {
  getAllPriorities,
  saveUserPriorities,
  getUserPriorities,
  getTopPriority
};