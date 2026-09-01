const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const emailRoutes = require("./routes/email.routes");

const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

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
app.use("/api/test", testRoutes);
app.use("/api/email", emailRoutes);

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