/* ============================================
   SUPPORT PAGE JAVASCRIPT
   ============================================ */


/* ============================================
   INITIALIZE LUCIDE ICONS
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    if (window.lucide) {
        lucide.createIcons();
    }

});


/* ============================================
   GET ELEMENTS
============================================ */

const startChatBtn =
    document.getElementById("startChatBtn");

const toast =
    document.getElementById("toast");

const notificationBtn =
    document.getElementById("notificationBtn");

const professionalBtn =
    document.getElementById("professionalBtn");

const communityBtn =
    document.getElementById("communityBtn");

const helplineBtn =
    document.getElementById("helplineBtn");


/* ============================================
   TOAST NOTIFICATION
============================================ */

let toastTimer;

function showToast(message) {

    if (!toast) return;

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ============================================
   OPEN STANDALONE CHAT PAGE
============================================ */

if (startChatBtn) {

    startChatBtn.addEventListener("click", () => {

        window.location.href = "chatbot.html";

    });

}


/* ============================================
   TOPIC BUTTONS
============================================ */

const topicButtons =
    document.querySelectorAll(
        ".topic-btn"
    );


topicButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {


            /* ------------------------------
               GET TOPIC
            ------------------------------ */

            const topicElement =
                button.querySelector(
                    "span"
                );


            const topic =
                topicElement

                    ?

                topicElement
                    .textContent
                    .trim()

                    :

                button
                    .textContent
                    .trim();


            window.location.href =
                `chatbot.html?topic=${encodeURIComponent(topic)}`;

        }
    );

});


/* ============================================
   PROFESSIONAL SUPPORT
============================================ */

if (professionalBtn) {

    professionalBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "professional-support.html";

        }
    );

}


/* ============================================
   COMMUNITY
============================================ */

if (communityBtn) {

    communityBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "community.html";

        }
    );

}


/* ============================================
   HELPLINES
============================================ */

if (helplineBtn) {

    helplineBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Opening emergency and support helplines..."
            );

        }
    );

}


/* ============================================
   NOTIFICATION BUTTON
============================================ */

if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        () => {


            const badge =
                notificationBtn.querySelector(
                    ".notification-badge"
                );


            if (badge) {

                badge.style.display =
                    "none";

            }


            showToast(
                "You have checked all your notifications."
            );

        }
    );

}


/* ============================================
   NAVIGATION
============================================ */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach((item) => {

    item.addEventListener(
        "click",
        (event) => {

            /*
             * We do NOT use preventDefault()
             * here because your navigation links
             * should actually open their pages.
             */

            navItems.forEach(
                (navItem) => {

                    navItem.classList.remove(
                        "active"
                    );

                }
            );


            item.classList.add(
                "active"
            );

        }
    );

});