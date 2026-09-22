const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const db = require("../config/db");
const sendPasswordResetEmail = require("../services/password-reset.service");

const googleClient = new OAuth2Client();

// ===============================
// JWT
// ===============================

const signToken = (user) =>
    jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        }
    );

const normalizedRole = (role) =>
    String(role || "user").trim().toLowerCase() === "admin"
        ? "admin"
        : "user";

// ===============================
// REGISTER
// ===============================

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const normalizedName =
            typeof name === "string" ? name.trim() : "";

        const normalizedEmail =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        // Validate input
        if (!normalizedName || !normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (normalizedName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be 100 characters or fewer",
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        // Check existing user
        const existingResult = await db.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        const existingUsers = existingResult.rows;

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const result = await db.query(
            `INSERT INTO users
                (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'user')
             RETURNING id`,
            [
                normalizedName,
                normalizedEmail,
                passwordHash,
            ]
        );

        const userId = result.rows[0].id;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                userId,
                name: normalizedName,
                email: normalizedEmail,
                role: "user",
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ===============================
// LOGIN
// ===============================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        if (
            !normalizedEmail ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const result = await db.query(
            `SELECT
                id,
                name,
                email,
                password_hash,
                role,
                is_active
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        const users = result.rows;

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = users[0];
        const role = normalizedRole(user.role);

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive",
            });
        }

        // Google-only account
        if (!user.password_hash) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = signToken({
            id: user.id,
            role,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ===============================
// FORGOT PASSWORD
// ===============================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const normalizedEmail =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        // Validate email
        if (!normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const result = await db.query(
            `SELECT
                id,
                name,
                email,
                is_active
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        const users = result.rows;

        console.log("=================================");
        console.log("🔎 FORGOT PASSWORD");
        console.log("📧 Email:", normalizedEmail);
        console.log("👤 Users found:", users.length);

        const successMessage =
            "If an account exists with this email, password reset instructions will be sent";

        // Do not reveal whether account exists
        if (users.length === 0) {
            console.log("⚠️ User not found");

            return res.status(200).json({
                success: true,
                message: successMessage,
            });
        }

        const user = users[0];

        console.log("👤 User ID:", user.id);
        console.log("👤 User name:", user.name);
        console.log("👤 User active:", user.is_active);

        // Do not send reset email to inactive accounts
        if (!user.is_active) {
            console.log("⚠️ User is inactive");

            return res.status(200).json({
                success: true,
                message: successMessage,
            });
        }

        // ===============================
        // GENERATE RESET TOKEN
        // ===============================

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        // Hash token before saving
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token expires after 15 minutes
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        // Save hashed token
        await db.query(
            `UPDATE users
             SET
                reset_token = $1,
                reset_token_expires = $2
             WHERE id = $3`,
            [
                hashedToken,
                expiresAt,
                user.id,
            ]
        );

        console.log("✅ Reset token saved");
        console.log("⏰ Expires:", expiresAt);

        // ===============================
        // CREATE RESET URL
        // ===============================

        const frontendUrl = (
            process.env.FRONTEND_URL ||
            "http://127.0.0.1:5500"
        ).trim().replace(/\/+$/, "");

        const resetUrl =
            `${frontendUrl}/reset-password.html?token=${encodeURIComponent(resetToken)}`;

        console.log("🌐 FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("🔗 FINAL RESET URL:", resetUrl);

        // ===============================
        // SEND EMAIL
        // ===============================

        try {
            console.log("📧 Sending password reset email...");
            console.log("📧 To:", user.email);

            await sendPasswordResetEmail({
                to: user.email,
                name: user.name,
                resetUrl,
            });

            console.log("✅ Password reset email sent successfully");
        } catch (emailError) {
            console.error(
                "❌ Password reset email error:",
                emailError
            );

            // Remove token if email failed
            await db.query(
                `UPDATE users
                 SET
                    reset_token = NULL,
                    reset_token_expires = NULL
                 WHERE id = $1`,
                [user.id]
            );

            return res.status(500).json({
                success: false,
                message: "Password reset email could not be sent",
            });
        }

        console.log("=================================");

        return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.error("❌ Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ===============================
// RESET PASSWORD
// ===============================

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (
            typeof token !== "string" ||
            !token ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A valid reset token and a password of at least 8 characters are required",
            });
        }

        // Hash received token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find valid user/token
        const result = await db.query(
            `SELECT id
             FROM users
             WHERE
                reset_token = $1
                AND reset_token_expires > NOW()
                AND is_active = TRUE`,
            [hashedToken]
        );

        const users = result.rows;

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "This password reset link is invalid or has expired",
            });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        // Update password and invalidate token
        await db.query(
            `UPDATE users
             SET
                password_hash = $1,
                reset_token = NULL,
                reset_token_expires = NULL
             WHERE id = $2`,
            [
                passwordHash,
                users[0].id,
            ]
        );

        console.log(
            "✅ Password reset successful for user:",
            users[0].id
        );

        return res.status(200).json({
            success: true,
            message:
                "Password reset successful. You can now sign in.",
        });
    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ===============================
// GOOGLE LOGIN / REGISTRATION
// ===============================

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error(
                "GOOGLE_CLIENT_ID is not configured"
            );

            return res.status(503).json({
                success: false,
                message:
                    "Google sign-in is not configured",
            });
        }

        if (
            typeof credential !== "string" ||
            !credential
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Google credential is required",
            });
        }

        const ticket =
            await googleClient.verifyIdToken({
                idToken: credential,
                audience:
                    process.env.GOOGLE_CLIENT_ID,
            });

        const payload = ticket.getPayload();

        if (
            !payload.email ||
            !payload.email_verified ||
            !payload.sub
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Google account email is not verified",
            });
        }

        const email =
            payload.email.trim().toLowerCase();

        const name = (
            payload.name ||
            email.split("@")[0]
        )
            .trim()
            .slice(0, 100);

        const result = await db.query(
            `SELECT
                id,
                name,
                email,
                role,
                is_active,
                google_id
             FROM users
             WHERE email = $1`,
            [email]
        );

        const users = result.rows;
        let user;

        if (users.length > 0) {
            user = users[0];

            if (!user.is_active) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Your account is inactive",
                });
            }

            if (!user.google_id) {
                await db.query(
                    `UPDATE users
                     SET google_id = $1
                     WHERE id = $2`,
                    [
                        payload.sub,
                        user.id,
                    ]
                );

                // Update local user object as well
                user.google_id = payload.sub;
            } else if (
                user.google_id !== payload.sub
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This email is already linked to another Google account",
                });
            }
        } else {
            const insertResult = await db.query(
                `INSERT INTO users
                    (name, email, google_id, role, is_active)
                 VALUES ($1, $2, $3, 'user', TRUE)
                 RETURNING id`,
                [
                    name,
                    email,
                    payload.sub,
                ]
            );

            user = {
                id: insertResult.rows[0].id,
                name,
                email,
                role: "user",
                is_active: true,
                google_id: payload.sub,
            };
        }

        const role = normalizedRole(user.role);

        return res.status(200).json({
            success: true,
            message:
                "Google sign-in successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role,
                },
                token: signToken({
                    id: user.id,
                    role,
                }),
            },
        });
    } catch (error) {
        console.error(
            "Google sign-in error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Google sign-in could not be verified",
        });
    }
};

// ===============================
// CURRENT VERIFIED USER
// ===============================

const getCurrentUser = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT
                id,
                name,
                email,
                role,
                is_active
             FROM users
             WHERE id = $1`,
            [req.user.userId]
        );

        const users = result.rows;

        if (
            users.length === 0 ||
            !users[0].is_active
        ) {
            return res.status(401).json({
                success: false,
                message: "Account is unavailable",
            });
        }

        const user = users[0];

        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error(
            "Get current user error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ===============================
// EXPORT
// ===============================

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    googleLogin,
    getCurrentUser,
};