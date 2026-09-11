const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const priorityRoutes = require("./routes/priority.routes");
const moodRoutes = require("./routes/mood.routes");
const activityRoutes = require("./routes/activity.routes");
const activityCompletionRoutes = require(
  "./routes/activityCompletion.routes"
);
const recommendationRoutes = require(
  "./routes/recommendation.routes"
);
const dashboardRoutes = require(
  "./routes/dashboard.routes"
);
const journalRoutes = require("./routes/journal.routes");
const progressRoutes = require(
  "./routes/progress.routes"
);
const guidanceRoutes = require("./routes/guidance.routes");
const reminderRoutes = require(
  "./routes/reminder.routes"
);
const notificationRoutes = require(
  "./routes/notification.routes"
);
const supportRoutes = require("./routes/support.routes");

const app = express();
const startReminderScheduler = require(
  "./services/reminderScheduler"
);
const chatRoutes = require("./routes/chat.routes");
// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

// Start scheduler
startReminderScheduler();
// ================================
// Serve Frontend Files
// ================================

// Adjust this path if your folder structure is different
const frontendPath = path.join(__dirname, "../../");

app.use(express.static(frontendPath));

// ================================
// API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/priorities", priorityRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/activities", activityRoutes);
app.use(
  "/api/activity",
  activityCompletionRoutes
);
app.use(
  "/api/recommendations",
  recommendationRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/journal", journalRoutes);
app.use(
  "/api/progress",
  progressRoutes
);
app.use("/api/guidance", guidanceRoutes);
app.use("/api/reminders", reminderRoutes);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use("/api/support", supportRoutes);
app.use("/api/chat", chatRoutes);
// ================================
// Backend Test Route
// ================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Wellness App Backend is running"
    });
});

module.exports = app;