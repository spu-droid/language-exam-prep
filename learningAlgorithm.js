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

    toggleMode: function(showAlert) {
        console.log("Toggle mode called. Current mode:", this.mode);  // Log when function is called and the current mode

        this.mode = (this.mode === "View") ? "Learn" : "View";
        console.log("New mode after toggle:", this.mode);  // Log the new mode after toggle

        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");
        const modeDisplay2 = document.getElementById("mode2");

        if (this.mode === "Learn") {
            prevButton.disabled = true;
            nextButton.disabled = true;
            this.controlButtons.forEach(button => button.disabled = false);
            modeDisplay2.textContent = "Card Mode: Learn";
            if (showAlert) alert("Again, Hard, Good and Easy Buttons are now ENABLED, < > buttons are DISABLED.");
        } else {
            prevButton.disabled = false;
            nextButton.disabled = false;
            this.controlButtons.forEach(button => button.disabled = true);
            modeDisplay2.textContent = "Card Mode: View";
            if (showAlert) alert("Again, Hard, Good and Easy Buttons are now DISABLED, < > buttons are ENABLED.");
        }
    },

    // Remainder of the methods (handleCardControl, markCardGoodForDay, etc.) remain unchanged...

    // DOMContentLoaded listener at the end of the file
    document.addEventListener("DOMContentLoaded", () => {
        learningAlgorithm.initialize();
        console.log("Learning algorithm initialized and ready.");
    });
};