const express = require("express");

const {
    register,
    login,
    forgotPassword,
    resetPassword,
    googleLogin,
    getCurrentUser
} = require("../controllers/auth.controller");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

const router = express.Router();


// ===============================
// AUTHENTICATION ROUTES
// ===============================

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// The frontend sends the Google ID token returned by Google Identity Services.
router.post("/google", googleLogin);


// ===============================
// PROTECTED USER ROUTES
// ===============================

router.get("/me", authenticateToken, getCurrentUser);


// ===============================
// ADMIN ROUTE
// ===============================

router.get(
    "/admin",
    authenticateToken,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Admin access verified",
            data: { user: req.user }
        });
    }
);


module.exports = router;
