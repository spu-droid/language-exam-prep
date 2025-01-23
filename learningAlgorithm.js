const learningAlgorithm = {
    mode: "View",
    controlButtons: document.querySelectorAll(".control-btn"),
    deckData: [],
    currentIndex: 0,
    countdownTimers: [],  // This will also track daily visibility blocks
    resetTimersDaily: [], // Tracks cards to be reset daily

    initialize: function() {
        this.setupEventListeners();
        this.toggleMode(false); // Initialize without alert
    },

    setupEventListeners: function() {
        const modeSwitchButton = document.getElementById("mode-switch");
        if (modeSwitchButton) {
            modeSwitchButton.addEventListener("click", () => this.toggleMode(true)); // Pass true to show alerts
            console.log("Event listener attached to mode-switch button.");
        } else {
            console.error("Mode switch button not found.");
        }

    },

    toggleMode: function() {
        console.log("Toggle mode called. Current mode:", this.mode);

        this.mode = (this.mode === "View") ? "Learn" : "View";
        console.log("New mode after toggle:", this.mode);

        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");
        const modeDisplay2 = document.getElementById("mode2");

        prevButton.disabled = this.mode !== "View";
        nextButton.disabled = this.mode !== "View";
        this.controlButtons.forEach(button => button.disabled = this.mode === "View");
        modeDisplay2.textContent = `Card Mode: ${this.mode}`;

    }
};


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    // you can safely run your DOM manipulations here
    console.log(controlButtons); // this should now work without errors
});


controlButtons.forEach(button => {
    button.addEventListener("click", () => {
        console.log("Control button clicked:", button.getAttribute("data-difficulty"));
        if (button.getAttribute("data-difficulty") === "easy") {
            console.log("Easy button pressed");
            // Implement your Anki-like algorithm here for "easy"
			const today = new Date().toLocaleDateString('en-GB');
			const wordRef = ref(database, `words/${currentDeck[currentIndex].id}`);
            update(wordRef, { lock_date: today })
                .then(() => console.log("Lock date set to today:", today))
                .catch(error => console.error("Failed to set lock date:", error));
        } else if (button.getAttribute("data-difficulty") === "again") {
            console.log("Again button pressed");
            // Implement the action for "again"
			learningFlashcards(deck);
        } else if (button.getAttribute("data-difficulty") === "hard") {
            console.log("Hard button pressed");
            // Implement the action for "hard"
			learningFlashcards(deck);
        } else if (button.getAttribute("data-difficulty") === "good") {
            console.log("Good button pressed");
            // Implement the action for "good"
			learningFlashcards(deck);
        } else {
            console.log("Unknown difficulty button pressed");
            // Handle any other cases or ignore
        }
    });
});

function learningFlashcards(deck) {
    const wordsRef = ref(database, 'words');
    onValue(wordsRef, snapshot => {
        const data = snapshot.val();
        currentDeck = Object.entries(data).filter(([key, word]) => word.category && word.category.includes(deck)).map(([key, word]) => ({...word, id: key}));
        currentIndex = 0;
        nextAvailableWord();
    }, {
        onlyOnce: true
    });
}

function nextAvailableWord() {
    const today = new Date().toLocaleDateString('en-GB');
    while (currentIndex < currentDeck.length && currentDeck[currentIndex].lock_date === today) {
        currentIndex++; // Skip the word locked for today
    }
    displayWord(); // Display the next available word
}


function displayWord() {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
        modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    } else {
        card.innerHTML = "No words in this deck! Please select another.";
        wordCount.textContent = "Words in total: 0";
        modeDisplay.textContent = "";
    }
}

