const nodemailer = require("nodemailer");

// Check that the required environment variables are loaded.
// Never print the actual password.
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
    "EMAIL_APP_PASSWORD exists:",
    !!process.env.EMAIL_APP_PASSWORD
);

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

// Verify Gmail SMTP connection when the server starts
transporter.verify()
    .then(() => {
        console.log("✅ Gmail SMTP authentication successful");
    })
    .catch((error) => {
        console.error("❌ Gmail SMTP authentication failed:");
        console.error(error.message);
    });

// Send email
async function sendEmail(to, subject, text, html = null) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    // Add HTML version if provided
    if (html) {
        mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);

    return info;
}

module.exports = {
    transporter,
    sendEmail,
};