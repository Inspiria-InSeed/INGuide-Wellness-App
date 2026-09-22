(function initializeGlobalNavigation() {
    const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();
    const isDashboard = currentPath.includes("/dashboard.html");
    const isSupportPage = ["/support.html", "/chatbot.html", "/community.html", "/professional"].some(path => currentPath.includes(path));
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const displayName = user?.name || user?.fullName || "Kishore";

    if (!isDashboard && !document.querySelector(".global-navigation-sidebar")) {
        document.body.classList.add("has-global-navigation");
        document.body.classList.toggle("support-page", isSupportPage);
        const existingSidebar = document.querySelector("aside.sidebar");
        const existingHeader = document.querySelector("main > header");
        const heading = existingHeader?.querySelector("h1")?.textContent.trim() || "Wellness";
        const subtitle = existingHeader?.querySelector("p")?.textContent.trim() ||
            "Take a deep breath and make today a good one.";
        const searchInput = existingHeader?.querySelector("input");

        existingSidebar?.remove();
        existingHeader?.remove();

        document.body.insertAdjacentHTML("afterbegin", createGlobalSidebar(isSupportPage));

        const main = document.querySelector("main");
        if (main) {
            main.insertAdjacentHTML("afterbegin", createGlobalTopbar(heading, subtitle));
            if (searchInput) {
                const globalSearch = document.querySelector("#globalSearchInput");
                globalSearch.replaceWith(searchInput);
                searchInput.id = searchInput.id || "globalSearchInput";
                searchInput.classList.add("global-search-input");
            }
        }
    }

    document.querySelectorAll(".profile-button strong, #userName, #profileMenuName").forEach(element => {
        element.textContent = element.id === "userName" ? `${displayName}!` : displayName;
    });

    if (isDashboard) return;

    setupGlobalNavigationActions();
})();

function createGlobalSidebar(isSupportPage = false) {
    return `
        <aside class="global-navigation-sidebar">
            <div class="brand">
                <div class="brand-mark">🌸</div>
                <div><h2>Wellness</h2><p>Better mind, better you</p></div>
            </div>
            <nav class="side-nav" aria-label="Primary navigation">
                <button class="nav-item" data-page="Dashboard"><span class="nav-icon">⌂</span><span>${isSupportPage ? "Home" : "Dashboard"}</span></button>
                <button class="nav-item" data-page="Mood, Journal & Progress"><span class="nav-icon">▤</span><span>${isSupportPage ? "Check In" : "Mood, Journal &<br>Progress"}</span></button>
                <button class="nav-item" data-page="Relax & Activities"><span class="nav-icon">♧</span><span>${isSupportPage ? "Explore" : "Relax & Activities"}</span></button>
                <button class="nav-item" data-page="Support & Guidance"><span class="nav-icon">♡</span><span>${isSupportPage ? "Support" : "Support & Guidance"}</span></button>
                <button class="nav-item" data-page="Wellness Resources"><span class="nav-icon">▣</span><span>${isSupportPage ? "Resources" : "Wellness Resources"}</span></button>
                <button class="nav-item" data-page="Reminders, Habits & Profile"><span class="nav-icon">♙</span><span>${isSupportPage ? "My Wellness" : "Reminders, Habits<br>& Profile"}</span></button>
            </nav>
            <div class="sidebar-spacer"></div>
            <div class="motivation-card"><div class="motivation-text">You're one<br>step closer to<br>a better you.</div><div class="mountains">⌁<br>◢▲◣</div><div class="sun"></div></div>
            <div class="help-card"><strong>Need help?</strong><p>Talk to our AI Assistant</p><button id="chatBtn" class="chat-btn" type="button">▢ &nbsp; Chat Now</button></div>
        </aside>`;
}

function createGlobalTopbar(heading, subtitle) {
    return `
        <header class="global-navigation-topbar">
            <div><h1>${heading}</h1><p>${subtitle}</p></div>
            <div class="top-actions">
                <div class="search-box"><input id="globalSearchInput" type="text" placeholder="Search anything..."><span>⌕</span></div>
                <div class="notification-wrapper">
                    <button class="icon-btn notification-btn" id="notificationBtn" type="button" aria-label="Open notifications">🔔<b id="notificationCount">3</b></button>
                    <div class="notification-dropdown" id="notificationDropdown">
                        <div class="notification-header"><div><h3>Notifications</h3><span id="notificationSubtitle">You have 3 unread notifications</span></div><button id="markAllRead" class="mark-read-btn" type="button">Mark all read</button></div>
                        <div class="notification-list" id="notificationList">
                            <div class="notification-item unread" data-id="water"><div class="notification-icon water">💧</div><div class="notification-content"><strong>Drink Water Reminder</strong><p>Time to drink some water and stay hydrated.</p><small>09:00 AM</small></div><button class="notification-read-btn" title="Mark as read">✓</button></div>
                            <div class="notification-item unread" data-id="study"><div class="notification-icon study">📚</div><div class="notification-content"><strong>Study Break</strong><p>Take a short break and refresh your mind.</p><small>11:30 AM</small></div><button class="notification-read-btn" title="Mark as read">✓</button></div>
                            <div class="notification-item unread" data-id="meditation"><div class="notification-icon meditation">🌿</div><div class="notification-content"><strong>Evening Meditation</strong><p>Spend 7 minutes relaxing your mind and body.</p><small>06:00 PM</small></div><button class="notification-read-btn" title="Mark as read">✓</button></div>
                        </div>
                        <div class="notification-footer"><button id="viewAllNotifications" type="button">View all notifications →</button></div>
                    </div>
                </div>
                <div class="profile-wrapper"><button class="profile-btn" id="profileBtn" type="button" aria-label="Open profile menu"><div class="avatar">👨🏻‍💻</div><span class="profile-arrow">⌄</span></button><div class="profile-dropdown" id="profileDropdown"><div class="profile-dropdown-header"><div class="profile-dropdown-avatar">👨🏻‍💻</div><div><strong id="profileMenuName">Kishore</strong><span>BCA Student</span></div></div><div class="profile-menu-list"><button class="profile-menu-item"><span>👤</span><span>View Profile</span></button><button class="profile-menu-item"><span>✏️</span><span>Edit Profile</span></button><button class="profile-menu-item"><span>📊</span><span>Wellness Summary</span></button><button class="profile-menu-item"><span>⚙️</span><span>Settings</span></button></div><div class="profile-menu-footer"><button class="profile-menu-item logout-item" id="logoutBtn"><span>🚪</span><span>Logout</span></button></div></div></div>
            </div>
        </header>`;
}

function setupGlobalNavigationActions() {
    const routes = {
        Dashboard: "dashboard.html",
        "Mood, Journal & Progress": "mood.html",
        "Support & Guidance": "support.html",
        "Relax & Activities": "support.html",
        "Wellness Resources": "resources.html",
        "Reminders, Habits & Profile": "dashboard.html"
    };
    const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();

    document.querySelectorAll(".global-navigation-sidebar .nav-item").forEach(item => {
        const page = item.dataset.page;
        const active = (page === "Dashboard" && currentPath.includes("/dashboard.html"))
            || (page === "Mood, Journal & Progress" && currentPath.includes("/mood.html"))
            || (page === "Wellness Resources" && currentPath.includes("/resources.html"))
            || (page === "Support & Guidance" && currentPath.includes("/support.html"));
        item.classList.toggle("active", active);
        item.addEventListener("click", () => { window.location.href = routes[page]; });
    });

    const notificationButton = document.getElementById("notificationBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const profileButton = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    const chatButton = document.getElementById("chatBtn");
    notificationButton?.addEventListener("click", event => { event.stopPropagation(); notificationDropdown?.classList.toggle("show"); profileDropdown?.classList.remove("show"); });
    profileButton?.addEventListener("click", event => { event.stopPropagation(); profileDropdown?.classList.toggle("show"); notificationDropdown?.classList.remove("show"); });
    chatButton?.addEventListener("click", () => {
        window.location.href = "chatbot.html";
    });
    document.addEventListener("click", () => { notificationDropdown?.classList.remove("show"); profileDropdown?.classList.remove("show"); });
    document.getElementById("logoutBtn")?.addEventListener("click", () => { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href = "login.html"; });
}