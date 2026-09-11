const cron = require("node-cron");
const db = require("../config/db");

const tableExists = async (tableName) => {
  const result = await db.query(
    `SELECT to_regclass($1) AS table_name`,
    [tableName]
  );

  return result.rows[0]?.table_name !== null;
};

// ==========================================
// REMINDER SCHEDULER
// ==========================================

const startReminderScheduler = () => {

  // Runs every minute
  cron.schedule("* * * * *", async () => {

    try {

      console.log("Checking reminders...");

      const remindersTableExists = await tableExists("public.reminders");
      const notificationsTableExists = await tableExists("public.notifications");

      if (!remindersTableExists || !notificationsTableExists) {
        console.log(
          "Reminder scheduler skipped: required database tables are not available yet."
        );
        return;
      }

      // ==========================================
      // FIND REMINDERS THAT SHOULD TRIGGER NOW
      // ==========================================

      const result = await db.query(
        `
        SELECT
          id,
          user_id,
          title,
          description,
          reminder_time

        FROM reminders

        WHERE is_active = TRUE

          AND reminder_time::TIME =
              DATE_TRUNC(
                'minute',
                CURRENT_TIMESTAMP
              )::TIME

          AND (
            last_notified_date IS NULL
            OR last_notified_date < CURRENT_DATE
          )
        `
      );


      // ==========================================
      // PROCESS EACH REMINDER
      // ==========================================

      for (const reminder of result.rows) {

        console.log(
          `Reminder triggered: ${reminder.title}`
        );


        // ==========================================
        // CREATE IN-APP NOTIFICATION
        // ==========================================

        await db.query(
          `
          INSERT INTO notifications
          (
            user_id,
            title,
            message,
            is_read
          )

          VALUES
          (
            $1,
            $2,
            $3,
            FALSE
          )
          `,
          [
            reminder.user_id,
            reminder.title,
            reminder.description ||
              "You have a wellness reminder."
          ]
        );


        // ==========================================
        // MARK REMINDER AS NOTIFIED
        // ==========================================

        await db.query(
          `
          UPDATE reminders

          SET last_notified_date = CURRENT_DATE

          WHERE id = $1
          `,
          [reminder.id]
        );


        console.log(
          `Notification created successfully for reminder ID: ${reminder.id}`
        );
      }

    } catch (error) {

      console.error(
        "Reminder Scheduler Error:",
        error
      );
    }

  });

  console.log(
    "Reminder scheduler started successfully"
  );
};


// ==========================================
// EXPORT SCHEDULER
// ==========================================

module.exports = startReminderScheduler;