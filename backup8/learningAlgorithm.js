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

        this.controlButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.showNextCard();  // Directly show next card on any control button press
            });
        });
    },

    toggleMode: function(showAlert) {
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

        if (showAlert) alert(`Control buttons are now ${this.mode === "Learn" ? "ENABLED" : "DISABLED"}, < > buttons are ${this.mode === "Learn" ? "DISABLED" : "ENABLED"}.`);
    }
};

// DOMContentLoaded listener at the end of the file
document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize();
    console.log("Learning algorithm initialized and ready.");
});