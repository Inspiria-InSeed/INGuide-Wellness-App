const { sendEmail } = require("../utils/email");

async function sendTestEmail(to) {
  await sendEmail(
    to,
    "Wellness App - Test Email",
    "This is a test email from your Wellness App backend."
  );
}

module.exports = {
  sendTestEmail,
};