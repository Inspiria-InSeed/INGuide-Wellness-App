require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test connection to PostgreSQL before starting the app.
    const result = await db.query("SELECT NOW()");

    console.log("✅ PostgreSQL database connected successfully");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.warn("⚠️ Database connection unavailable at startup.");
    console.warn(error.message);
    console.warn("The backend will continue to start, but database-backed routes will fail until the DB credentials are fixed.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();