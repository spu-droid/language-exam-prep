// DOMContentLoaded listener at the end of the file
document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize();
    console.log("Learning algorithm initialized and ready.");
});

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
			modeSwitchButton.addEventListener("click", () => this.toggleMode(true)); // Ensures alerts are shown only on user action
			console.log("Event listener attached to mode-switch button.");
		} else {
			console.error("Mode switch button not found.");
		}

		// Setup event listeners for control buttons to show next card
		this.controlButtons.forEach(button => {
			button.addEventListener("click", () => {
				console.log("Control button clicked: " + button.getAttribute("data-difficulty"));
				this.showNextCard();
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
    },

    showNextCard: function() {
        this.currentIndex = (this.currentIndex + 1) % this.deckData.length;
        this.displayCard(this.currentIndex);
    },

    displayCard: function(index) {
        const cardElement = document.getElementById('card');
        const card = this.deckData[index];
        if (cardElement) {
            cardElement.textContent = card.german; // Assuming German is the default language
            document.getElementById('word-count').textContent = `Words in total: ${this.deckData.length}`;
        } else {
            console.error("Card element not found for display.");
        }
    },

    getTomorrowMidnight: function() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
};

