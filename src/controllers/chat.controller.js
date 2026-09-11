const db = require("../config/db");

const {
    generateWellnessResponse,
} = require("../services/ai.service");


// ========================================
// CREATE NEW CONVERSATION
// ========================================

const createConversation = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            `INSERT INTO conversations (user_id, title)
             VALUES ($1, $2)
             RETURNING *`,
            [
                userId,
                "New Conversation",
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: {
                conversation: result.rows[0],
            },
        });

    } catch (error) {

        console.error(
            "Create conversation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Could not create conversation",
        });
    }
};


// ========================================
// GET ALL USER CONVERSATIONS
// ========================================

const getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            `SELECT
                id,
                title,
                created_at,
                updated_at
             FROM conversations
             WHERE user_id = $1
             ORDER BY updated_at DESC`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            data: {
                conversations: result.rows,
            },
        });

    } catch (error) {

        console.error(
            "Get conversations error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Could not retrieve conversations",
        });
    }
};


// ========================================
// GET ALL MESSAGES OF A CONVERSATION
// ========================================

const getMessages = async (req, res) => {
    try {
        const userId = req.user.userId;

        const conversationId =
            Number(req.params.id);

        // Validate conversation ID
        if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid conversation ID",
            });
        }

        // Check whether conversation belongs to user
        const conversationResult =
            await db.query(
                `SELECT id
                 FROM conversations
                 WHERE id = $1
                 AND user_id = $2`,
                [
                    conversationId,
                    userId,
                ]
            );

        if (
            conversationResult.rows.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Conversation not found",
            });
        }

        // Get messages
        const messagesResult =
            await db.query(
                `SELECT
                    id,
                    sender,
                    message,
                    created_at
                 FROM messages
                 WHERE conversation_id = $1
                 ORDER BY created_at ASC`,
                [conversationId]
            );

        return res.status(200).json({
            success: true,

            data: {
                conversationId,
                messages:
                    messagesResult.rows,
            },
        });

    } catch (error) {

        console.error(
            "Get messages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Could not retrieve messages",
        });
    }
};


// ========================================
// SEND MESSAGE AND GET AI RESPONSE
// ========================================

const sendMessage = async (req, res) => {
    try {

        const userId = req.user.userId;

        const conversationId =
            Number(req.params.id);

        const message =
            typeof req.body.message === "string"
                ? req.body.message.trim()
                : "";

        // Validate conversation ID
        if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid conversation ID",
            });
        }

        // Validate message
        if (!message) {
            return res.status(400).json({
                success: false,
                message:
                    "Message is required",
            });
        }

        // Prevent extremely large messages
        if (message.length > 5000) {
            return res.status(400).json({
                success: false,
                message:
                    "Message is too long",
            });
        }

        // ========================================
        // VERIFY CONVERSATION OWNERSHIP
        // ========================================

        const conversationResult =
            await db.query(
                `SELECT id
                 FROM conversations
                 WHERE id = $1
                 AND user_id = $2`,
                [
                    conversationId,
                    userId,
                ]
            );

        if (
            conversationResult.rows.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Conversation not found",
            });
        }


        // ========================================
        // SAVE USER MESSAGE
        // ========================================

        const userMessageResult =
            await db.query(
                `INSERT INTO messages
                    (
                        conversation_id,
                        sender,
                        message
                    )
                 VALUES ($1, $2, $3)
                 RETURNING
                    id,
                    conversation_id,
                    sender,
                    message,
                    created_at`,
                [
                    conversationId,
                    "user",
                    message,
                ]
            );

        const userMessage =
            userMessageResult.rows[0];


        // ========================================
        // GET RECENT CONVERSATION HISTORY
        // ========================================

        const historyResult =
            await db.query(
                `SELECT
                    sender,
                    message
                 FROM (
                    SELECT
                        sender,
                        message,
                        created_at
                    FROM messages
                    WHERE conversation_id = $1
                    ORDER BY created_at DESC
                    LIMIT 20
                 ) AS recent_messages
                 ORDER BY created_at ASC`,
                [conversationId]
            );

        // Remove the current user message because
        // it will be sent separately to the AI service
        const conversationHistory =
            historyResult.rows.filter(
                (item) =>
                    item.message !== message ||
                    item.sender !== "user"
            );


        // ========================================
        // GENERATE AI RESPONSE
        // ========================================

        const assistantResponse =
            await generateWellnessResponse(
                message,
                conversationHistory
            );


        // ========================================
        // SAVE AI RESPONSE
        // ========================================

        const assistantMessageResult =
            await db.query(
                `INSERT INTO messages
                    (
                        conversation_id,
                        sender,
                        message
                    )
                 VALUES ($1, $2, $3)
                 RETURNING
                    id,
                    conversation_id,
                    sender,
                    message,
                    created_at`,
                [
                    conversationId,
                    "assistant",
                    assistantResponse,
                ]
            );

        const assistantMessage =
            assistantMessageResult.rows[0];


        // ========================================
        // UPDATE CONVERSATION TIMESTAMP
        // ========================================

        await db.query(
            `UPDATE conversations
             SET updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [conversationId]
        );


        // ========================================
        // RETURN RESPONSE
        // ========================================

        return res.status(201).json({
            success: true,

            data: {
                userMessage,
                assistantMessage,
            },
        });

    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Could not generate a response",
        });
    }
};


// ========================================
// DELETE CONVERSATION
// ========================================

const deleteConversation = async (req, res) => {
    try {

        const userId = req.user.userId;

        const conversationId =
            Number(req.params.id);

        // Validate ID
        if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid conversation ID",
            });
        }

        // Delete only if conversation belongs to user
        const result =
            await db.query(
                `DELETE FROM conversations
                 WHERE id = $1
                 AND user_id = $2
                 RETURNING id`,
                [
                    conversationId,
                    userId,
                ]
            );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Conversation not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Conversation deleted successfully",
        });

    } catch (error) {

        console.error(
            "Delete conversation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Could not delete conversation",
        });
    }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    createConversation,
    getConversations,
    getMessages,
    sendMessage,
    deleteConversation,
};