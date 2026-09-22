const db = require("../config/db");

// Save a mood
const createMood = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mood, sleep, note } = req.body;

    const validMoods = [
      "Very Sad",
      "Sad",
      "Neutral",
      "Happy",
      "Very Happy"
    ];

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "Mood is required"
      });
    }

    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mood"
      });
    }

    const result = await db.query(
      `INSERT INTO mood_records (user_id, mood, sleep, note)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, mood, sleep, note, created_at`,
      [userId, mood, sleep || null, note || null]
    );

    res.status(201).json({
      success: true,
      message: "Mood saved successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Create Mood Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save mood"
    });
  }
};


// Get today's latest mood
const getTodayMood = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, mood, sleep, note, created_at
       FROM mood_records
       WHERE user_id = $1
       AND DATE(created_at) = CURRENT_DATE
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No mood recorded today",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Get Today Mood Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch today's mood"
    });
  }
};


// Get mood history
const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, mood, sleep, note, created_at
       FROM mood_records
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
    console.error("Mood History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch mood history"
    });
  }
};

module.exports = {
  createMood,
  getTodayMood,
  getMoodHistory
};