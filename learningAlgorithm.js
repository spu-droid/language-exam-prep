// Assume the file is using ES modules
import { controlButtons } from './learningAlgorithm.js';

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

    toggleMode: function(alertToggle) {
        this.mode = (this.mode === "View") ? "Learn" : "View";
        const modeDisplay = document.getElementById("mode-display");
        if (modeDisplay) {
            modeDisplay.textContent = `Mode: ${this.mode}`;
            if (alertToggle) alert(`Switched to ${this.mode} mode.`);
        }
        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");

        if(prevButton && nextButton) {
            prevButton.disabled = this.mode !== "View";
            nextButton.disabled = this.mode !== "View";
            this.controlButtons.forEach(button => button.disabled = this.mode === "View");
        } else {
            console.error("Navigation buttons not found.");
        }
    }
};

// Ensure the DOM is fully loaded before running script
document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize(); // Initialize the algorithm
});