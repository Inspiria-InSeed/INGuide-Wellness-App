const db = require("../config/db");

const getCurrentStreak = async (userId) => {
  const result = await db.query(
    `SELECT DISTINCT DATE(completed_at) AS activity_date
     FROM activity_completions
     WHERE user_id = $1
     ORDER BY activity_date DESC`,
    [userId]
  );

  const dates = result.rows.map(
    row => new Date(row.activity_date).toISOString().split("T")[0]
  );

  if (dates.length === 0) {
    return 0;
  }

  let streak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let expectedDate = new Date(today);

  if (dates[0] !== expectedDate.toISOString().split("T")[0]) {
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  for (const date of dates) {
    const expectedDateString =
      expectedDate.toISOString().split("T")[0];

    if (date === expectedDateString) {
      streak++;
      expectedDate.setDate(
        expectedDate.getDate() - 1
      );
    } else {
      break;
    }
  }

  return streak;
};

const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total completed activities
    const totalActivitiesResult = await db.query(
      `SELECT COUNT(*) AS total_completed
       FROM activity_completions
       WHERE user_id = $1`,
      [userId]
    );

    // 2. Total self-care time
    const selfCareResult = await db.query(
      `SELECT COALESCE(SUM(a.duration_minutes), 0) AS total_minutes
       FROM activity_completions ac
       INNER JOIN activities a
       ON ac.activity_id = a.id
       WHERE ac.user_id = $1`,
      [userId]
    );

    // 3. Activities completed this week
    const weeklyResult = await db.query(
      `SELECT COUNT(*) AS weekly_completed
       FROM activity_completions
       WHERE user_id = $1
       AND completed_at >= DATE_TRUNC('week', CURRENT_DATE)`,
      [userId]
    );

    // 4. Mood summary
    const moodResult = await db.query(
      `SELECT mood, COUNT(*) AS count
       FROM mood_records
       WHERE user_id = $1
       GROUP BY mood
       ORDER BY count DESC`,
      [userId]
    );

    const currentStreak = await getCurrentStreak(userId);

    res.status(200).json({
      success: true,
      data: {
        totalActivitiesCompleted: Number(
          totalActivitiesResult.rows[0].total_completed
        ),

        totalSelfCareMinutes: Number(
          selfCareResult.rows[0].total_minutes
        ),

        weeklyActivitiesCompleted: Number(
          weeklyResult.rows[0].weekly_completed
        ),

        currentStreak,

        moodSummary: moodResult.rows
      }
    });

  } catch (error) {
    console.error("Progress Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress data"
    });
  }
};

module.exports = {
  getProgress,
  getCurrentStreak,
  currentStreak: getCurrentStreak
};