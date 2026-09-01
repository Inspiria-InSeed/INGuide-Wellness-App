const { sendTestEmail } = require("../services/email.services");

async function testEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    await sendTestEmail(email);

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
}

module.exports = {
  testEmail,
};
