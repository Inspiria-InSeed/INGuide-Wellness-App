const moodButtons = document.querySelectorAll(".mood-option");
const sleepOptions = document.getElementById("sleepOptions");
const note = document.getElementById("checkinNote");
const noteCounter = document.getElementById("noteCounter");
const journalText = document.getElementById("journalText");
const journalCounter = document.getElementById("journalCounter");
const saveCheckin = document.getElementById("saveCheckin");
const saveJournal = document.getElementById("saveJournal");
const toast = document.getElementById("toast");
const todayJournal = document.getElementById("todayJournal");
const pastJournal = document.getElementById("pastJournal");
const journalPagination = document.getElementById("journalPagination");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");
const savedNotes = document.getElementById("savedNotes");
const notesPagination = document.getElementById("notesPagination");
const previousNotePage = document.getElementById("previousNotePage");
const nextNotePage = document.getElementById("nextNotePage");
const notePageIndicator = document.getElementById("notePageIndicator");

const progressRange = document.getElementById("progressRange");
const trendRange = document.getElementById("trendRange");

const progressMoodPercent = document.getElementById("progressMoodPercent");
const progressJournalPercent = document.getElementById("progressJournalPercent");
const overallProgressValue = document.getElementById("overallProgressValue");
const progressDonut = document.getElementById("progressDonut");

const moodTrendArea = document.getElementById("moodTrendArea");
const moodTrendLine = document.getElementById("moodTrendLine");
const moodTrendPoints = document.getElementById("moodTrendPoints");
const graphMoods = document.getElementById("graphMoods");

const prioritySelectorValue =
    document.getElementById("prioritySelectorValue");

const checkinQuestion =
    document.getElementById("checkinQuestion");

const checkinContext =
    document.getElementById("checkinContext");

let selectedMood = "Good";
let selectedSleep = "Good";
let currentJournalPage = 1;
let currentNotePage = 1;

const moodStorageKey = "wellnessMoodCheckins";
const journalStorageKey = "wellnessJournalEntries";
const checkinNotesStorageKey = "wellnessCheckinNotes";

const maxEntries = 30;
const maxCheckins = 30;
const entriesPerPage = 5;
const notesPerPage = 5;

const moodScores = {
    Great: 5,
    Good: 4,
    Okay: 3,
    Low: 2,
    Stressed: 1
};

const moodFaces = {
    Great: "😊",
    Good: "🙂",
    Okay: "😐",
    Low: "🙁",
    Stressed: "😟"
};

const defaultTrendValues = [
    3.7,
    4.4,
    2.9,
    3.8,
    4.2,
    2.5,
    3.8
];

const defaultTrendFaces = [
    "😊",
    "🙂",
    "😐",
    "😊",
    "🙂",
    "😟",
    "🙂"
];

const priorityData = {
    "Sleep Problems": {
        icon: "🌙",
        label: "Better Sleep",
        title: "How has your sleep been recently?",
        context: "Since your top priority is Better Sleep",
        options: [
            ["Poor", "☾"],
            ["Okay", "😐"],
            ["Good", "😊"]
        ]
    },

    "Academic Stress": {
        icon: "📖",
        label: "Academic Stress",
        title: "How has studying been feeling recently?",
        context: "Since your top priority is Academic Stress",
        options: [
            ["Low", "🙂"],
            ["Medium", "😐"],
            ["High", "😰"]
        ]
    },

    "Financial Stress": {
        icon: "💼",
        label: "Financial Stress",
        title: "How have your finances been feeling recently?",
        context: "Since your top priority is Financial Stress",
        options: [
            ["Okay", "😊"],
            ["Worried", "😟"],
            ["Very stressed", "😰"]
        ]
    },

    "Future Anxiety": {
        icon: "🏔️",
        label: "Future Anxiety",
        title: "How has your future been feeling recently?",
        context: "Since your top priority is Future Anxiety",
        options: [
            ["Confident", "🙂"],
            ["Uncertain", "😐"],
            ["Anxious", "😟"]
        ]
    },

    "Loneliness": {
        icon: "👥",
        label: "Loneliness",
        title: "How connected have you felt recently?",
        context: "Since your top priority is Loneliness",
        options: [
            ["Connected", "😊"],
            ["A little alone", "🙁"],
            ["Very alone", "😟"]
        ]
    }
};


/* =========================================
   LOCAL STORAGE HELPERS
========================================= */

function getArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key)) || [];

        return Array.isArray(value) ? value : [];

    } catch (error) {
        return [];
    }
}


function getDateKey(date = new Date()) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);
}


/* =========================================
   MOOD SELECTION
========================================= */

function setSelectedMood(button) {

    moodButtons.forEach(item => {

        item.classList.remove("selected");

        const oldCheck =
            item.querySelector(".selected-check");

        if (oldCheck) {
            oldCheck.remove();
        }
    });

    button.classList.add("selected");

    const check =
        document.createElement("span");

    check.className = "selected-check";

    check.textContent = "✓";

    button.appendChild(check);

    selectedMood = button.dataset.mood;
}


moodButtons.forEach(button => {

    button.addEventListener("click", () => {

        setSelectedMood(button);

        showToast(
            `Mood selected: ${selectedMood}`
        );
    });

});


/* =========================================
   SLEEP SELECTION
========================================= */

function bindSleepOptions() {

    sleepOptions
        .querySelectorAll(".sleep-option")
        .forEach(button => {

            button.addEventListener("click", () => {

                sleepOptions
                    .querySelectorAll(".sleep-option")
                    .forEach(item => {

                        item.classList.remove(
                            "selected"
                        );

                        const oldCheck =
                            item.querySelector(
                                ".selected-check"
                            );

                        if (oldCheck) {
                            oldCheck.remove();
                        }
                    });

                button.classList.add("selected");

                const check =
                    document.createElement("span");

                check.className =
                    "selected-check";

                check.textContent = "✓";

                button.appendChild(check);

                selectedSleep =
                    button.dataset.sleep;

                showToast(
                    `Sleep rating: ${selectedSleep}`
                );
            });

        });
}

bindSleepOptions();


function loadTodayCheckin() {

    const todayEntry =
        getArray(moodStorageKey)
            .find(entry => entry.date === getDateKey());

    if (!todayEntry) {
        return;
    }

    const moodButton =
        [...moodButtons]
            .find(button => button.dataset.mood === todayEntry.mood);

    if (moodButton) {
        setSelectedMood(moodButton);
    }

    const sleepButton =
        sleepOptions.querySelector(
            `[data-sleep="${todayEntry.sleep}"]`
        );

    if (sleepButton) {
        sleepOptions
            .querySelectorAll(".sleep-option")
            .forEach(item => {
                item.classList.remove("selected");
                item.querySelector(".selected-check")?.remove();
            });

        sleepButton.classList.add("selected");

        const check = document.createElement("span");
        check.className = "selected-check";
        check.textContent = "✓";
        sleepButton.appendChild(check);

        selectedSleep = todayEntry.sleep;
    }

    note.value = todayEntry.note || "";
    noteCounter.textContent = `${note.value.length}/150`;
}


/* =========================================
   CHECK-IN NOTE COUNTER
========================================= */

note.addEventListener("input", () => {

    noteCounter.textContent =
        `${note.value.length}/150`;

});


/* =========================================
   JOURNAL COUNTER
========================================= */

journalText.addEventListener("input", () => {

    if (journalText.innerText.length > 1000) {

        journalText.innerText =
            journalText.innerText.slice(0, 1000);

        placeCaretAtEnd(journalText);
    }

    journalCounter.textContent =
        journalText.innerText.length;

});


function placeCaretAtEnd(element) {

    const range =
        document.createRange();

    const selection =
        window.getSelection();

    range.selectNodeContents(element);

    range.collapse(false);

    selection.removeAllRanges();

    selection.addRange(range);
}


/* =========================================
   JOURNAL TEXT FORMATTING
========================================= */

function applyFormat(command, button) {

    journalText.focus();

    document.execCommand(
        command,
        false
    );

    button.classList.toggle(
        "active",
        document.queryCommandState(command)
    );
}


document
    .getElementById("boldBtn")
    .addEventListener("click", () => {

        applyFormat(
            "bold",
            document.getElementById("boldBtn")
        );

    });


document
    .getElementById("italicBtn")
    .addEventListener("click", () => {

        applyFormat(
            "italic",
            document.getElementById("italicBtn")
        );

    });


/* =========================================
   EMOJI PICKER
========================================= */

const emojiButton =
    document.getElementById("emojiBtn");

const emojiPicker =
    document.getElementById("emojiPicker");


emojiButton.addEventListener("click", () => {

    const open =
        emojiPicker.classList.toggle("show");

    emojiButton.setAttribute(
        "aria-expanded",
        String(open)
    );

});


document
    .querySelectorAll(".emoji-choice")
    .forEach(button => {

        button.addEventListener("click", () => {

            journalText.focus();

            document.execCommand(
                "insertText",
                false,
                button.dataset.emoji
            );

            emojiPicker.classList.remove(
                "show"
            );

            emojiButton.setAttribute(
                "aria-expanded",
                "false"
            );

            journalText.dispatchEvent(
                new Event("input")
            );
        });

    });


document.addEventListener("click", event => {

    if (
        !event.target.closest(
            ".emoji-picker-wrap"
        )
    ) {

        emojiPicker.classList.remove(
            "show"
        );

        emojiButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

});


/* =========================================
   MOOD TREND GRAPH
========================================= */

function renderMoodTrend() {

    const range = trendRange.value;

    const labels =
        range === "week"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

            : range === "month"
                ? ["1", "5", "10", "15", "20", "25", "30"]

                    : [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];


    const checkins = getArray(moodStorageKey);
    const pointCount = labels.length;
    const today = new Date();
    const totals = Array(pointCount).fill(0);
    const counts = Array(pointCount).fill(0);
    const faces = Array.from(
        { length: pointCount },
        (_, index) => defaultTrendFaces[index % defaultTrendFaces.length]
    );

    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    checkins.forEach(entry => {

        const entryDate = new Date(`${entry.date}T00:00:00`);
        const score = moodScores[entry.mood];
        let bucketIndex = -1;

        if (Number.isNaN(entryDate.getTime()) || !score) {
            return;
        }

        if (range === "week") {
            const dayIndex = Math.round(
                (entryDate - monday) / (24 * 60 * 60 * 1000)
            );

            if (dayIndex >= 0 && dayIndex < 7) {
                bucketIndex = dayIndex;
            }
        } else if (range === "month") {
            if (
                entryDate.getFullYear() === today.getFullYear() &&
                entryDate.getMonth() === today.getMonth()
            ) {
                bucketIndex = Math.min(
                    6,
                    Math.floor((entryDate.getDate() - 1) / 5)
                );
            }
        } else if (entryDate.getFullYear() === today.getFullYear()) {
            bucketIndex = entryDate.getMonth();
        }

        if (bucketIndex < 0) {
            return;
        }

        totals[bucketIndex] += score;
        counts[bucketIndex]++;
        faces[bucketIndex] = moodFaces[entry.mood] || faces[bucketIndex];
    });

    const values = totals.map((total, index) =>
        counts[index]
            ? total / counts[index]
            : defaultTrendValues[index % defaultTrendValues.length]
    );


    const points =
        values.map((value, index) => {

            const x =
                (index / (pointCount - 1)) * 600;

            const y =
                140 -
                ((value - 1) / 4) * 105;

            return {
                x,
                y
            };

        });


    const path =
        points
            .map((point, index) => {

                return `${index ? "L" : "M"} ${
                    point.x.toFixed(1)
                } ${
                    point.y.toFixed(1)
                }`;

            })
            .join(" ");


    moodTrendLine.setAttribute(
        "d",
        path
    );


    moodTrendArea.setAttribute(
        "d",
        `${path} L 600 160 L 0 160 Z`
    );


    moodTrendPoints.innerHTML =
        points
            .map((point, index) => {

                return `
                    <circle
                        cx="${point.x}"
                        cy="${point.y}"
                        r="5"
                        tabindex="0"
                        aria-label="${labels[index]}: ${faces[index]}">
                    </circle>
                `;

            })
            .join("");


    graphMoods.style.gridTemplateColumns =
        `repeat(${pointCount}, 1fr)`;


    graphMoods.innerHTML =
        labels
            .map((label, index) => {

                return `
                    <div>
                        <span>${faces[index]}</span>
                        <small>${label}</small>
                    </div>
                `;

            })
            .join("");
}


/* =========================================
   PROGRESS
========================================= */

function renderProgress() {

    const checkins =
        getArray(moodStorageKey);

    const journals =
        getArray(journalStorageKey);

    const today = new Date();
    const periodStart = new Date(today);
    periodStart.setHours(0, 0, 0, 0);

    if (progressRange.value === "week") {
        periodStart.setDate(
            today.getDate() - ((today.getDay() + 6) % 7)
        );
    } else if (progressRange.value === "month") {
        periodStart.setDate(1);
    } else {
        periodStart.setMonth(0, 1);
    }

    const periodEnd = new Date(today);
    periodEnd.setHours(23, 59, 59, 999);

    const isInPeriod = date => {
        const parsedDate = new Date(date);
        return parsedDate >= periodStart && parsedDate <= periodEnd;
    };

    const periodCheckins =
        checkins.filter(entry => isInPeriod(`${entry.date}T00:00:00`));

    const periodJournals =
        journals.filter(entry =>
            isInPeriod(entry.createdAt || entry.date)
        );

    const daysInPeriod =
        progressRange.value === "week"
            ? 7
            : progressRange.value === "month"
                ? new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                ).getDate()
                : (new Date(today.getFullYear(), 11, 31).getTime()
                    - new Date(today.getFullYear(), 0, 1).getTime())
                    / (24 * 60 * 60 * 1000) + 1;

    const journalTarget =
        progressRange.value === "week"
            ? 5
            : progressRange.value === "month"
                ? 20
                : 60;

    const moodPercent =
        Math.min(100, Math.round((periodCheckins.length / daysInPeriod) * 100));


    const journalPercent =
        Math.min(100, Math.round((periodJournals.length / journalTarget) * 100));


    const overall =
        Math.round(
            (moodPercent + journalPercent) / 2
        );


    progressMoodPercent.textContent =
        `${moodPercent}%`;

    progressJournalPercent.textContent =
        `${journalPercent}%`;

    overallProgressValue.textContent =
        overall;

    if (progressDonut) {
        progressDonut.style.setProperty(
            "--mood-progress",
            moodPercent
        );
        progressDonut.style.setProperty(
            "--journal-progress",
            journalPercent
        );
    }
}


/* =========================================
   SAVE MOOD CHECK-IN
========================================= */

async function saveCheckinData() {

    const checkins =
        getArray(moodStorageKey);

    const date =
        getDateKey();


    const entry = {

        date,

        mood:
            selectedMood,

        sleep:
            selectedSleep,

        note:
            note.value.trim()
    };


    const existingIndex =
        checkins.findIndex(
            item => item.date === date
        );


    if (existingIndex >= 0) {

        checkins[existingIndex] =
            entry;

    } else {

        checkins.push(entry);

    }

    if (checkins.length > maxCheckins) {
        checkins.splice(0, checkins.length - maxCheckins);
    }


    localStorage.setItem(
        moodStorageKey,
        JSON.stringify(checkins)
    );

    const storedNotes = getSavedNotes();

    if (entry.note) {
        storedNotes.unshift({
            date,
            createdAt: new Date().toISOString(),
            text: entry.note,
            mood: selectedMood
        });
    }

    localStorage.setItem(
        checkinNotesStorageKey,
        JSON.stringify(storedNotes.slice(0, maxEntries))
    );

    try {
        await wellnessApiRequest("/mood", {
            method: "POST",
            body: JSON.stringify(entry)
        });
    } catch (error) {
        console.warn("Mood check-in saved locally but not synced:", error.message);
    }


    renderMoodTrend();

    renderProgress();
    currentNotePage = 1;
    renderSavedNotes();


    saveCheckin.textContent =
        "✓ Saved";


    showToast(
        `Check-in saved • ${selectedMood} mood • ${selectedSleep} sleep`
    );


    setTimeout(() => {

        saveCheckin.textContent =
            "Save Check-in";

    }, 1800);
}


saveCheckin.addEventListener(
    "click",
    saveCheckinData
);


/* =========================================
   JOURNAL STORAGE
========================================= */

function getJournalEntries() {

    return getArray(
        journalStorageKey
    ).sort((firstEntry, secondEntry) => {
        const firstTime = firstEntry.createdAt || "";
        const secondTime = secondEntry.createdAt || "";

        return secondTime.localeCompare(firstTime);
    });

}


/* =========================================
   RENDER JOURNAL HISTORY
========================================= */

function renderJournalEntries() {

    const entries =
        getJournalEntries();


    pastJournal.innerHTML = "";


    if (!entries.length) {

        pastJournal.innerHTML =
            `
                <p class="empty-journal">
                    Your saved journal entries
                    will appear here.
                </p>
            `;

        journalPagination.style.display =
            "none";

        return;
    }


    const totalPages =
        Math.ceil(
            entries.length /
            entriesPerPage
        );


    currentJournalPage =
        Math.min(
            currentJournalPage,
            totalPages
        );


    const start =
        (currentJournalPage - 1) *
        entriesPerPage;


    entries
        .slice(
            start,
            start + entriesPerPage
        )
        .forEach(entry => {

            const row =
                document.createElement("div");

            row.className =
                "past-entry";


            row.innerHTML = `
                <div>
                    <strong>${entry.date}</strong>

                    <p>
                        ${escapeHtml(entry.text)}
                    </p>
                </div>

                <span>
                    ${entry.mood || "Good"}
                    ${moodFaces[entry.mood] || moodFaces.Good}
                </span>
            `;


            pastJournal.appendChild(row);

        });


    journalPagination.style.display =
        "flex";


    pageIndicator.textContent =
        `Page ${currentJournalPage} of ${totalPages}`;


    previousPage.disabled =
        currentJournalPage === 1;


    nextPage.disabled =
        currentJournalPage === totalPages;
}


function getSavedNotes() {

    const storedNotes =
        localStorage.getItem(checkinNotesStorageKey);

    if (storedNotes !== null) {
        return getArray(checkinNotesStorageKey);
    }

    return getArray(moodStorageKey)
        .filter(entry => entry.note && entry.note.trim())
        .map(entry => ({
            date: entry.date,
            text: entry.note,
            mood: entry.mood
        }));
}


function renderSavedNotes() {

    const notes = getSavedNotes();

    savedNotes.innerHTML = "";

    if (!notes.length) {
        savedNotes.innerHTML =
            '<p class="empty-notes">Your saved check-in notes will appear here.</p>';
        notesPagination.style.display = "none";
        return;
    }

    const totalPages = Math.ceil(notes.length / notesPerPage);
    currentNotePage = Math.min(currentNotePage, totalPages);

    const start = (currentNotePage - 1) * notesPerPage;

    notes
        .slice(start, start + notesPerPage)
        .forEach(entry => {
            const row = document.createElement("div");
            row.className = "saved-note";
            row.innerHTML = `
                <div>
                    <strong>${entry.date}</strong>
                    <p>${escapeHtml(entry.text)}</p>
                </div>
                <span>${entry.mood || "Good"} ${moodFaces[entry.mood] || moodFaces.Good}</span>
            `;
            savedNotes.appendChild(row);
        });

    notesPagination.style.display = "flex";
    notePageIndicator.textContent =
        `Page ${currentNotePage} of ${totalPages}`;
    previousNotePage.disabled = currentNotePage === 1;
    nextNotePage.disabled = currentNotePage === totalPages;
}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================================
   SAVE JOURNAL
========================================= */

saveJournal.addEventListener(
    "click",
    async () => {

        const text =
            journalText.innerText.trim();


        if (!text) {

            showToast(
                "Write something in your journal first."
            );

            journalText.focus();

            return;
        }


        const entries =
            getJournalEntries();


        entries.unshift({

            date:
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                ),

            createdAt:
                new Date().toISOString(),

            text,

            mood:
                selectedMood,

            sleep:
                selectedSleep
        });


        localStorage.setItem(
            journalStorageKey,
            JSON.stringify(
                entries.slice(
                    0,
                    maxEntries
                )
            )
        );

        try {
            await wellnessApiRequest("/journal", {
                method: "POST",
                body: JSON.stringify({
                    content: text,
                    mood: selectedMood,
                    sleep: selectedSleep
                })
            });
        } catch (error) {
            console.warn("Journal entry saved locally but not synced:", error.message);
        }


        journalText.innerHTML = "";

        journalCounter.textContent =
            "0";


        currentJournalPage = 1;


        renderProgress();

        renderJournalEntries();


        saveJournal.textContent =
            "✓ Saved";


        showToast(
            "Your journal has been saved."
        );


        setTimeout(() => {

            saveJournal.textContent =
                "▣  Save Journal";

        }, 1800);

    }
);


/* =========================================
   JOURNAL TABS
========================================= */

const journalTabs =
    document.querySelectorAll(
        ".journal-tab"
    );


journalTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            journalTabs.forEach(t =>
                t.classList.remove(
                    "active"
                )
            );


            tab.classList.add(
                "active"
            );


            if (
                tab.dataset.tab ===
                "today"
            ) {

                todayJournal.style.display =
                    "block";

                pastJournal.style.display =
                    "none";

                journalPagination.style.display =
                    "none";

            } else {

                currentJournalPage = 1;
                renderJournalEntries();

                todayJournal.style.display =
                    "none";

                pastJournal.style.display =
                    "block";
            }

        }
    );

});


/* =========================================
   JOURNAL HISTORY
========================================= */

document
    .getElementById("historyButton")
    .addEventListener("click", () => {

        document
            .querySelector(
                '[data-tab="past"]'
            )
            .click();


        showToast(
            "Showing your journal history."
        );

    });


previousPage.addEventListener(
    "click",
    () => {

        if (currentJournalPage > 1) {

            currentJournalPage--;

            renderJournalEntries();

        }

    }
);


nextPage.addEventListener(
    "click",
    () => {

        const total =
            Math.ceil(
                getJournalEntries().length /
                entriesPerPage
            );


        if (
            currentJournalPage <
            total
        ) {

            currentJournalPage++;

            renderJournalEntries();

        }

    }
);


previousNotePage.addEventListener(
    "click",
    () => {

        if (currentNotePage > 1) {
            currentNotePage--;
            renderSavedNotes();
        }
    }
);


nextNotePage.addEventListener(
    "click",
    () => {

        const total =
            Math.ceil(getSavedNotes().length / notesPerPage);

        if (currentNotePage < total) {
            currentNotePage++;
            renderSavedNotes();
        }
    }
);


/* =========================================
   SIDEBAR / HEADER ACTIONS
========================================= */

document
    .getElementById("dashboardNavButton")
    .addEventListener("click", () => {

        window.location.href =
            "dashboard.html";

    });


document
    .getElementById("notificationBtn")
    ?.addEventListener("click", () => {

        showToast(
            "You have 3 new notifications."
        );

    });


document
    .getElementById("profileBtn")
    ?.addEventListener("click", () => {

        showToast(
            "Profile menu"
        );

    });


document
    .getElementById("detailsButton")
    .addEventListener("click", () => {

        showToast(
            "Detailed progress will open here."
        );

    });


/* =========================================
   PRIORITY
========================================= */

function updatePriority() {

    const key =
        localStorage.getItem(
            "wellnessTopPriority"
        ) || "Sleep Problems";


    const data =
        priorityData[key] ||
        priorityData["Sleep Problems"];


    prioritySelectorValue.textContent =
        `${data.icon} ${data.label}`;


    checkinQuestion.textContent =
        data.title;


    checkinContext.innerHTML =
        data.context.replace(
            data.context.includes(" is ")
                ? " is "
                : " is ",
            " is "
        );


    const sleepButtons =
        data.options
            .map(
                ([label, icon], index) => {

                    return `
                        <button
                            class="sleep-option${
                                label === selectedSleep
                                    ? " selected"
                                    : ""
                            }"
                            data-sleep="${label}">

                            <span
                                class="sleep-icon ${
                                    index === 0
                                        ? "poor"
                                        : index === 1
                                            ? "okay-sleep"
                                            : "good-sleep"
                                }">
                                ${icon}
                            </span>

                            <span>
                                ${label}
                            </span>

                            ${
                                label === selectedSleep
                                    ? '<span class="selected-check">✓</span>'
                                    : ""
                            }

                        </button>
                    `;

                }
            )
            .join("");


    sleepOptions.innerHTML =
        sleepButtons;


    selectedSleep =
        data.options.some(
            option =>
                option[0] === selectedSleep
        )
            ? selectedSleep
            : data.options[
                Math.min(
                    2,
                    data.options.length - 1
                )
            ][0];


    bindSleepOptions();
}


document
    .getElementById("prioritySelector")
    .addEventListener(
        "click",
        () => {

            const key =
                localStorage.getItem(
                    "wellnessTopPriority"
                ) || "Sleep Problems";


            showToast(
                `Current priority: ${
                    priorityData[key].label
                }`
            );

        }
    );


/* =========================================
   RANGE SELECTORS
========================================= */

function syncRanges(source) {

    if (source === progressRange) {

        trendRange.value =
            progressRange.value;

    } else {

        progressRange.value =
            trendRange.value;
    }


    renderMoodTrend();

    renderProgress();
}


progressRange.addEventListener(
    "change",
    () => syncRanges(progressRange)
);


trendRange.addEventListener(
    "change",
    () => syncRanges(trendRange)
);


/* =========================================
   INITIALIZE PAGE
========================================= */

async function syncRemoteMoodAndJournal() {
    if (!localStorage.getItem("token")) {
        return;
    }

    try {
        const [moodResponse, journalResponse] = await Promise.all([
            wellnessApiRequest("/mood/history"),
            wellnessApiRequest("/journal")
        ]);

        const remoteMoods = (moodResponse || []).map(entry => ({
            date: entry.date || entry.created_at?.slice(0, 10),
            mood: entry.mood,
            sleep: entry.sleep || "Good",
            note: entry.note || ""
        })).filter(entry => entry.date && entry.mood);

        const remoteJournals = (journalResponse || []).map(entry => ({
            date: new Date(entry.created_at || entry.createdAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
            ),
            createdAt: entry.created_at || entry.createdAt,
            text: entry.content || entry.text || "",
            mood: entry.mood || "Good",
            sleep: entry.sleep || "Good"
        })).filter(entry => entry.text);

        localStorage.setItem(moodStorageKey, JSON.stringify(remoteMoods.slice(0, maxCheckins)));
        localStorage.setItem(journalStorageKey, JSON.stringify(remoteJournals.slice(0, maxEntries)));
        localStorage.removeItem(checkinNotesStorageKey);

        loadTodayCheckin();
        renderMoodTrend();
        renderProgress();
        renderJournalEntries();
        renderSavedNotes();
    } catch (error) {
        console.warn("Using local Mood and Journal data:", error.message);
    }
}

updatePriority();

loadTodayCheckin();

renderMoodTrend();

renderProgress();

renderSavedNotes();

syncRemoteMoodAndJournal();