import { controlButtons } from './app.js';

export const learningAlgorithm = {
    mode: "View",
    controlButtons: document.querySelectorAll(".control-btn"),
    deckData: [],
    currentIndex: 0,
    countdownTimers: [],
    resetTimersDaily: [],

    initialize: function() {
        this.setupEventListeners();
        this.toggleMode(false);
    },

    setupEventListeners: function() {
        const modeSwitchButton = document.getElementById("mode-switch");
        if (modeSwitchButton) {
            modeSwitchButton.addEventListener("click", () => this.toggleMode(true));
        } else {
            console.error("Mode switch button not found.");
        }
    },

    toggleMode: function() {
        this.mode = (this.mode === "View") ? "Learn" : "View";
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
    learningFlashcards("defaultDeck"); // Initialize with a default or selected deck
});

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
    while (currentIndex < currentDeck.length) {
        if (currentDeck[currentIndex].lock_date !== today) {
            displayWord();
            break;
        }
        currentIndex++;
    }

    if (currentIndex >= currentDeck.length) {
        card.innerHTML = "No available words to review today. Please come back tomorrow.";
        wordCount.textContent = "Words in total: " + currentDeck.length;
        modeDisplay.textContent = "";
    }
}

