const express = require("express");
const { testEmail } = require("../controllers/email.controller");

const router = express.Router();

router.post("/test-email", testEmail);

module.exports = router;