const express = require("express");

const router = express.Router();

const {
    authenticateToken,
} = require("../middleware/auth.middleware");

const {
    createConversation,
    getConversations,
    getMessages,
    sendMessage,
    deleteConversation,
} = require("../controllers/chat.controller");


// ========================================
// ALL CHAT ROUTES REQUIRE AUTHENTICATION
// ========================================

router.use(authenticateToken);


// Create a new conversation
router.post(
    "/conversations",
    createConversation
);


// Get all conversations of logged-in user
router.get(
    "/conversations",
    getConversations
);


// Get all messages from a conversation
router.get(
    "/conversations/:id/messages",
    getMessages
);


// Send a message
router.post(
    "/conversations/:id/messages",
    sendMessage
);


// Delete a conversation
router.delete(
    "/conversations/:id",
    deleteConversation
);


module.exports = router;