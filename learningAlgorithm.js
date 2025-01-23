

export const learningAlgorithm = {
    mode: "View",
    controlButtons: document.querySelectorAll(".control-btn"),
    deckData: [],
    currentIndex: 0,
    resetTimersDaily: [],

    initialize: function() {
        this.setupEventListeners();
        this.toggleMode(false);
    },

    setupEventListeners: function() {
        this.controlButtons.forEach(button => {
            button.addEventListener("click", () => {
                const difficulty = button.getAttribute("data-difficulty");
                this.handleDifficulty(difficulty);
            });
        });
    },

    toggleMode: function(alertToggle) {
        this.mode = (this.mode === "View") ? "Learn" : "View";
        document.getElementById("mode-display").textContent = `Mode: ${this.mode}`;
        this.updateButtonStates();
        if (alertToggle) alert(`Switched to ${this.mode} mode.`);
    },

    updateButtonStates: function() {
        const isView = this.mode === "View";
        document.getElementById("prev").disabled = isView;
        document.getElementById("next").disabled = isView;
        this.controlButtons.forEach(button => button.disabled = isView);
    },

    handleDifficulty: function(difficulty) {
        const word = this.deckData[this.currentIndex];
        const today = new Date().toLocaleDateString('en-GB');
        if (difficulty === "easy") {
            update(ref(database, `words/${word.id}`), { lock_date: today });
            this.moveToNextAvailableWord();
        } else {
            this.moveToNextAvailableWord();
        }
    },

    moveToNextAvailableWord: function() {
        this.currentIndex++;
        this.nextAvailableWord();
    },

    nextAvailableWord: function() {
        const today = new Date().toLocaleDateString('en-GB');
        while (this.currentIndex < this.deckData.length && this.deckData[this.currentIndex].lock_date === today) {
            this.currentIndex++;
        }
        if (this.currentIndex < this.deckData.length) {
            this.displayWord2();
        } else {
            console.log("No available words to review today. Please come back tomorrow.");
        }
    },

    displayWord2: function() {
        const word = this.deckData[this.currentIndex];
        document.getElementById("card").textContent = word.german;
        document.getElementById("word-count").textContent = `Words in total: ${this.deckData.length}`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize();
});

// Note: Make sure you have correct paths and config imports for Firebase
