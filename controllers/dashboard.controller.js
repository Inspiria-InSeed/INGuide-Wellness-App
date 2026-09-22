const db = require("../config/db");

// ==========================================
// GET COMPLETE USER DASHBOARD
// ==========================================

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // ==========================================
    // 1. GET USER INFORMATION
    // ==========================================

    const userResult = await db.query(
      `SELECT id, name, email
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0] || null;


    // ==========================================
    // 2. GET USER'S TOP PRIORITY
    // ==========================================

    const topPriorityResult = await db.query(
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

    const topPriority =
      topPriorityResult.rows[0] || null;


    // ==========================================
    // 3. GET ACTIVITY FOR TOP PRIORITY
    // ==========================================

    let topPriorityActivity = null;

    if (topPriority) {

      const activityResult = await db.query(
        `SELECT
            a.id,
            a.title,
            a.description,
            a.category,
            a.duration_minutes,
            a.content_url

         FROM activities a

         INNER JOIN priority_activities pa
           ON a.id = pa.activity_id

         WHERE pa.priority_id = $1

         ORDER BY RANDOM()

         LIMIT 1`,
        [topPriority.id]
      );

      topPriorityActivity =
        activityResult.rows[0] || null;
    }


    // ==========================================
    // 4. GET ALL USER PRIORITIES
    // ==========================================

    const prioritiesResult = await db.query(
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


    // ==========================================
    // 5. GET LATEST MOOD
    // ==========================================

    const moodResult = await db.query(
      `SELECT
          id,
          mood,
          created_at

       FROM mood_records

       WHERE user_id = $1

       ORDER BY created_at DESC

       LIMIT 1`,
      [userId]
    );

    const latestMood =
      moodResult.rows[0] || null;


    // ==========================================
    // 6. GET RECOMMENDED ACTIVITIES
    // ==========================================

    const recommendationResult = await db.query(
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

       ORDER BY a.id ASC

       LIMIT 5`,
      [userId]
    );


    // ==========================================
    // 7. TOTAL COMPLETED ACTIVITIES
    // ==========================================

    const completedResult = await db.query(
      `SELECT
          COUNT(*) AS total_completed

       FROM activity_completions

       WHERE user_id = $1`,
      [userId]
    );


    // ==========================================
    // 8. TOTAL SELF-CARE TIME
    // ==========================================

    const selfCareResult = await db.query(
      `SELECT
          COALESCE(
            SUM(a.duration_minutes),
            0
          ) AS total_minutes

       FROM activity_completions ac

       INNER JOIN activities a
         ON ac.activity_id = a.id

       WHERE ac.user_id = $1`,
      [userId]
    );


    // ==========================================
    // 9. RETURN COMPLETE DASHBOARD DATA
    // ==========================================

    res.status(200).json({
      success: true,

      data: {

        // User information
        user,

        // Top priority section
        topPriority,

        // Recommended activity for top priority
        topPriorityActivity,

        // All selected priorities
        priorities: prioritiesResult.rows,

        // Latest mood
        latestMood,

        // Recommended activities
        recommendations: recommendationResult.rows,

        // Progress information
        progress: {

          activitiesCompleted: Number(
            completedResult.rows[0].total_completed
          ),

          selfCareMinutes: Number(
            selfCareResult.rows[0].total_minutes
          )
        }
      }
    });

  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    });
  }
};


// ==========================================
// EXPORT CONTROLLER
// ==========================================

module.exports = {
  getDashboard
};