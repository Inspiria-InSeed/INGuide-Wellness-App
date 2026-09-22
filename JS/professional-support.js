/* =========================================
   PROFESSIONAL SUPPORT - MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* Existing pages */
    setupProfessionalFilters();
    setupProfessionalSearch();
    loadURLFilter();
    setupRequestSupport();

    /* Professional details page */
    setupProfessionalDetails();
    setupSupportMethods();
    setupDetailsRequestButton();

    /* Request support page */
    setupSupportTypeSelection();
    setupSupportRequestForm();

    /* Date and time page */
    setupDateSelection();
    setupTimeSelection();
    setupDateTimeContinue();

    /* Review page */
    loadReviewDetails();
    setupSubmitRequest();

    /* Success page */
    loadSuccessDetails();

    /* General */
    setupLogout();

});


/* =========================================
   GO BACK
========================================= */

function goBack() {
    window.history.back();
}


/* =========================================
   SELECT PROFESSIONAL
   Called from find-professionals.html
========================================= */

function selectProfessional(name, category, availability) {

    const professional = {
        name: name,
        category: category,
        availability: availability,
        selectedAt: new Date().toISOString()
    };


    localStorage.setItem(
        "selectedProfessional",
        JSON.stringify(professional)
    );


    window.location.href =
        "professional-details.html";
}


/* =========================================
   PROFESSIONAL FILTERS
========================================= */

function setupProfessionalFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    if (filterButtons.length === 0) {
        return;
    }


    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            this.classList.add("active");


            const selectedFilter =
                this.dataset.filter;


            filterProfessionals(selectedFilter);

        });

    });

}


/* =========================================
   FILTER PROFESSIONALS
========================================= */

function filterProfessionals(filter) {

    const cards =
        document.querySelectorAll(".professional-card");

    const noResults =
        document.getElementById("noResults");


    let visibleCards = 0;


    cards.forEach(card => {

        const categories =
            (card.dataset.category || "").toLowerCase();


        if (
            filter === "all" ||
            categories.includes(filter.toLowerCase())
        ) {

            card.style.display = "flex";

            visibleCards++;

        } else {

            card.style.display = "none";

        }

    });


    if (noResults) {

        noResults.style.display =
            visibleCards === 0
                ? "block"
                : "none";

    }

}


/* =========================================
   SEARCH PROFESSIONALS
========================================= */

function setupProfessionalSearch() {

    const searchInput =
        document.getElementById("professionalSearch");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase().trim();


        const cards =
            document.querySelectorAll(".professional-card");


        const noResults =
            document.getElementById("noResults");


        let visibleCards = 0;


        cards.forEach(card => {

            const name =
                (card.dataset.name || "").toLowerCase();


            const categories =
                (card.dataset.category || "").toLowerCase();


            const content =
                card.textContent.toLowerCase();


            if (
                name.includes(searchValue) ||
                categories.includes(searchValue) ||
                content.includes(searchValue)
            ) {

                card.style.display = "flex";

                visibleCards++;

            } else {

                card.style.display = "none";

            }

        });


        if (noResults) {

            noResults.style.display =
                visibleCards === 0
                    ? "block"
                    : "none";

        }


        if (searchValue !== "") {

            document
                .querySelectorAll(".filter-btn")
                .forEach(button => {

                    button.classList.remove("active");

                });

        }

    });

}


/* =========================================
   LOAD FILTER FROM URL
========================================= */

function loadURLFilter() {

    const urlParams =
        new URLSearchParams(window.location.search);


    const filter =
        urlParams.get("filter");


    if (!filter) {
        return;
    }


    const filterButton =
        document.querySelector(
            `.filter-btn[data-filter="${filter}"]`
        );


    if (filterButton) {

        document
            .querySelectorAll(".filter-btn")
            .forEach(button => {

                button.classList.remove("active");

            });


        filterButton.classList.add("active");


        filterProfessionals(filter);

    }

}


/* =========================================
   PROFESSIONAL SUPPORT LANDING PAGE
========================================= */

function setupRequestSupport() {

    const requestButton =
        document.getElementById("requestSupportBtn");


    if (!requestButton) {
        return;
    }


    requestButton.addEventListener("click", function () {

        /* Start a new request */

        localStorage.removeItem("supportRequest");

        window.location.href =
            "request-support.html";

    });

}


/* =========================================
   PROFESSIONAL DETAILS PAGE
========================================= */

function setupProfessionalDetails() {

    const nameElement =
        document.getElementById("professionalName");


    /* Not on professional details page */

    if (!nameElement) {
        return;
    }


    const savedProfessional =
        localStorage.getItem("selectedProfessional");


    /* Default professional if opened directly */

    if (!savedProfessional) {

        const defaultProfessional = {
            name: "Student Counseling Service",
            category: "Academic Stress, Emotional Well-being",
            availability: "Available"
        };


        localStorage.setItem(
            "selectedProfessional",
            JSON.stringify(defaultProfessional)
        );

    }


    const professional =
        JSON.parse(
            localStorage.getItem("selectedProfessional")
        );


    /* Name */

    nameElement.textContent =
        professional.name;


    /* Category */

    const categoryElement =
        document.getElementById("professionalCategory");


    if (categoryElement) {

        categoryElement.textContent =
            `Specialized in ${professional.category}`;

    }


    /* Availability */

    const availabilityElement =
        document.getElementById("professionalAvailability");


    if (availabilityElement) {

        availabilityElement.textContent =
            professional.availability;

    }


    /* About */

    const aboutElement =
        document.getElementById("professionalAbout");


    if (aboutElement) {

        aboutElement.textContent =
            `${professional.name} provides confidential and supportive guidance for students. Support is available based on individual needs and concerns.`;

    }


    /* Support areas */

    const supportAreas =
        document.getElementById("supportAreas");


    if (supportAreas) {

        supportAreas.innerHTML = "";


        const categories =
            professional.category
                .split(",");


        const additionalAreas = [
            "Emotional Well-being",
            "Personal Growth"
        ];


        const allAreas =
            [...categories, ...additionalAreas];


        const uniqueAreas =
            [...new Set(
                allAreas.map(
                    area => area.trim()
                )
            )];


        uniqueAreas.forEach(area => {

            const supportArea =
                document.createElement("div");


            supportArea.className =
                "support-area";


            supportArea.innerHTML = `
                <i class="fa-solid fa-check"></i>
                <span>${area}</span>
            `;


            supportAreas.appendChild(
                supportArea
            );

        });

    }

}


/* =========================================
   SUPPORT METHOD SELECTION
========================================= */

function setupSupportMethods() {

    const methods =
        document.querySelectorAll(".support-method");


    if (methods.length === 0) {
        return;
    }


    const savedMethod =
        localStorage.getItem("supportMethod");


    if (savedMethod) {

        methods.forEach(method => {

            if (
                method.dataset.method === savedMethod
            ) {

                methods.forEach(item => {
                    item.classList.remove("active");
                });


                method.classList.add("active");

            }

        });

    }


    methods.forEach(method => {

        method.addEventListener("click", function () {

            methods.forEach(item => {
                item.classList.remove("active");
            });


            this.classList.add("active");


            localStorage.setItem(
                "supportMethod",
                this.dataset.method
            );

        });

    });


    /* Default selection */

    if (!localStorage.getItem("supportMethod")) {

        const activeMethod =
            document.querySelector(
                ".support-method.active"
            );


        if (activeMethod) {

            localStorage.setItem(
                "supportMethod",
                activeMethod.dataset.method
            );

        }

    }

}


/* =========================================
   REQUEST BUTTON FROM PROFESSIONAL DETAILS
========================================= */

function setupDetailsRequestButton() {

    const requestButton =
        document.getElementById("detailsRequestBtn");


    if (!requestButton) {
        return;
    }


    requestButton.addEventListener("click", function () {

        window.location.href =
            "request-support.html";

    });

}


/* =========================================
   SUPPORT TYPE SELECTION
========================================= */

function setupSupportTypeSelection() {

    const supportTypes =
        document.querySelectorAll(
            ".support-type-card"
        );


    if (supportTypes.length === 0) {
        return;
    }


    supportTypes.forEach(card => {

        card.addEventListener("click", function () {

            supportTypes.forEach(item => {

                item.classList.remove("active");

            });


            this.classList.add("active");


            localStorage.setItem(
                "supportType",
                this.dataset.type
            );


            const continueButton =
                document.getElementById(
                    "supportTypeContinueBtn"
                );


            if (continueButton) {

                continueButton.disabled = false;

            }

        });

    });


    /* Restore previous selection */

    const savedType =
        localStorage.getItem("supportType");


    if (savedType) {

        supportTypes.forEach(card => {

            if (
                card.dataset.type === savedType
            ) {

                card.classList.add("active");

            }

        });

    }

}


/* =========================================
   SUPPORT REQUEST FORM
========================================= */

function setupSupportRequestForm() {

    const continueButton =
        document.getElementById(
            "supportTypeContinueBtn"
        );


    if (!continueButton) {
        return;
    }


    continueButton.addEventListener(
        "click",
        function () {

            const selectedType =
                localStorage.getItem(
                    "supportType"
                );


            if (!selectedType) {

                alert(
                    "Please select a support type."
                );

                return;
            }


            /* Save optional details */

            const description =
                document.getElementById(
                    "supportDescription"
                );


            if (description) {

                localStorage.setItem(
                    "supportDescription",
                    description.value.trim()
                );

            }


            window.location.href =
                "select-date-time.html";

        }
    );

}


/* =========================================
   DATE SELECTION
========================================= */

function setupDateSelection() {

    const dateInput =
        document.getElementById(
            "supportDate"
        );


    if (!dateInput) {
        return;
    }


    /* Prevent selecting past dates */

    const today =
        new Date();


    const formattedToday =
        today.toISOString()
            .split("T")[0];


    dateInput.min =
        formattedToday;


    /* Restore saved date */

    const savedDate =
        localStorage.getItem(
            "supportDate"
        );


    if (savedDate) {

        dateInput.value =
            savedDate;

    }


    dateInput.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "supportDate",
                this.value
            );

        }
    );

}


/* =========================================
   TIME SLOT SELECTION
========================================= */

function setupTimeSelection() {

    const timeSlots =
        document.querySelectorAll(
            ".time-slot"
        );


    if (timeSlots.length === 0) {
        return;
    }


    const savedTime =
        localStorage.getItem(
            "supportTime"
        );


    if (savedTime) {

        timeSlots.forEach(slot => {

            if (
                slot.dataset.time === savedTime
            ) {

                slot.classList.add("active");

            }

        });

    }


    timeSlots.forEach(slot => {

        slot.addEventListener(
            "click",
            function () {

                timeSlots.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                localStorage.setItem(
                    "supportTime",
                    this.dataset.time
                );

            }
        );

    });

}


/* =========================================
   DATE & TIME CONTINUE
========================================= */

function setupDateTimeContinue() {

    const continueButton =
        document.getElementById(
            "dateTimeContinueBtn"
        );


    if (!continueButton) {
        return;
    }


    continueButton.addEventListener(
        "click",
        function () {

            const date =
                document.getElementById(
                    "supportDate"
                );


            const selectedDate =
                date ? date.value : "";


            const selectedTime =
                localStorage.getItem(
                    "supportTime"
                );


            if (!selectedDate) {

                alert(
                    "Please select a date."
                );

                return;

            }


            if (!selectedTime) {

                alert(
                    "Please select a time."
                );

                return;

            }


            localStorage.setItem(
                "supportDate",
                selectedDate
            );


            window.location.href =
                "review-request.html";

        }
    );

}


/* =========================================
   LOAD REVIEW DETAILS
========================================= */

function loadReviewDetails() {

    const reviewPage =
        document.getElementById(
            "reviewRequestPage"
        );


    if (!reviewPage) {
        return;
    }


    const professional =
        JSON.parse(
            localStorage.getItem(
                "selectedProfessional"
            ) || "{}"
        );


    const supportType =
        localStorage.getItem(
            "supportType"
        ) || "Not selected";


    const supportMethod =
        localStorage.getItem(
            "supportMethod"
        ) || "Not selected";


    const supportDate =
        localStorage.getItem(
            "supportDate"
        ) || "Not selected";


    const supportTime =
        localStorage.getItem(
            "supportTime"
        ) || "Not selected";


    const description =
        localStorage.getItem(
            "supportDescription"
        ) || "No additional details provided.";


    setElementText(
        "reviewProfessional",
        professional.name || "General Professional Support"
    );


    setElementText(
        "reviewSupportType",
        supportType
    );


    setElementText(
        "reviewSupportMethod",
        supportMethod
    );


    setElementText(
        "reviewDate",
        formatDate(supportDate)
    );


    setElementText(
        "reviewTime",
        supportTime
    );


    setElementText(
        "reviewDescription",
        description
    );

}


/* =========================================
   SUBMIT SUPPORT REQUEST
========================================= */

function setupSubmitRequest() {

    const submitButton =
        document.getElementById(
            "submitSupportRequestBtn"
        );


    if (!submitButton) {
        return;
    }


    submitButton.addEventListener(
        "click",
        async function () {

            const professional =
                JSON.parse(
                    localStorage.getItem(
                        "selectedProfessional"
                    ) || "{}"
                );


            const supportRequest = {

                professional:
                    professional.name ||
                    "General Professional Support",

                supportType:
                    localStorage.getItem(
                        "supportType"
                    ),

                supportMethod:
                    localStorage.getItem(
                        "supportMethod"
                    ),

                date:
                    localStorage.getItem(
                        "supportDate"
                    ),

                time:
                    localStorage.getItem(
                        "supportTime"
                    ),

                description:
                    localStorage.getItem(
                        "supportDescription"
                    ),

                status: "Submitted",

                requestId:
                    "REQ-" +
                    Date.now(),

                submittedAt:
                    new Date().toISOString()

            };


            /* Save completed request */

            localStorage.setItem(
                "latestSupportRequest",
                JSON.stringify(supportRequest)
            );

            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

            try {
                const savedRequest = await wellnessApiRequest("/support", {
                    method: "POST",
                    body: JSON.stringify({
                        subject: `Professional support: ${supportRequest.supportType || "General support"}`,
                        description: [
                            `Professional: ${supportRequest.professional}`,
                            `Method: ${supportRequest.supportMethod || "Not selected"}`,
                            `Date: ${supportRequest.date || "Not selected"}`,
                            `Time: ${supportRequest.time || "Not selected"}`,
                            `Details: ${supportRequest.description || "No additional details provided."}`
                        ].join("\n"),
                        category: "wellness",
                        priority: "normal"
                    })
                });

                localStorage.setItem(
                    "latestSupportRequest",
                    JSON.stringify({
                        ...supportRequest,
                        requestId: `REQ-${savedRequest.id}`,
                        submittedAt: savedRequest.created_at || supportRequest.submittedAt
                    })
                );
            } catch (error) {
                console.warn("Support request saved locally but not synced:", error.message);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }


            window.location.href =
                "request-success.html";

        }
    );

}


/* =========================================
   SUCCESS PAGE
========================================= */

function loadSuccessDetails() {

    const successPage =
        document.getElementById(
            "requestSuccessPage"
        );


    if (!successPage) {
        return;
    }


    const request =
        JSON.parse(
            localStorage.getItem(
                "latestSupportRequest"
            ) || "{}"
        );


    setElementText(
        "successProfessional",
        request.professional ||
        "Professional Support"
    );


    setElementText(
        "successDate",
        formatDate(request.date)
    );


    setElementText(
        "successTime",
        request.time ||
        "To be confirmed"
    );


    setElementText(
        "requestId",
        request.requestId ||
        "Pending"
    );

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (
        !dateString ||
        dateString === "Not selected"
    ) {

        return "Not selected";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {

            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"

        }
    );

}


/* =========================================
   HELPER - SET TEXT
========================================= */

function setElementText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   LOGOUT
========================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                /* Clear professional support data */

                localStorage.removeItem(
                    "selectedProfessional"
                );

                localStorage.removeItem(
                    "supportMethod"
                );

                localStorage.removeItem(
                    "supportType"
                );

                localStorage.removeItem(
                    "supportDescription"
                );

                localStorage.removeItem(
                    "supportDate"
                );

                localStorage.removeItem(
                    "supportTime"
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}
/* =========================================
   LOAD SUCCESS REQUEST DETAILS
========================================= */

function loadSuccessRequest() {

    const professionalElement =
        document.getElementById("successProfessional");

    if (!professionalElement) {
        return;
    }


    const savedRequest =
        JSON.parse(
            localStorage.getItem("latestSupportRequest")
        );


    if (!savedRequest) {
        return;
    }


    const selectedProfessional =
        savedRequest.professional ||
        savedRequest.name ||
        "Support Professional";


    const supportType =
        savedRequest.supportType ||
        savedRequest.category ||
        "General Support";


    const selectedDate =
        savedRequest.date ||
        "Not selected";


    const selectedTime =
        savedRequest.time ||
        "Not selected";


    professionalElement.textContent =
        selectedProfessional;


    document.getElementById(
        "successSupportType"
    ).textContent = supportType;


    document.getElementById(
        "successDate"
    ).textContent =
        formatSupportDate(selectedDate);


    document.getElementById(
        "successTime"
    ).textContent =
        selectedTime;

}


/* =========================================
   FORMAT DATE
========================================= */

function formatSupportDate(date) {

    if (
        !date ||
        date === "Not selected"
    ) {
        return "Not selected";
    }


    const formattedDate =
        new Date(date);


    if (
        isNaN(formattedDate.getTime())
    ) {
        return date;
    }


    return formattedDate.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}