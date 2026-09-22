(() => {
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatBody = document.getElementById("chatBody");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const clearChatBtn = document.getElementById("clearChatBtn");
    const loginNotice = document.getElementById("loginNotice");
    const promptButtons = document.querySelectorAll(".prompt-chip");

    let currentConversationId = null;

    function addMessage(message, type) {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
        return messageElement;
    }

    function setBusy(isBusy) {
        chatInput.disabled = isBusy;
        sendMessageBtn.disabled = isBusy;
    }

    async function sendMessage(event) {
        event.preventDefault();

        const message = chatInput.value.trim();
        const token = localStorage.getItem("token");

        loginNotice.hidden = true;

        if (!message || sendMessageBtn.disabled) {
            return;
        }

        if (!token) {
            loginNotice.hidden = false;
            addMessage("Please sign in before chatting with the Wellness Assistant.", "bot");
            return;
        }

        addMessage(message, "user");
        chatInput.value = "";
        setBusy(true);
        const typingMessage = addMessage("Wellness Assistant is typing...", "bot");
        typingMessage.classList.add("typing-message");

        try {
            if (!currentConversationId) {
                const conversation = await wellnessApiRequest("/chat/conversations", {
                    method: "POST"
                });
                currentConversationId = conversation.conversation.id;
            }

            const response = await fetch(
                `http://localhost:5000/api/chat/conversations/${currentConversationId}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ message })
                }
            );

            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not get AI response");
            }

            typingMessage.remove();
            addMessage(data.data.assistantMessage.message, "bot");
        } catch (error) {
            console.error("Chat request failed:", error);
            typingMessage.remove();
            addMessage(
                error.message === "Authorization token is required" ||
                error.message === "Invalid or expired token" ||
                error.message === "Invalid token" ||
                error.message === "Token has expired"
                    ? "Your session has expired. Please sign in again before chatting."
                    : "Sorry, I couldn't connect to the Wellness Assistant. Please try again.",
                "bot"
            );
        } finally {
            setBusy(false);
            chatInput.focus();
        }
    }

    function clearChat() {
        currentConversationId = null;
        chatBody.replaceChildren();
        addMessage("Hi! I am your Wellness Assistant. How are you feeling today?", "bot");
        loginNotice.hidden = true;
        chatInput.focus();
    }

    function usePrompt(event) {
        chatInput.value = event.currentTarget.dataset.prompt;
        chatInput.focus();
    }

    const topic = new URLSearchParams(window.location.search).get("topic");
    if (topic) {
        chatInput.value = `I want to talk about ${topic.toLowerCase()}.`;
        chatInput.focus();
    }

    chatForm.addEventListener("submit", sendMessage);
    clearChatBtn.addEventListener("click", clearChat);
    promptButtons.forEach(button => button.addEventListener("click", usePrompt));
    chatInput.focus();
})();
