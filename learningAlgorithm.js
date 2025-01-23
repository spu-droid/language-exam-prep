import { controlButtons } from './app.js';

export const learningAlgorithm = {
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
        } else {
            console.error("Mode switch button not found.");
        }

        this.controlButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.handleControlButtonClick(button.getAttribute("data-difficulty"));
            });
        });
    },

    toggleMode: function(showAlert) {
        this.mode = (this.mode === "View") ? "Learn" : "View";
        const modeDisplay2 = document.getElementById("mode2");
        modeDisplay2.textContent = `Card Mode: ${this.mode}`;

        this.updateButtonStates();
    },

    updateButtonStates: function() {
        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");
        prevButton.disabled = this.mode !== "View";
        nextButton.disabled = this.mode !== "View";

        this.controlButtons.forEach(button => button.disabled = this.mode === "View");
    },

    handleControlButtonClick: function(difficulty) {
        console.log(`Button pressed: ${difficulty}`);
        // Implement your Anki-like algorithm here based on the difficulty
        const today = new Date().toLocaleDateString('en-GB');
        if (difficulty === "easy") {
            const wordRef = ref(database, `words/${currentDeck[this.currentIndex].id}`);
            update(wordRef, { lock_date: today })
                .then(() => {
                    console.log("Lock date set to today:", today);
                    this.advanceWord();
                })
                .catch(error => console.error("Failed to set lock date:", error));
        } else {
            this.advanceWord();
        }
    },

    advanceWord: function() {
        if (++this.currentIndex >= currentDeck.length) this.currentIndex = 0;
        this.displayCurrentWord();
    },

    displayCurrentWord: function() {
        if (currentDeck.length > 0 && currentDeck[this.currentIndex]) {
            const word = currentDeck[this.currentIndex];
            const card = document.getElementById("card");
            card.innerHTML = this.mode === "DE-IT" ? word.german : word.italian;
            const wordCount = document.getElementById("word-count");
            wordCount.textContent = `Words in total: ${currentDeck.length}`;
            const modeDisplay = document.getElementById("mode");
            modeDisplay.textContent = `Mode: ${this.mode}`;
        } else {
            this.showNoWordsMessage();
        }
    },

    showNoWordsMessage: function() {
        const card = document.getElementById("card");
        card.innerHTML = "No words in this deck! Please select another.";
        const wordCount = document.getElementById("word-count");
        wordCount.textContent = "Words in total: 0";
        const modeDisplay = document.getElementById("mode");
        modeDisplay.textContent = "";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize();
});
