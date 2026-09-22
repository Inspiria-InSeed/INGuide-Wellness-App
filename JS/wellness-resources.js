/* =====================================================
   WELLNESS RESOURCES
   JAVASCRIPT
===================================================== */


/* =====================================================
   CATEGORY FILTER
===================================================== */

const categories =
    document.querySelectorAll(".category");

const resourceCards =
    document.querySelectorAll(".resource-card");

const noResults =
    document.getElementById("noResults");


categories.forEach(category => {

    category.addEventListener("click", () => {


        /* Remove active */

        categories.forEach(item => {

            item.classList.remove("active");

        });


        /* Add active */

        category.classList.add("active");


        const selectedCategory =
            category.dataset.category;


        let visibleCards = 0;


        resourceCards.forEach(card => {


            const cardCategory =
                card.dataset.category;


            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {

                card.style.display = "block";

                visibleCards++;

            }

            else {

                card.style.display = "none";

            }

        });


        /* No result message */

        if (visibleCards === 0) {

            noResults.style.display = "block";

        }

        else {

            noResults.style.display = "none";

        }

    });

});



/* =====================================================
   SEARCH
===================================================== */

const searchInput =
    document.getElementById("resourceSearch");


searchInput.addEventListener("input", () => {


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    let visibleCards = 0;


    resourceCards.forEach(card => {


        const title =
            card.dataset.title.toLowerCase();


        const category =
            card.dataset.category.toLowerCase();


        const description =
            card.querySelector("p")
                .textContent
                .toLowerCase();


        if (
            title.includes(searchValue) ||
            category.includes(searchValue) ||
            description.includes(searchValue)
        ) {

            card.style.display = "block";

            visibleCards++;

        }

        else {

            card.style.display = "none";

        }

    });


    if (visibleCards === 0) {

        noResults.style.display = "block";

    }

    else {

        noResults.style.display = "none";

    }

});



/* =====================================================
   READ MORE BUTTON
===================================================== */

const readMoreButtons =
    document.querySelectorAll(".read-more");


readMoreButtons.forEach(button => {


    button.addEventListener("click", () => {


        const card =
            button.closest(".resource-card");


        const title =
            card.dataset.title;


        alert(
            `Opening resource: ${title}`
        );

    });

});



/* =====================================================
   ADD NOTE MODAL
===================================================== */

const addNoteButton =
    document.getElementById("addNoteButton");

const noteModal =
    document.getElementById("noteModal");

const closeModal =
    document.getElementById("closeModal");

const saveNote =
    document.getElementById("saveNote");

const noteTitle =
    document.getElementById("noteTitle");

const noteText =
    document.getElementById("noteText");



/* OPEN MODAL */

addNoteButton.addEventListener("click", () => {

    noteModal.classList.add("show");

    noteTitle.focus();

});



/* CLOSE MODAL */

closeModal.addEventListener("click", () => {

    noteModal.classList.remove("show");

});



/* CLICK OUTSIDE */

noteModal.addEventListener("click", event => {

    if (event.target === noteModal) {

        noteModal.classList.remove("show");

    }

});



/* ESCAPE KEY */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        noteModal.classList.remove("show");

    }

});



/* =====================================================
   SAVE NOTE
===================================================== */

saveNote.addEventListener("click", () => {

    const title =
        noteTitle.value.trim();

    const text =
        noteText.value.trim();

    const categoryElement =
        document.getElementById("noteCategory");

    const category =
        categoryElement
            ? categoryElement.value
            : "important";


    if (!title || !text) {

        alert(
            "Please enter both a title and your note."
        );

        return;

    }


    /* Create new note */

    const newNote = {

        id: Date.now(),

        title: title,

        text: text,

        category: category,

        date:
            new Date().toLocaleDateString()

    };


    /* Add note */

    wellnessNotes.push(newNote);


    /* Save notes */

    localStorage.setItem(
        "wellnessNotes",
        JSON.stringify(wellnessNotes)
    );


    /* Update sidebar numbers */

    updateMyNotesCounts();


    /* Clear form */

    noteTitle.value = "";

    noteText.value = "";


    if (categoryElement) {

        categoryElement.value =
            "important";

    }


    /* Close modal */

    noteModal.classList.remove("show");


    /* Success message */

    if (typeof showToast === "function") {

        showToast(
            "Your note has been saved successfully!"
        );

    } else {

        alert(
            "Your note has been saved successfully!"
        );

    }

});



/* =====================================================
   NOTIFICATION
===================================================== */

const notificationButton =
    document.querySelector(".notification-btn");


notificationButton.addEventListener("click", () => {

    alert(
        "You have 3 new wellness reminders."
    );

});



/* =====================================================
   PROFILE
===================================================== */

const profileArea =
    document.querySelector(".profile-area");


profileArea.addEventListener("click", () => {

    alert(
        "Profile menu clicked."
    );

});







/* =====================================================
   RESOURCE SORTING
===================================================== */

const sortButton =
    document.querySelector(".sort-button");


const resourceGrid =
    document.querySelector(".resource-grid");


/* =====================================================
   CREATE SORT MENU
===================================================== */

const sortMenu =
    document.createElement("div");


sortMenu.className =
    "sort-menu";


sortMenu.innerHTML = `

    <button data-sort="recent">
        🕒 Most Recent
    </button>

    <button data-sort="popular">
        ⭐ Most Popular
    </button>

    <button data-sort="recommended">
        💜 Recommended
    </button>

`;


sortButton.parentElement.style.position =
    "relative";


sortButton.parentElement.appendChild(
    sortMenu
);



/* =====================================================
   OPEN / CLOSE SORT MENU
===================================================== */

sortButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        sortMenu.classList.toggle("show");

    }
);



/* =====================================================
   SORT RESOURCE CARDS
===================================================== */

sortMenu
    .querySelectorAll("button")
    .forEach(option => {

        option.addEventListener(
            "click",
            event => {

                const sortType =
                    event.currentTarget.dataset.sort;


                sortResources(
                    sortType
                );


                sortMenu.classList.remove(
                    "show"
                );

            }
        );

    });



/* =====================================================
   SORT FUNCTION
===================================================== */

function sortResources(sortType) {

    const cards =
        Array.from(
            resourceGrid.querySelectorAll(
                ".resource-card"
            )
        );


    /* =================================================
       MOST RECENT
    ================================================= */

    if (sortType === "recent") {

        cards.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.dataset.date || "2026-01-01"
                    );


                const dateB =
                    new Date(
                        b.dataset.date || "2026-01-01"
                    );


                return dateB - dateA;

            }
        );

    }



    /* =================================================
       MOST POPULAR
    ================================================= */

    else if (sortType === "popular") {

        cards.sort(
            (a, b) => {

                const popularityA =
                    Number(
                        a.dataset.popularity || 0
                    );


                const popularityB =
                    Number(
                        b.dataset.popularity || 0
                    );


                return popularityB -
                       popularityA;

            }
        );

    }



    /* =================================================
       RECOMMENDED
    ================================================= */

    else if (sortType === "recommended") {

        cards.sort(
            (a, b) => {

                const recommendedA =
                    Number(
                        a.dataset.recommended || 0
                    );


                const recommendedB =
                    Number(
                        b.dataset.recommended || 0
                    );


                return recommendedB -
                       recommendedA;

            }
        );

    }



    /* =================================================
       PUT CARDS BACK
    ================================================= */

    cards.forEach(card => {

        resourceGrid.appendChild(
            card
        );

    });


    /* Update button text */

    if (sortType === "recent") {

        sortButton.innerHTML =
            `Most Recent <span>⌄</span>`;

    }


    else if (sortType === "popular") {

        sortButton.innerHTML =
            `Most Popular <span>⌄</span>`;

    }


    else if (sortType === "recommended") {

        sortButton.innerHTML =
            `Recommended <span>⌄</span>`;

    }

}



/* =====================================================
   CLOSE SORT MENU WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            !sortButton.contains(event.target) &&
            !sortMenu.contains(event.target)
        ) {

            sortMenu.classList.remove(
                "show"
            );

        }

    }
);





/* =====================================================
   MY NOTES SECTION
===================================================== */


/* =====================================================
   LOAD SAVED NOTES
===================================================== */

let wellnessNotes =
    JSON.parse(
        localStorage.getItem("wellnessNotes")
    ) || [];


/* =====================================================
   NOTE CATEGORY NAMES
===================================================== */

const noteCategoryNames = {

    important: "Important for me",

    later: "To read later",

    favorites: "Favorites",

    growth: "Personal growth"

};


/* =====================================================
   UPDATE NOTE COUNTS
===================================================== */

function updateMyNotesCounts() {

    const important =
        wellnessNotes.filter(
            note =>
                note.category === "important"
        ).length;


    const later =
        wellnessNotes.filter(
            note =>
                note.category === "later"
        ).length;


    const favorites =
        wellnessNotes.filter(
            note =>
                note.category === "favorites"
        ).length;


    const growth =
        wellnessNotes.filter(
            note =>
                note.category === "growth"
        ).length;


    const importantCount =
        document.getElementById(
            "importantCount"
        );


    const laterCount =
        document.getElementById(
            "laterCount"
        );


    const favoriteCount =
        document.getElementById(
            "favoriteCount"
        );


    const growthCount =
        document.getElementById(
            "growthCount"
        );


    if (importantCount) {

        importantCount.textContent =
            important;

    }


    if (laterCount) {

        laterCount.textContent =
            later;

    }


    if (favoriteCount) {

        favoriteCount.textContent =
            favorites;

    }


    if (growthCount) {

        growthCount.textContent =
            growth;

    }

}


/* Run when page opens */

updateMyNotesCounts();



/* =====================================================
   CATEGORY BUTTONS
===================================================== */

const noteRows =
    document.querySelectorAll(
        ".note-row[data-note-category]"
    );


noteRows.forEach(row => {

    row.addEventListener(
        "click",
        () => {

            const category =
                row.dataset.noteCategory;


            openNotesWindow(category);

        }
    );

});



/* =====================================================
   VIEW ALL NOTES
===================================================== */

const viewAllNotes =
    document.getElementById(
        "viewAllNotes"
    );


if (viewAllNotes) {

    viewAllNotes.addEventListener(
        "click",
        () => {

            openNotesWindow("all");

        }
    );

}



/* =====================================================
   OPEN NOTES WINDOW
===================================================== */

function openNotesWindow(category) {


    /* Remove existing window */

    const oldWindow =
        document.getElementById(
            "notesViewOverlay"
        );


    if (oldWindow) {

        oldWindow.remove();

    }


    /* Filter notes */

    let filteredNotes;


    if (category === "all") {

        filteredNotes =
            wellnessNotes;

    } else {

        filteredNotes =
            wellnessNotes.filter(
                note =>
                    note.category === category
            );

    }


    /* Window title */

    const title =
        category === "all"
            ? "All My Notes"
            : noteCategoryNames[category];


    /* Create overlay */

    const overlay =
        document.createElement("div");


    overlay.id =
        "notesViewOverlay";


    overlay.className =
        "notes-view-overlay";


    /* Create notes HTML */

    let notesHTML = "";


    if (filteredNotes.length === 0) {

        notesHTML = `

            <div class="empty-notes">

                <div class="empty-notes-icon">
                    📝
                </div>

                <h3>
                    No notes here yet
                </h3>

                <p>
                    Add a note to see it here.
                </p>

            </div>

        `;

    } else {

        notesHTML =
            filteredNotes
                .map(note => `

                    <div
                        class="single-note"
                    >

                        <div
                            class="single-note-content"
                        >

                            <div
                                class="single-note-title"
                            >

                                ${escapeNoteHTML(
                                    note.title
                                )}

                            </div>


                            <div
                                class="single-note-text"
                            >

                                ${escapeNoteHTML(
                                    note.text
                                )}

                            </div>


                            <span
                                class="single-note-category"
                            >

                                ${
                                    noteCategoryNames[
                                        note.category
                                    ] ||
                                    "Note"
                                }

                            </span>

                        </div>


                        <button
                            class="delete-note-button"
                            data-id="${note.id}"
                        >

                            🗑️

                        </button>

                    </div>

                `)
                .join("");

    }


    /* Window */

    overlay.innerHTML = `

        <div class="notes-view-box">

            <button
                class="close-notes-view"
                id="closeNotesView"
            >

                ×

            </button>


            <h2>
                ${title}
            </h2>


            <p class="notes-view-subtitle">

                ${filteredNotes.length}

                ${
                    filteredNotes.length === 1
                        ? "note"
                        : "notes"
                }

            </p>


            <div class="notes-list">

                ${notesHTML}

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    /* Animation */

    setTimeout(() => {

        overlay.classList.add("show");

    }, 10);


    /* Close button */

    document
        .getElementById(
            "closeNotesView"
        )
        .addEventListener(
            "click",
            () => {

                overlay.remove();

            }
        );


    /* Click outside */

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                overlay.remove();

            }

        }
    );


    /* Delete buttons */

    overlay
        .querySelectorAll(
            ".delete-note-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const confirmDelete =
                        confirm(
                            "Delete this note?"
                        );


                    if (!confirmDelete) {

                        return;

                    }


                    wellnessNotes =
                        wellnessNotes.filter(
                            note =>
                                note.id !== id
                        );


                    localStorage.setItem(
                        "wellnessNotes",
                        JSON.stringify(
                            wellnessNotes
                        )
                    );


                    updateMyNotesCounts();


                    overlay.remove();


                    openNotesWindow(
                        category
                    );

                }
            );

        });

}



/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            const overlay =
                document.getElementById(
                    "notesViewOverlay"
                );


            if (overlay) {

                overlay.remove();

            }

        }

    }
);



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeNoteHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}