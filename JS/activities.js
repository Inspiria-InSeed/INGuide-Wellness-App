/* =====================================================
   WELLNESS DASHBOARD
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   TOAST FUNCTION
===================================================== */

const toast = (message) => {

    const element =
        document.getElementById("toast");

    element.textContent = message;

    element.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {

            element.classList.remove("show");

        }, 2400);

};

let selectedDashboardMood = "Good";
let selectedDashboardSleep = "Good";



/* =====================================================
   SIDEBAR NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener("click", () => {

            /*
                Remove active class
                from all navigation items
            */

            document
                .querySelectorAll(".nav-item")
                .forEach(nav => {

                    nav.classList.remove("active");

                });


            /*
                Add active class
                to clicked item
            */

            item.classList.add("active");


            /*
                OPEN MOOD, JOURNAL & PROGRESS PAGE
            */

            if (
                item.dataset.page ===
                "Mood, Journal & Progress"
            ) {

                window.location.href =
                    "mood.html";

                return;

            }


            /*
                Other navigation items
            */

            toast(
                `${item.dataset.page} selected`
            );

        });

    });



/* =====================================================
   SLEEP RATING
===================================================== */

document
    .querySelectorAll(".rating")
    .forEach(button => {

        button.addEventListener("click", () => {

            /*
                Remove selected state
            */

            document
                .querySelectorAll(".rating")
                .forEach(item => {

                    item.classList.remove("selected");

                });


            /*
                Select clicked rating
            */

            button.classList.add("selected");

            selectedDashboardSleep = button.dataset.value;


            /*
                Show message
            */

            toast(
                `Sleep rating saved: ${button.dataset.value}`
            );

        });

    });



/* =====================================================
   MOOD SELECTION
===================================================== */

document
    .querySelectorAll(".moods button")
    .forEach(button => {

        button.addEventListener("click", () => {

            /*
                Reset all moods
            */

            document
                .querySelectorAll(".moods button")
                .forEach(item => {

                    item.style.transform = "";

                });


            /*
                Highlight selected mood
            */

            button.style.transform =
                "scale(1.25)";

            selectedDashboardMood = {
                "😟": "Stressed",
                "🙁": "Low",
                "😐": "Okay",
                "🙂": "Good",
                "😄": "Great"
            }[button.textContent.trim()] || "Good";


            toast(
                "Mood selected. Click Update Mood to save it."
            );

        });

    });



/* =====================================================
   REMINDER CHECKBOXES
===================================================== */

document
    .querySelectorAll(".check")
    .forEach(check => {

        check.addEventListener("click", () => {

            /*
                Toggle completed state
            */

            check.classList.toggle("done");


            /*
                Change check icon
            */

            if (
                check.classList.contains("done")
            ) {

                check.textContent = "✓";

                toast(
                    "Reminder completed"
                );

            } else {

                check.textContent = "";

                toast(
                    "Reminder marked incomplete"
                );

            }

        });

    });



/* =====================================================
   RECOMMENDED ACTIVITY PLAY BUTTON
===================================================== */

document
    .querySelectorAll(".play-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const title =
                button
                    .closest(".recommend-card")
                    .querySelector("h3")
                    .textContent;


            toast(
                `Starting: ${title}`
            );

        });

    });



/* =====================================================
   SLEEP CHECK-IN
===================================================== */

document
    .getElementById("sleepCheckin")
    .addEventListener("click", () => {

        window.location.href = "mood.html";

    });



/* =====================================================
   UPDATE MOOD
===================================================== */

document
    .getElementById("updateMood")
    .addEventListener("click", async () => {
        try {
            await wellnessApiRequest("/mood", {
                method: "POST",
                body: JSON.stringify({
                    mood: selectedDashboardMood,
                    sleep: selectedDashboardSleep,
                    note: ""
                })
            });

            toast("Your mood has been updated");
        } catch (error) {
            toast("Mood saved locally. Sign in or try again to sync.");
            console.warn("Dashboard mood sync failed:", error.message);
        }
    });



/* =====================================================
   ADD REMINDER
===================================================== */

const addReminder = document.getElementById("addReminder");

const reminderModal = document.getElementById("reminderModal");

const closeReminderModal =
  document.getElementById("closeReminderModal");

const cancelReminder =
  document.getElementById("cancelReminder");

const saveReminder =
  document.getElementById("saveReminder");

const reminderTitle =
  document.getElementById("reminderTitle");

const reminderHour =
  document.getElementById("reminderHour");

const reminderMinute =
  document.getElementById("reminderMinute");

const reminderPeriod =
  document.getElementById("reminderPeriod");

const reminderIcon =
  document.getElementById("reminderIcon");


/* Open modal */

addReminder?.addEventListener("click", () => {

  reminderModal.classList.add("show");

  reminderTitle.focus();

});


/* Close modal */

function closeReminderWindow() {

  reminderModal.classList.remove("show");

  reminderTitle.value = "";

  reminderHour.value = "";
  reminderMinute.value = "";
  reminderPeriod.value = "";

  reminderIcon.value = "💧";

}


closeReminderModal?.addEventListener(
  "click",
  closeReminderWindow
);


cancelReminder?.addEventListener(
  "click",
  closeReminderWindow
);


/* Close when clicking outside */

reminderModal?.addEventListener("click", (event) => {

  if (event.target === reminderModal) {

    closeReminderWindow();

  }

});


/* Convert 24-hour time to AM/PM */

function formatReminderTime(hour, minute, period) {

  return `${hour}:${minute} ${period}`;

}

/* Save reminder */

saveReminder?.addEventListener("click", () => {

  const title =
    reminderTitle.value.trim();

  const hour =
    reminderHour.value;

  const minute =
    reminderMinute.value;

  const period =
    reminderPeriod.value;

  const icon =
    reminderIcon.value;


  /* Check name */

  if (!title) {

    toast("Please enter a reminder name");

    reminderTitle.focus();

    return;

  }


  /* Check time */

  if (!hour || !minute || !period) {

  toast("Please select hour, minute and AM/PM");

  return;

}

const time =
  `${hour}:${minute} ${period}`;


  /* Create reminder */

  const reminder = document.createElement("div");

  reminder.className = "reminder";


  reminder.innerHTML = `
    <span class="r-icon">${icon}</span>

    <strong>${title}</strong>

    <time>${formatReminderTime(hour, minute, period)}</time>

    <button class="check" aria-label="Complete reminder"></button>
  `;


  /* Add reminder before Add Reminder button */

  const addButton =
    document.getElementById("addReminder");

  addButton.parentNode.insertBefore(
    reminder,
    addButton
  );


  /* Make check button functional */

  const checkButton =
    reminder.querySelector(".check");


  checkButton.addEventListener("click", () => {

    checkButton.classList.toggle("done");

    if (checkButton.classList.contains("done")) {

      checkButton.textContent = "✓";

      toast("Reminder completed");

    } else {

      checkButton.textContent = "";

      toast("Reminder marked incomplete");

    }

  });


  /* Close modal */

  closeReminderWindow();


  /* Success message */

  toast(`Reminder added: ${title}`);

});










/* =====================================================
   AI CHAT
===================================================== */

document
    .getElementById("chatBtn")
    .addEventListener("click", () => {

        toast(
            "AI Assistant opened"
        );

    });



/* =====================================================
   NOTIFICATION SYSTEM
===================================================== */


/* Elements */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

const notificationWrapper =
    document.querySelector(
        ".notification-wrapper"
    );

const notificationDropdown =
    document.getElementById(
        "notificationDropdown"
    );

const notificationList =
    document.getElementById(
        "notificationList"
    );

const notificationCount =
    document.getElementById(
        "notificationCount"
    );

const notificationSubtitle =
    document.getElementById(
        "notificationSubtitle"
    );

const markAllRead =
    document.getElementById(
        "markAllRead"
    );



/* =====================================================
   LOAD READ NOTIFICATIONS
===================================================== */

let readNotifications =
    JSON.parse(
        localStorage.getItem(
            "wellnessReadNotifications"
        )
    ) || [];



/* =====================================================
   UPDATE NOTIFICATION COUNT
===================================================== */

function updateNotificationCount() {

    const unreadItems =
        document.querySelectorAll(
            ".notification-item.unread"
        );

    const unreadCount =
        unreadItems.length;


    /* Badge */

    if (notificationCount) {

        notificationCount.textContent =
            unreadCount;

        if (unreadCount === 0) {

            notificationCount.style.display =
                "none";

        } else {

            notificationCount.style.display =
                "grid";

        }

    }


    /* Subtitle */

    if (notificationSubtitle) {

        if (unreadCount === 0) {

            notificationSubtitle.textContent =
                "You're all caught up 🎉";

        } else {

            notificationSubtitle.textContent =
                `You have ${unreadCount} unread notification${
                    unreadCount > 1
                        ? "s"
                        : ""
                }`;

        }

    }

}



/* =====================================================
   APPLY SAVED READ STATUS
===================================================== */

function loadNotificationStatus() {

    const notifications =
        document.querySelectorAll(
            ".notification-item"
        );


    notifications.forEach(
        notification => {

            const id =
                notification.dataset.id;


            if (
                readNotifications.includes(id)
            ) {

                notification.classList.remove(
                    "unread"
                );

                notification.classList.add(
                    "read"
                );

            }

        }
    );


    updateNotificationCount();

}


loadNotificationStatus();



/* =====================================================
   OPEN / CLOSE NOTIFICATION DROPDOWN
===================================================== */

notificationBtn?.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        notificationWrapper.classList.toggle(
            "active"
        );


        /* Close profile dropdown */

        const profileWrapper =
            document.querySelector(
                ".profile-wrapper"
            );

        if (profileWrapper) {

            profileWrapper.classList.remove(
                "active"
            );

        }

    }
);



/* =====================================================
   CLOSE WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            notificationWrapper &&
            !notificationWrapper.contains(
                event.target
            )
        ) {

            notificationWrapper.classList.remove(
                "active"
            );

        }

    }
);



/* =====================================================
   MARK SINGLE NOTIFICATION AS READ
===================================================== */

document
    .querySelectorAll(
        ".notification-read-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const notification =
                        button.closest(
                            ".notification-item"
                        );


                    if (!notification) {
                        return;
                    }


                    const id =
                        notification.dataset.id;


                    /* Mark read */

                    notification.classList.remove(
                        "unread"
                    );

                    notification.classList.add(
                        "read"
                    );


                    /* Save */

                    if (
                        !readNotifications.includes(
                            id
                        )
                    ) {

                        readNotifications.push(
                            id
                        );

                    }


                    localStorage.setItem(
                        "wellnessReadNotifications",
                        JSON.stringify(
                            readNotifications
                        )
                    );


                    updateNotificationCount();


                    toast(
                        "Notification marked as read ✓"
                    );

                }
            );

        }
    );



/* =====================================================
   CLICK NOTIFICATION TO MARK READ
===================================================== */

document
    .querySelectorAll(
        ".notification-item"
    )
    .forEach(
        notification => {

            notification.addEventListener(
                "click",
                event => {

                    /* Don't trigger twice
                       when clicking the check button */

                    if (
                        event.target.closest(
                            ".notification-read-btn"
                        )
                    ) {

                        return;

                    }


                    const id =
                        notification.dataset.id;


                    notification.classList.remove(
                        "unread"
                    );

                    notification.classList.add(
                        "read"
                    );


                    if (
                        !readNotifications.includes(
                            id
                        )
                    ) {

                        readNotifications.push(
                            id
                        );

                    }


                    localStorage.setItem(
                        "wellnessReadNotifications",
                        JSON.stringify(
                            readNotifications
                        )
                    );


                    updateNotificationCount();

                }
            );

        }
    );



/* =====================================================
   MARK ALL AS READ
===================================================== */

markAllRead?.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        const notifications =
            document.querySelectorAll(
                ".notification-item"
            );


        notifications.forEach(
            notification => {

                const id =
                    notification.dataset.id;


                notification.classList.remove(
                    "unread"
                );

                notification.classList.add(
                    "read"
                );


                if (
                    !readNotifications.includes(
                        id
                    )
                ) {

                    readNotifications.push(id);

                }

            }
        );


        localStorage.setItem(
            "wellnessReadNotifications",
            JSON.stringify(
                readNotifications
            )
        );


        updateNotificationCount();


        toast(
            "All notifications marked as read ✓"
        );

    }
);



/* =====================================================
   VIEW ALL NOTIFICATIONS
===================================================== */

document
    .getElementById(
        "viewAllNotifications"
    )
    ?.addEventListener(
        "click",
        () => {

            notificationWrapper.classList.remove(
                "active"
            );


            toast(
                "All notifications opened"
            );

        }
    );



/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            notificationWrapper?.classList.remove(
                "active"
            );

        }

    }
);





/* =====================================================
   PROFILE SYSTEM
===================================================== */


/* =====================================================
   PROFILE ELEMENTS
===================================================== */

const profileBtn =
    document.getElementById("profileBtn");

const profileWrapper =
    document.querySelector(".profile-wrapper");

const profileModal =
    document.getElementById("profileModal");

const editProfileModal =
    document.getElementById("editProfileModal");


/* =====================================================
   DEFAULT PROFILE
===================================================== */

const defaultProfile = {

    name: "Tapalabdha",

    email: "",

    gender: "",

    course: "BCA",

    yearSemester: "",

    college: "",

    wellnessGoal: "",

    phone: "",

    profilePicture: ""

};


/* =====================================================
   LOAD PROFILE
===================================================== */

let profileData =
    JSON.parse(
        localStorage.getItem("wellnessProfile")
    ) || defaultProfile;


/* =====================================================
   UPDATE PROFILE UI
===================================================== */

function updateProfileUI() {

    const name =
        profileData.name || "Tapalabdha";

    const email =
        profileData.email || "Not added yet";

    const gender =
        profileData.gender || "Not added yet";

    const course =
        profileData.course || "BCA";

    const yearSemester =
        profileData.yearSemester || "Not added yet";

    const college =
        profileData.college || "Not added yet";

    const wellnessGoal =
        profileData.wellnessGoal || "Not added yet";

    const phone =
        profileData.phone || "Not added yet";


    /* =========================================
       PROFILE DROPDOWN
    ========================================= */

    const menuName =
        document.getElementById("profileMenuName");

    const menuCourse =
        document.getElementById("profileMenuCourse");

    if (menuName) {
        menuName.textContent = name;
    }

    if (menuCourse) {
        menuCourse.textContent =
            course + " Student";
}


    /* =========================================
       MY PROFILE HEADER
    ========================================= */

    const displayName =
        document.getElementById("profileDisplayName");

    if (displayName) {
        displayName.textContent = name;
    }


    /* =========================================
       MY PROFILE INFORMATION
    ========================================= */

    const nameInfo =
        document.getElementById("profileNameInfo");

    const emailInfo =
        document.getElementById("profileEmailInfo");

    const genderInfo =
        document.getElementById("profileGenderInfo");

    const courseInfo =
        document.getElementById("profileCourseInfo");

    const semesterInfo =
        document.getElementById("profileSemesterInfo");

    const collegeInfo =
        document.getElementById("profileCollegeInfo");

    const goalInfo =
        document.getElementById("profileGoalInfo");

    const phoneInfo =
        document.getElementById("profilePhoneInfo");


    /* =========================================
       UPDATE PROFILE VALUES
    ========================================= */

    if (nameInfo) {
        nameInfo.textContent =
            name;
    }

    if (emailInfo) {
        emailInfo.textContent =
            email;
    }

    if (genderInfo) {
        genderInfo.textContent =
            gender;
    }

    if (courseInfo) {
        courseInfo.textContent =
            course;
    }

    if (semesterInfo) {
        semesterInfo.textContent =
            yearSemester;
    }

    if (collegeInfo) {
        collegeInfo.textContent =
            college;
    }

    if (goalInfo) {
        goalInfo.textContent =
            wellnessGoal;
    }

    if (phoneInfo) {
        phoneInfo.textContent =
            phone;
    }


    /* =========================================
       DASHBOARD GREETING
    ========================================= */

    const userName =
        document.getElementById("userName");

    if (userName) {
        userName.textContent =
            name + "!";
    }


    /* =========================================
       PROFILE PICTURE
    ========================================= */

    if (profileData.profilePicture) {

        document
            .querySelectorAll(".avatar")
            .forEach(avatar => {

                avatar.innerHTML = `
                    <img
                        src="${profileData.profilePicture}"
                        alt="Profile Picture"
                    >
                `;

            });

    }

}


/* Run when page loads */

updateProfileUI();



/* =====================================================
   OPEN PROFILE DROPDOWN
===================================================== */

profileBtn?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        profileWrapper?.classList.toggle(
            "active"
        );

    }
);


/* =====================================================
   CLOSE PROFILE DROPDOWN
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            profileWrapper &&
            !profileWrapper.contains(
                event.target
            )
        ) {

            profileWrapper.classList.remove(
                "active"
            );

        }

    }
);



/* =====================================================
   VIEW PROFILE
===================================================== */

document
    .getElementById("viewProfileBtn")
    ?.addEventListener(
        "click",
        () => {

            profileWrapper?.classList.remove(
                "active"
            );

            profileModal?.classList.add(
                "show"
            );

        }
    );



/* =====================================================
   CLOSE PROFILE MODAL
===================================================== */

function closeProfileModal() {

    profileModal?.classList.remove(
        "show"
    );

}


document
    .getElementById("closeProfileModal")
    ?.addEventListener(
        "click",
        closeProfileModal
    );


document
    .getElementById("closeProfileBtn")
    ?.addEventListener(
        "click",
        closeProfileModal
    );



/* =====================================================
   EDIT PROFILE
===================================================== */

function openEditProfile() {

    profileWrapper?.classList.remove(
        "active"
    );

    profileModal?.classList.remove(
        "show"
    );


    /* ---------------------------------------------
       BASIC INFORMATION
    --------------------------------------------- */

    const nameInput =
        document.getElementById(
            "editProfileName"
        );

    const emailInput =
        document.getElementById(
            "editProfileEmail"
        );

    const genderInput =
        document.getElementById(
            "editProfileGender"
        );

    const courseInput =
        document.getElementById(
            "editProfileCourse"
        );

    const yearInput =
        document.getElementById(
            "editProfileYear"
        );

    const collegeInput =
        document.getElementById(
            "editProfileCollege"
        );

    const goalInput =
        document.getElementById(
            "editProfileGoal"
        );

    const phoneInput =
        document.getElementById(
            "editProfilePhone"
        );


    /* ---------------------------------------------
       PUT SAVED VALUES INTO FORM
    --------------------------------------------- */

    if (nameInput) {

        nameInput.value =
            profileData.name || "";

    }


    if (emailInput) {

        emailInput.value =
            profileData.email || "";

    }


    if (genderInput) {

        genderInput.value =
            profileData.gender || "";

    }


    if (courseInput) {

        courseInput.value =
            profileData.course || "BCA";

    }


    if (yearInput) {

        yearInput.value =
            profileData.yearSemester || "";

    }


    if (collegeInput) {

        collegeInput.value =
            profileData.college || "";

    }


    if (goalInput) {

        goalInput.value =
            profileData.wellnessGoal || "";

    }


    if (phoneInput) {

        phoneInput.value =
            profileData.phone || "";

    }


    /* ---------------------------------------------
       PROFILE PICTURE PREVIEW
    --------------------------------------------- */

    const picturePreview =
        document.getElementById(
            "profilePicturePreview"
        );

    if (
        picturePreview &&
        profileData.profilePicture
    ) {

        picturePreview.src =
            profileData.profilePicture;

    }


    /* Open edit modal */

    editProfileModal?.classList.add(
        "show"
    );

}


/* =====================================================
   OPEN EDIT PROFILE
===================================================== */

document
    .getElementById("editProfileBtn")
    ?.addEventListener(
        "click",
        openEditProfile
    );


document
    .getElementById("modalEditProfileBtn")
    ?.addEventListener(
        "click",
        openEditProfile
    );



/* =====================================================
   CLOSE EDIT PROFILE
===================================================== */

function closeEditProfile() {

    editProfileModal?.classList.remove(
        "show"
    );

}


document
    .getElementById("closeEditProfile")
    ?.addEventListener(
        "click",
        closeEditProfile
    );


document
    .getElementById("cancelEditProfile")
    ?.addEventListener(
        "click",
        closeEditProfile
    );



/* =====================================================
   PROFILE PICTURE UPLOAD
===================================================== */

const profilePictureInput =
    document.getElementById(
        "editProfilePicture"
    );


profilePictureInput?.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }


        /* Check image */

        if (!file.type.startsWith("image/")) {

            toast(
                "Please select an image file"
            );

            return;

        }


        /* Read image */

        const reader =
            new FileReader();


        reader.onload = () => {

            const preview =
                document.getElementById(
                    "profilePicturePreview"
                );


            if (preview) {

                preview.src =
                    reader.result;

            }


            /* Temporarily save */

            profileData.profilePicture =
                reader.result;


            toast(
                "Profile picture selected ✓"
            );

        };


        reader.readAsDataURL(file);

    }
);



/* =====================================================
   SAVE PROFILE
===================================================== */

document
    .getElementById("saveProfile")
    ?.addEventListener(
        "click",
        () => {


            /* -----------------------------------------
               GET FORM VALUES
            ----------------------------------------- */

            const name =
                document
                    .getElementById(
                        "editProfileName"
                    )
                    ?.value
                    .trim() || "";


            const email =
                document
                    .getElementById(
                        "editProfileEmail"
                    )
                    ?.value
                    .trim() || "";


            const gender =
                document
                    .getElementById(
                        "editProfileGender"
                    )
                    ?.value || "";


            const course =
                document
                    .getElementById(
                        "editProfileCourse"
                    )
                    ?.value
                    .trim() || "BCA";


            const yearSemester =
                document
                    .getElementById(
                        "editProfileYear"
                    )
                    ?.value || "";


            const college =
                document
                    .getElementById(
                        "editProfileCollege"
                    )
                    ?.value
                    .trim() || "";


            const wellnessGoal =
                document
                    .getElementById(
                        "editProfileGoal"
                    )
                    ?.value || "";


            const phone =
                document
                    .getElementById(
                        "editProfilePhone"
                    )
                    ?.value
                    .trim() || "";


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (!name) {

                toast(
                    "Please enter your name"
                );

                document
                    .getElementById(
                        "editProfileName"
                    )
                    ?.focus();

                return;

            }


            /* -----------------------------------------
               SAVE PROFILE DATA
            ----------------------------------------- */

            profileData = {

                name:
                    name,

                email:
                    email,

                gender:
                    gender,

                course:
                    course || "BCA",

                yearSemester:
                    yearSemester,

                college:
                    college,

                wellnessGoal:
                    wellnessGoal,

                phone:
                    phone,

                profilePicture:
                    profileData.profilePicture || ""

            };


            /* -----------------------------------------
               SAVE TO LOCAL STORAGE
            ----------------------------------------- */

            localStorage.setItem(
                "wellnessProfile",
                JSON.stringify(
                    profileData
                )
            );


            /* -----------------------------------------
               UPDATE DASHBOARD
            ----------------------------------------- */

            updateProfileUI();


            /* -----------------------------------------
               CLOSE MODAL
            ----------------------------------------- */

            closeEditProfile();


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            toast(
                "Profile updated successfully ✓"
            );

        }
    );



/* =====================================================
   WELLNESS SUMMARY
===================================================== */

document
    .getElementById("wellnessSummaryBtn")
    ?.addEventListener(
        "click",
        () => {

            profileWrapper?.classList.remove(
                "active"
            );

            toast(
                "Your Wellness Summary is coming soon 🌿"
            );

        }
    );



/* =====================================================
   SETTINGS
===================================================== */

document
    .getElementById("settingsBtn")
    ?.addEventListener(
        "click",
        () => {

            profileWrapper?.classList.remove(
                "active"
            );

            toast(
                "Settings opened ⚙️"
            );

        }
    );



/* =====================================================
   LOGOUT
===================================================== */

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            toast(
                "Logging out..."
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                800
            );

        }
    );



/* =====================================================
   CLOSE PROFILE MODALS OUTSIDE
===================================================== */

profileModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            profileModal
        ) {

            closeProfileModal();

        }

    }
);


editProfileModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            editProfileModal
        ) {

            closeEditProfile();

        }

    }
);



/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            profileWrapper?.classList.remove(
                "active"
            );

            closeProfileModal();

            closeEditProfile();

        }

    }
);









/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById("searchInput")
    .addEventListener("keydown", event => {

        /*
            Run search when Enter
            is pressed
        */

        if (
            event.key === "Enter" &&
            event.target.value.trim()
        ) {

            toast(
                `Searching for "${event.target.value.trim()}"`
            );

        }

    });


  /* =====================================================
   MANAGE PRIORITIES
===================================================== */

const managePriorities =
    document.getElementById("managePriorities");

const priorityModal =
    document.getElementById("priorityModal");

const closePriorityModal =
    document.getElementById("closePriorityModal");

const cancelPriority =
    document.getElementById("cancelPriority");

const savePriorities =
    document.getElementById("savePriorities");


/* =====================================================
   PRIORITY INFORMATION
===================================================== */

const priorityData = {

    "Sleep Problems": {
        title: "Better Sleep",
        description:
            "Good sleep improves your mood, focus and overall well-being.",
        colorClass: "purple",
        icon: "🌙",
        checkinQuestion: "How did you sleep last night?",
        checkinOptions: [
            ["😟", "Poor"],
            ["😐", "Okay"],
            ["🙂", "Good"],
            ["😍", "Great"]
        ]
    },

    "Academic Stress": {
        title: "Manage Academic Stress",
        description:
            "Take control of study pressure and stay productive.",
        colorClass: "blue",
        icon: "📖",
        checkinQuestion: "How overwhelmed do you feel about your studies today?",
        checkinOptions: [
            ["🙂", "Low"],
            ["😐", "Medium"],
            ["😰", "High"]
        ]
    },

    "Financial Stress": {
        title: "Reduce Financial Stress",
        description:
            "Build better financial clarity and reduce money worries.",
        colorClass: "green",
        icon: "💼",
        checkinQuestion: "How are finances making you feel today?",
        checkinOptions: [
            ["😊", "I'm okay"],
            ["😟", "A little worried"],
            ["😰", "Very stressed"]
        ]
    },

    "Future Anxiety": {
        title: "Build Confidence",
        description:
            "Build confidence and feel more positive about your future.",
        colorClass: "orange",
        icon: "🏔️",
        checkinQuestion: "What's worrying you most right now?",
        checkinOptions: [
            ["🎓", "Getting a job"],
            ["📈", "My career"],
            ["😟", "Fear of failure"],
            ["❓", "I don't know what to do"]
        ]
    },

    "Loneliness": {
        title: "Feel More Connected",
        description:
            "Connect, share and build meaningful social support.",
        colorClass: "pink",
        icon: "👥",
        checkinQuestion: "Feeling disconnected today? We're here with you. 💙",
        checkinOptions: [
            ["💬", "I want to talk"],
            ["🧘", "I want to relax"],
            ["🤝", "I want to connect"],
            ["❓", "I don't know what I need"]
        ]
    }

};



/* =====================================================
   RECOMMENDATIONS FOR EACH TOP PRIORITY
===================================================== */

const recommendationData = {

    "Sleep Problems": [
        {
            icon: "🌙",
            title: "Better Sleep Routine",
            description: "Create a calm routine before going to bed.",
            time: "5 min"
        },
        {
            icon: "🧘",
            title: "Sleep Breathing",
            description: "Relax your body and prepare your mind for sleep.",
            time: "3 min"
        },
        {
            icon: "🎵",
            title: "Relaxing Sleep Sounds",
            description: "Listen to peaceful sounds for better relaxation.",
            time: "10 min"
        },
        {
            icon: "📖",
            title: "Sleep Journal",
            description: "Write down how you slept and how you feel.",
            time: "5 min"
        }
    ],

    "Academic Stress": [
        {
            icon: "📚",
            title: "Focus Study Session",
            description: "Study with a simple focused session.",
            time: "25 min"
        },
        {
            icon: "🧘",
            title: "Study Stress Relief",
            description: "Take a short break and calm your mind.",
            time: "5 min"
        },
        {
            icon: "🎯",
            title: "Set Study Goals",
            description: "Choose your most important task for today.",
            time: "5 min"
        },
        {
            icon: "🌿",
            title: "Mindful Break",
            description: "Refresh your mind before continuing your studies.",
            time: "3 min"
        }
    ],

    "Financial Stress": [
        {
            icon: "💰",
            title: "Check Your Budget",
            description: "Review your spending and understand your money.",
            time: "10 min"
        },
        {
            icon: "📊",
            title: "Create a Simple Budget",
            description: "Plan your income and expenses for the week.",
            time: "10 min"
        },
        {
            icon: "🧘",
            title: "Money Stress Relief",
            description: "Take a moment to relax when money feels stressful.",
            time: "5 min"
        },
        {
            icon: "📝",
            title: "Track Your Expenses",
            description: "Write down today's spending.",
            time: "5 min"
        }
    ],

    "Future Anxiety": [
        {
            icon: "🎯",
            title: "Set a Career Goal",
            description: "Choose one small goal for your future.",
            time: "10 min"
        },
        {
            icon: "💻",
            title: "Build a New Skill",
            description: "Spend some time learning an important skill.",
            time: "20 min"
        },
        {
            icon: "🎓",
            title: "Career Planning",
            description: "Think about your next step towards your career.",
            time: "10 min"
        },
        {
            icon: "🧘",
            title: "Future Anxiety Relief",
            description: "Calm your mind and focus on the present moment.",
            time: "5 min"
        }
    ],

    "Loneliness": [
        {
            icon: "💬",
            title: "Talk to Someone",
            description: "Reach out to a friend or someone you trust.",
            time: "10 min"
        },
        {
            icon: "🤝",
            title: "Connect With Someone",
            description: "Send a message to someone you care about.",
            time: "5 min"
        },
        {
            icon: "🚶",
            title: "Take a Social Walk",
            description: "Go outside and spend some time around people.",
            time: "15 min"
        },
        {
            icon: "💙",
            title: "Self-Connection",
            description: "Take some quiet time to understand your feelings.",
            time: "5 min"
        }
    ]

};






/* =====================================================
   UPDATE TOP PRIORITY CARD
===================================================== */

function updateTopPriority(priorityName) {

    const data = priorityData[priorityName];

    if (!data) {
        return;
    }

    const title =
        document.getElementById("topPriorityTitle");

    const description =
        document.getElementById("topPriorityDescription");

    const hero =
        document.querySelector(".priority-hero");

    const artwork =
        document.getElementById("topPriorityArtwork");

    const checkinQuestion =
        document.getElementById("priorityCheckinQuestion");

    const checkinOptions =
        document.getElementById("priorityCheckinOptions");

    const checkinNote =
        document.getElementById("priorityCheckinNote");

    const checkinButton =
        document.getElementById("sleepCheckin");

    if (title) {
        title.textContent = data.title;
    }

    if (description) {
        description.textContent = data.description;
    }

    if (hero) {
        hero.classList.remove(
            "priority-hero-purple",
            "priority-hero-blue",
            "priority-hero-green",
            "priority-hero-orange",
            "priority-hero-pink"
        );
        hero.classList.add(`priority-hero-${data.colorClass}`);
    }

    if (artwork) {
        artwork.textContent = data.icon;
    }

    if (checkinQuestion) {
        checkinQuestion.textContent = data.checkinQuestion;
    }

    if (checkinOptions) {
        checkinOptions.innerHTML = data.checkinOptions
            .map(([icon, label]) => `
                <button class="rating" data-value="${label}">
                    <span>${icon}</span>
                    <small>${label}</small>
                </button>
            `)
            .join("");

        checkinOptions.querySelectorAll(".rating").forEach(button => {
            button.addEventListener("click", () => {
                checkinOptions.querySelectorAll(".rating").forEach(item => {
                    item.classList.remove("selected");
                });

                button.classList.add("selected");
                toast(`Check-in saved: ${button.dataset.value}`);
            });
        });
    }

    if (checkinNote) {
        checkinNote.textContent =
            "Choose an option to record how you feel today.";
    }

    if (checkinButton) {
        checkinButton.textContent = "Start Check-in →";
    }


        updateRecommendations(priorityName);

}





/* =====================================================
   UPDATE RECOMMENDATIONS
===================================================== */

function updateRecommendations(priorityName) {

    const container =
        document.getElementById("recommendationContainer");

    if (!container) {
        return;
    }

    const recommendations =
        recommendationData[priorityName];

    if (!recommendations) {
        return;
    }

    container.innerHTML = recommendations.map((item, index) => {

        return `
            <div class="recommend-card">

                <!-- Activity Icon -->
                <div class="recommend-icon">
                    ${item.icon}
                </div>

                <!-- Activity Information -->
                <div class="recommend-content">

                    <div class="recommend-top">

                        <span class="recommend-category">
                            Recommended
                        </span>

                        <span class="recommend-time">
                            ⏱ ${item.time}
                        </span>

                    </div>

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        ${item.description}
                    </p>

                </div>

                <!-- Start Button -->
                <button
                    class="play-btn"
                    title="Start activity"
                    aria-label="Start ${item.title}">

                    <span>▶</span>

                </button>

            </div>
        `;

    }).join("");


    /* =================================================
       PLAY BUTTONS
    ================================================= */

    container
        .querySelectorAll(".play-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const card =
                    button.closest(".recommend-card");

                const title =
                    card.querySelector("h3").textContent.trim();

                /* Button animation */

                button.classList.add("playing");

                setTimeout(() => {

                    button.classList.remove("playing");

                }, 500);

                toast(`Starting: ${title}`);

            });

        });

}












/* =====================================================
   UPDATE PRIORITY CARD
===================================================== */

function updatePriorityCard(name, value) {

    const card = document.querySelector(
        `.priority-card[data-priority="${name}"]`
    );

    if (!card) {
        return;
    }

    const progressBar =
        card.querySelector(".progress-line > span");

    const percentageText =
        card.querySelector(".progress-line > b");


    /* Update progress bar */

    if (progressBar) {

        progressBar.style.width =
            value + "%";

    }


    /* Update percentage */

    if (percentageText) {

        percentageText.textContent =
            value + "%";

    }

}


/* =====================================================
   LOAD SAVED TOP PRIORITY
===================================================== */

function loadTopPriority() {

    const savedPriority =
        localStorage.getItem("wellnessTopPriority");

    if (savedPriority) {

        const radio =
            document.querySelector(
                `.top-priority-option input[value="${savedPriority}"]`
            );

        if (radio) {
            radio.checked = true;
        }

        updateTopPriority(savedPriority);

    }

}


/* Keep the selected top priority enabled in the list. */

document
    .querySelectorAll('input[name="topPriority"]')
    .forEach(radio => {

        radio.addEventListener("change", () => {

            const checkbox =
                radio.closest(".priority-input-item")
                    ?.querySelector(".priority-check");

            if (checkbox) {
                checkbox.checked = true;
            }

        });

    });


/* =====================================================
   OPEN MANAGE PRIORITIES
===================================================== */

if (managePriorities) {

    managePriorities.addEventListener("click", () => {

        priorityModal.classList.add("show");

        loadTopPriority();

    });

}


/* =====================================================
   CLOSE PRIORITY MODAL
===================================================== */

function closePriorityWindow() {

    if (priorityModal) {

        priorityModal.classList.remove("show");

    }

}


if (closePriorityModal) {

    closePriorityModal.addEventListener(
        "click",
        closePriorityWindow
    );

}


if (cancelPriority) {

    cancelPriority.addEventListener(
        "click",
        closePriorityWindow
    );

}


/* =====================================================
   SAVE PRIORITIES
===================================================== */

if (savePriorities) {

    savePriorities.addEventListener("click", async () => {

        const priorityItems =
            document.querySelectorAll(
                ".priority-input-item"
            );


        /* ---------------------------------------------
           SAVE PERCENTAGES
        --------------------------------------------- */

        priorityItems.forEach(item => {

            const checkbox =
                item.querySelector(
                    ".priority-check"
                );

            const input =
                item.querySelector(
                    ".priority-percent"
                );


            if (!checkbox || !input) {
                return;
            }


            const priorityName =
                checkbox.value;


            let value =
                parseInt(input.value);


            /* Make sure value is valid */

            if (isNaN(value)) {
                value = 0;
            }


            /* Keep value between 0 and 100 */

            value =
                Math.max(
                    0,
                    Math.min(100, value)
                );


            input.value = value;


            /* Update dashboard */

            updatePriorityCard(
                priorityName,
                value
            );

        });


        /* ---------------------------------------------
           SAVE TOP PRIORITY
        --------------------------------------------- */

        const selectedTopPriority =
            document.querySelector(
                'input[name="topPriority"]:checked'
            );


        if (selectedTopPriority) {

            const priorityName =
                selectedTopPriority.value;


            /* Save to browser */

            localStorage.setItem(
                "wellnessTopPriority",
                priorityName
            );

            try {
                const availablePriorities =
                    await wellnessApiRequest("/priorities");

                const priorityIds = [...document.querySelectorAll(
                    ".priority-check:checked"
                )]
                    .map(input => availablePriorities.find(
                        priority => priority.name === input.value
                    )?.id)
                    .filter(Boolean);

                const topPriorityId = availablePriorities.find(
                    priority => priority.name === priorityName
                )?.id;

                if (!priorityIds.length || !topPriorityId) {
                    throw new Error("Selected priorities are not available in the backend");
                }

                await wellnessApiRequest("/priorities", {
                    method: "POST",
                    body: JSON.stringify({ priorityIds, topPriorityId })
                });
            } catch (error) {
                console.warn("Dashboard priorities saved locally but not synced:", error.message);
            }


            /* Change top card immediately */

            updateTopPriority(
                priorityName
            );


            toast(
                `Top priority set to ${priorityName} ✓`
            );

        } else {

            toast(
                "Please select a Top Priority"
            );

            return;

        }


        /* Close modal */

        closePriorityWindow();

        window.location.href =
            "mood.html";

    });

}


/* =====================================================
   LOAD TOP PRIORITY WHEN PAGE OPENS
===================================================== */

async function syncDashboardData() {
    if (!localStorage.getItem("token")) {
        return;
    }

    try {
        const [dashboardData, priorities] = await Promise.all([
            wellnessApiRequest("/dashboard"),
            wellnessApiRequest("/priorities/my-priorities")
        ]);

        if (dashboardData?.user?.name) {
            const userName = document.getElementById("userName");
            if (userName) userName.textContent = `${dashboardData.user.name}!`;
        }

        const topPriority = (priorities || []).find(
            priority => priority.is_top_priority
        );

        if (topPriority?.name) {
            localStorage.setItem("wellnessTopPriority", topPriority.name);
            if (priorityData[topPriority.name]) {
                updateTopPriority(topPriority.name);
            }
        }
    } catch (error) {
        console.warn("Using local Dashboard data:", error.message);
    }
}

loadTopPriority();
syncDashboardData();



/* =====================================================
   WEEKLY CALENDAR - CURRENT WEEK
===================================================== */

function updateWeeklyCalendar() {

    const today = new Date();

    /*
       JavaScript:
       Sunday = 0
       Monday = 1
       Tuesday = 2
       Wednesday = 3
       Thursday = 4
       Friday = 5
       Saturday = 6
    */

    const dayOfWeek = today.getDay();

    /*
       Convert to Monday-based week

       Monday = 0
       Tuesday = 1
       Wednesday = 2
       Thursday = 3
       Friday = 4
       Saturday = 5
       Sunday = 6
    */

    const mondayIndex =
        (dayOfWeek + 6) % 7;


    /*
       Find Monday of current week
    */

    const monday =
        new Date(today);

    monday.setDate(
        today.getDate() - mondayIndex
    );


    /*
       Get weekly calendar dates
    */

    const weeklyDates =
        document.querySelectorAll(
            ".calendar-date"
        );


    weeklyDates.forEach(
        (date, index) => {

            /*
               Create date
            */

            const currentDate =
                new Date(monday);

            currentDate.setDate(
                monday.getDate() + index
            );


            /*
               Display date
            */

            date.textContent =
                currentDate.getDate();


            /*
               Remove old selection
            */

            date.classList.remove(
                "selected"
            );


            /*
               Highlight today
            */

            if (
                currentDate.getDate() ===
                    today.getDate() &&

                currentDate.getMonth() ===
                    today.getMonth() &&

                currentDate.getFullYear() ===
                    today.getFullYear()
            ) {

                date.classList.add(
                    "selected"
                );

            }


            /*
               Click date
            */

            date.onclick = () => {

                weeklyDates.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                date.classList.add(
                    "selected"
                );


                toast(
                    currentDate.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        }
                    ) + " selected"
                );

            };

        }
    );

}





/*
   Load current week
*/

updateWeeklyCalendar();


// Monthly calendar
document
    .querySelectorAll(".calendar-days span")
    .forEach(date => {

        date.addEventListener("click", () => {

            document
                .querySelectorAll(".calendar-days span")
                .forEach(item => {
                    item.classList.remove("today");
                    item.classList.remove("selected");
                });

            date.classList.add("selected");

            toast(`Date ${date.textContent} selected`);

        });

    });

    
/* =====================================================
   FULL CALENDAR
===================================================== */

const viewFullCalendar =
    document.getElementById("viewFullCalendar");

const calendarModal =
    document.getElementById("calendarModal");

const closeCalendar =
    document.getElementById("closeCalendar");

const closeCalendarBottom =
    document.getElementById("closeCalendarBottom");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const monthYear =
    document.getElementById("monthYear");

const fullCalendarDays =
    document.getElementById("fullCalendarDays");


/* Current date */

let calendarDate = new Date();


/* =====================================================
   SHOW CALENDAR
===================================================== */

if (viewFullCalendar) {

    viewFullCalendar.addEventListener("click", () => {

        calendarModal.classList.add("show");

        renderCalendar();

    });

}


/* =====================================================
   RENDER CALENDAR
===================================================== */

function renderCalendar() {

    const today = new Date();

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    /* Show current month and year */

    monthYear.textContent =
        `${months[month]} ${year}`;


    /* First day of month */

    const firstDay =
        new Date(year, month, 1).getDay();


    /* Number of days */

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    /* Clear calendar */

    fullCalendarDays.innerHTML = "";


    /* Empty spaces before first day */

    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("span");

        fullCalendarDays.appendChild(empty);

    }


    /* Create dates */

    for (let day = 1; day <= daysInMonth; day++) {

        const button =
            document.createElement("button");

        button.textContent = day;


        /* Highlight TODAY */

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            button.classList.add("today");

        }


        /* Select date */

        button.addEventListener("click", () => {

            document
                .querySelectorAll(
                    "#fullCalendarDays button"
                )
                .forEach(item => {

                    item.classList.remove("selected");

                });

            button.classList.add("selected");

            toast(
                `${months[month]} ${day}, ${year} selected`
            );

        });


        fullCalendarDays.appendChild(button);

    }

}


/* =====================================================
   PREVIOUS MONTH
===================================================== */

if (prevMonth) {

    prevMonth.addEventListener("click", () => {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderCalendar();

    });

}


/* =====================================================
   NEXT MONTH
===================================================== */

if (nextMonth) {

    nextMonth.addEventListener("click", () => {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderCalendar();

    });

}


/* =====================================================
   CLOSE CALENDAR
===================================================== */

function closeFullCalendar() {

    if (calendarModal) {

        calendarModal.classList.remove("show");

    }

}


if (closeCalendar) {

    closeCalendar.addEventListener(
        "click",
        closeFullCalendar
    );

}


if (closeCalendarBottom) {

    closeCalendarBottom.addEventListener(
        "click",
        closeFullCalendar
    );

}


/* =====================================================
   CLICK OUTSIDE TO CLOSE
===================================================== */

if (calendarModal) {

    calendarModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === calendarModal
            ) {

                closeFullCalendar();

            }

        }
    );

}


/* =====================================================
   VIEW ALL REMINDERS
===================================================== */

const viewAllReminders =
    document.getElementById("viewAllReminders");

const allRemindersModal =
    document.getElementById("allRemindersModal");

const closeAllReminders =
    document.getElementById("closeAllReminders");

const closeAllRemindersBottom =
    document.getElementById("closeAllRemindersBottom");

const allRemindersList =
    document.getElementById("allRemindersList");


/* =====================================================
   OPEN VIEW ALL
===================================================== */

viewAllReminders?.addEventListener("click", () => {

    allRemindersModal.classList.add("show");

    showAllReminders();

});


/* =====================================================
   SHOW ALL REMINDERS
===================================================== */

function showAllReminders() {

    const reminders =
        document.querySelectorAll(
            ".reminders .reminder"
        );


    allRemindersList.innerHTML = "";


    /* No reminders */

    if (reminders.length === 0) {

        allRemindersList.innerHTML = `
            <div class="no-reminders">
                No reminders available.
            </div>
        `;

        return;
    }


    /* Create each reminder */

    reminders.forEach((reminder) => {

        const icon =
            reminder.querySelector(
                ".r-icon"
            )?.textContent.trim() || "🔔";


        const title =
            reminder.querySelector(
                "strong"
            )?.textContent.trim() || "Reminder";


        const time =
            reminder.querySelector(
                "time"
            )?.textContent.trim() || "";


        const originalCheck =
            reminder.querySelector(".check");


        /* Create View All item */

        const item =
            document.createElement("div");


        item.className =
            "all-reminder-item";


        item.innerHTML = `

            <span class="r-icon">
                ${icon}
            </span>

            <strong>
                ${title}
            </strong>

            <time>
                ${time}
            </time>

            <button
                class="all-reminder-check
                ${originalCheck.classList.contains("done")
                    ? "done"
                    : ""}">

                ${originalCheck.classList.contains("done")
                    ? "✓"
                    : ""}

            </button>

            <button
                class="delete-reminder"
                title="Delete reminder">

                🗑️

            </button>

        `;


        /* =================================================
           COMPLETE REMINDER
        ================================================= */

        const checkButton =
            item.querySelector(
                ".all-reminder-check"
            );


        checkButton.addEventListener(
            "click",
            () => {

                originalCheck.classList.toggle(
                    "done"
                );


                if (
                    originalCheck.classList.contains(
                        "done"
                    )
                ) {

                    originalCheck.textContent =
                        "✓";

                    checkButton.classList.add(
                        "done"
                    );

                    checkButton.textContent =
                        "✓";

                    toast(
                        "Reminder completed"
                    );

                } else {

                    originalCheck.textContent =
                        "";

                    checkButton.classList.remove(
                        "done"
                    );

                    checkButton.textContent =
                        "";

                    toast(
                        "Reminder marked incomplete"
                    );

                }

            }
        );


        /* =================================================
           DELETE REMINDER
        ================================================= */

        const deleteButton =
            item.querySelector(
                ".delete-reminder"
            );


        deleteButton.addEventListener(
            "click",
            () => {

                /* Remove from main dashboard */

                reminder.remove();


                /* Remove from View All */

                item.remove();


                toast(
                    `${title} removed`
                );


                /* Check if no reminders remain */

                const remaining =
                    document.querySelectorAll(
                        ".reminders .reminder"
                    );


                if (remaining.length === 0) {

                    allRemindersList.innerHTML = `
                        <div class="no-reminders">
                            No reminders available.
                        </div>
                    `;

                }

            }
        );


        allRemindersList.appendChild(
            item
        );

    });

}


/* =====================================================
   CLOSE VIEW ALL
===================================================== */

function closeAllRemindersWindow() {

    allRemindersModal.classList.remove(
        "show"
    );

}


closeAllReminders?.addEventListener(
    "click",
    closeAllRemindersWindow
);


closeAllRemindersBottom?.addEventListener(
    "click",
    closeAllRemindersWindow
);


/* =====================================================
   CLICK OUTSIDE TO CLOSE
===================================================== */

allRemindersModal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            allRemindersModal
        ) {

            closeAllRemindersWindow();

        }

    }
);





/* =====================================================
   OPEN MOOD PAGE WHEN EMOJI IS CLICKED
===================================================== */

document
    .getElementById("priorityCheckinOptions")
    .addEventListener("click", (event) => {

        const emojiButton =
            event.target.closest(".rating");

        if (!emojiButton) return;

        window.location.href = "mood.html";

    });