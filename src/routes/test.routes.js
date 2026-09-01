const express = require("express");

const {
    authenticateToken
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/protected", authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});

module.exports = router;