const learningAlgorithm = {
    mode: "View",
    controlButtons: document.querySelectorAll(".control-btn"),
    deckData: [],
    currentIndex: 0,
    countdownTimers: [],  // This will also track daily visibility blocks
    resetTimersDaily: [], // Tracks cards to be reset daily

    initialize: function() {
        this.setupEventListeners();
    },

    setupEventListeners: function() {
		const modeSwitchButton = document.getElementById("mode-switch");
		if (modeSwitchButton) {
			modeSwitchButton.addEventListener("click", this.toggleMode.bind(this));
			console.log("Event listener attached to mode-switch button.");
		} else {
			console.error("Mode switch button not found.");
		}
	},

		toggleMode: function() {
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
			alert("Again, Hard, Good and Easy Buttons are now ENABLED, < > buttons are DISABLED.");
			this.runLearningAlgorithm();
		} else {
			prevButton.disabled = false;
			nextButton.disabled = false;
			this.controlButtons.forEach(button => button.disabled = true);
			modeDisplay2.textContent = "Card Mode: View";
			alert("Again, Hard, Good and Easy Buttons are now DISABLED, < > buttons are ENABLED.");
		}
	},

    handleCardControl: function(difficulty) {
        const minutesMap = { 'again': 1, 'hard': 6, 'easy': 10, 'good': 1440 }; // 1440 minutes in a day for "good"
        const minutes = minutesMap[difficulty];

        if (difficulty === "good") {
            this.markCardGoodForDay(this.currentIndex);
        } else {
            this.setTimerForCard(this.currentIndex, minutes);
        }

        this.showNextCard();
    },

    markCardGoodForDay: function(index) {
        const resetTime = this.getTomorrowMidnight();
        this.countdownTimers.push({ index, expiryTime: resetTime });
        this.resetTimersDaily.push({ index, resetTime });
    },

    setTimerForCard: function(index, minutes) {
        const expiryTime = new Date(new Date().getTime() + minutes * 60000);
        this.countdownTimers.push({ index, expiryTime });
        this.showNextCard();
    },

    updateUI: function() {
        const modeDisplay2 = document.getElementById("mode2");
        if(modeDisplay2) {
            modeDisplay2.textContent = `Card Mode: ${this.mode}`;
            this.controlButtons.forEach(button => button.disabled = (this.mode === "View"));
        } else {
            console.error("Failed to update UI: mode display element not found.");
        }
    },

    showNextCard: function() {
        this.currentIndex = (this.currentIndex + 1) % this.deckData.length;
        this.displayCard(this.currentIndex);
    },

    displayCard: function(index) {
        const cardElement = document.getElementById('card');
        if(cardElement) {
            const card = this.deckData[index];
            cardElement.textContent = card.german; // Assuming German is the default language
            document.getElementById('word-count').textContent = `Words in total: ${this.deckData.length}`;
        } else {
            console.error("Card element not found for display.");
        }
    },

    runLearningAlgorithm: function() {
        console.log("Learning algorithm is now running.");
        // Additional learning algorithm functionalities can be implemented here
    },

    getTomorrowMidnight: function() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
};

// DOMContentLoaded listener at the end of the file
document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize();
    console.log("Learning algorithm initialized and ready.");
});