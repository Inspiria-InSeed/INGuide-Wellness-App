require("dotenv").config();

const app = require("./src/app");
const db = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test connection to Supabase PostgreSQL
    const result = await db.query("SELECT NOW()");

    console.log("✅ Supabase PostgreSQL database connected successfully");
    console.log("Database time:", result.rows[0].now);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();