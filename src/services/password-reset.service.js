const { sendEmail } = require("../utils/email");

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
    console.log("📧 Starting password reset email");
    console.log("📧 Recipient:", to);
    console.log("📧 Reset URL:", resetUrl);

    const safeName = escapeHtml(name || "there");

    const text = [
        `Hi ${name || "there"},`,
        "",
        "We received a request to reset your Wellness App password.",
        `Reset your password: ${resetUrl}`,
        "",
        "This link expires in 15 minutes.",
        "If you did not request it, you can safely ignore this email."
    ].join("\n");

    const html = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>Hi ${safeName},</p>

            <p>
                We received a request to reset your
                Wellness App password.
            </p>

            <p>
                <a href="${resetUrl}">
                    Reset your password
                </a>
            </p>

            <p>
                This link expires in 15 minutes.
                If you did not request it, you can safely ignore this email.
            </p>

            <p>
                Thanks,<br>
                Wellness App Team
            </p>
        </body>
        </html>
    `;

    console.log("📧 Calling sendEmail()...");

    const result = await sendEmail(
        to,
        "Reset your Wellness App password",
        text,
        html
    );

    console.log("✅ Password reset email sent:", result.messageId);

    return result;
};

// IMPORTANT: export the function directly
module.exports = sendPasswordResetEmail;