const publicMessages = [
    {
        user: "Anonymous Student #24",
        message: "I've been feeling a little stressed about my upcoming exams. Does anyone have any tips for managing it?",
        time: "2 min ago",
        type: "received",
        reactions: { heart: 4, like: 2 }
    },
    {
        user: "Wellness Friend #52",
        message: "Taking small breaks really helps me. I usually do a few breathing exercises when I start feeling overwhelmed.",
        time: "5 min ago",
        type: "received",
        reactions: { heart: 8, like: 5 }
    }
];

const privateChats = {};
let currentChatType = "public";
let selectedPrivateUser = null;

document.addEventListener("DOMContentLoaded", () => {
    loadSavedMessages();
    setupNavigation();
    setupChat();
    setupInteractions();
    setupLogout();
    renderChat();
});

function loadSavedMessages() {
    const savedMessages = JSON.parse(
        localStorage.getItem("communityPublicMessages") || "null"
    );

    if (Array.isArray(savedMessages)) {
        publicMessages.push(...savedMessages.filter(message => message.user === "You"));
    }
}

function setupNavigation() {
    document.getElementById("backBtn")?.addEventListener("click", () => {
        window.history.back();
    });

    document.querySelectorAll(".community-nav-item").forEach(button => {
        button.addEventListener("click", () => {
            const section = button.dataset.section;

            if (section === "public" || section === "private") {
                currentChatType = section;
                document.querySelectorAll(".community-nav-item").forEach(item => {
                    item.classList.toggle("active", item === button);
                });
                renderChat();
                return;
            }

            const target = section === "sessions"
                ? ".upcoming-session-card"
                : section === "guidelines"
                    ? ".community-reminder-card"
                    : null;

            if (target) {
                document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
            } else {
                showToast("Questions and answers will be available soon.");
            }
        });
    });
}

function setupChat() {
    const input = document.getElementById("chatInput");
    const sendButton = document.getElementById("sendMessageBtn");
    const emojiButton = document.getElementById("emojiBtn");

    sendButton?.addEventListener("click", sendMessage);
    input?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    emojiButton?.addEventListener("click", () => {
        if (input) {
            input.value += " 🙂";
            input.focus();
        }
    });
}

function renderChat() {
    const content = document.getElementById("chatContent");
    const title = document.getElementById("chatTitle");
    const description = document.getElementById("chatDescription");
    const input = document.getElementById("chatInput");

    if (!content || !title || !description || !input) {
        return;
    }

    if (currentChatType === "private") {
        title.textContent = "Private Conversation";
        description.textContent = selectedPrivateUser
            ? `A private conversation with ${selectedPrivateUser}.`
            : "Choose a community member to start a private conversation.";
        input.placeholder = selectedPrivateUser
            ? `Message ${selectedPrivateUser}...`
            : "Choose a member from the right panel first...";
        renderPrivateChat(content);
        return;
    }

    title.textContent = "Public Community Chat";
    description.textContent = "Share your thoughts and support other students anonymously.";
    input.placeholder = "Share something with the community...";
    content.innerHTML = createWelcomeMessage();

    publicMessages.forEach(message => {
        content.appendChild(createMessageElement(message));
    });

    scrollChatToBottom();
}

function renderPrivateChat(content) {
    content.innerHTML = createWelcomeMessage(
        selectedPrivateUser
            ? `Private conversation with ${selectedPrivateUser}.`
            : "Choose a member from the right panel to start chatting."
    );

    if (selectedPrivateUser) {
        (privateChats[selectedPrivateUser] || []).forEach(message => {
            content.appendChild(createMessageElement(message));
        });
    }

    scrollChatToBottom();
}

function createWelcomeMessage(message = "Be kind, respectful and supportive. You can share anonymously.") {
    return `
        <div class="community-welcome">
            <div class="welcome-icon"><i class="fa-solid fa-heart"></i></div>
            <div>
                <h3>Welcome to the Community</h3>
                <p>${message}</p>
            </div>
        </div>
    `;
}

function createMessageElement(message) {
    const element = document.createElement("div");
    const isOwnMessage = message.type === "sent";
    const reactions = message.reactions || { heart: 0, like: 0 };

    element.className = `community-message${isOwnMessage ? " own-message" : ""}`;
    element.innerHTML = `
        ${isOwnMessage ? "" : `<div class="message-avatar avatar-green"><i class="fa-solid fa-user"></i></div>`}
        <div class="message-body">
            <div class="message-user-info">
                <strong>${escapeHTML(message.user)}</strong>
                <span>${escapeHTML(message.time)}</span>
            </div>
            <div class="message-bubble">${escapeHTML(message.message)}</div>
            <div class="message-actions">
                <button class="reaction-btn" data-reaction="heart"><i class="fa-regular fa-heart"></i><span>${reactions.heart}</span></button>
                <button class="reaction-btn" data-reaction="like"><i class="fa-regular fa-thumbs-up"></i><span>${reactions.like}</span></button>
                <button class="reply-btn"><i class="fa-regular fa-comment"></i> Reply</button>
            </div>
        </div>
    `;

    return element;
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input?.value.trim();

    if (!message) {
        return;
    }

    if (currentChatType === "private" && !selectedPrivateUser) {
        showToast("Choose a community member before sending a private message.");
        return;
    }

    const newMessage = {
        user: "You",
        message,
        time: "Just now",
        type: "sent",
        reactions: { heart: 0, like: 0 }
    };

    if (currentChatType === "private") {
        privateChats[selectedPrivateUser] ??= [];
        privateChats[selectedPrivateUser].push(newMessage);
    } else {
        publicMessages.push(newMessage);
        localStorage.setItem("communityPublicMessages", JSON.stringify(
            publicMessages.filter(item => item.user === "You")
        ));
    }

    input.value = "";
    renderChat();
}

function setupInteractions() {
    document.querySelectorAll(".message-member-btn").forEach(button => {
        button.addEventListener("click", () => {
            const member = button.closest(".community-member")?.dataset.member;
            if (member) {
                selectedPrivateUser = member;
                currentChatType = "private";
                document.querySelector('[data-section="private"]')?.click();
            }
        });
    });

    document.getElementById("sessionDetailsBtn")?.addEventListener("click", () => {
        showToast("Session details are available in Upcoming Sessions.");
    });

    document.getElementById("guidelinesBtn")?.addEventListener("click", () => {
        showToast("Please stay kind, respectful, and protect personal information.");
    });

    document.getElementById("chatContent")?.addEventListener("click", event => {
        const reaction = event.target.closest(".reaction-btn");
        const reply = event.target.closest(".reply-btn");

        if (reaction) {
            reaction.classList.toggle("active");
            const count = reaction.querySelector("span");
            if (count) {
                count.textContent = String(Number(count.textContent) + (reaction.classList.contains("active") ? 1 : -1));
            }
        }

        if (reply) {
            const input = document.getElementById("chatInput");
            const author = reply.closest(".community-message")?.querySelector(".message-user-info strong")?.textContent;
            if (input) {
                input.value = author ? `@${author} ` : "";
                input.focus();
            }
        }
    });
}

function setupLogout() {
    document.getElementById("logoutBtn")?.addEventListener("click", event => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to logout?")) {
            window.location.href = "login.html";
        }
    });
}

function showToast(message) {
    const toast = document.getElementById("communityToast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function scrollChatToBottom() {
    const content = document.getElementById("chatContent");
    if (content) {
        content.scrollTop = content.scrollHeight;
    }
}

function escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
