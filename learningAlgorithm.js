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
        document.getElementById("mode-switch").addEventListener("click", this.toggleMode.bind(this));
        this.controlButtons.forEach(btn => {
            btn.addEventListener("click", (e) => this.handleCardControl(e.target.dataset.difficulty));
        });
    },

    loadDeckData: function(deck) {
        this.deckData = deck;  // Assume 'deck' is passed from app.js
        this.currentIndex = 0;
        this.showNextCard();
    },

    toggleMode: function() {
        this.mode = (this.mode === "View") ? "Learn" : "View";
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
        document.getElementById("mode2").textContent = `Card Mode: ${this.mode}`;
        this.controlButtons.forEach(button => button.disabled = (this.mode === "View"));
    },

    showNextCard: function() {
        this.currentIndex = (this.currentIndex + 1) % this.deckData.length;
        this.displayCard(this.currentIndex);
    },

    displayCard: function(index) {
        const cardElement = document.getElementById('card');
        const card = this.deckData[index];
        cardElement.textContent = card.german; // Assuming german is the default language
        document.getElementById('word-count').textContent = `Words in total: ${this.deckData.length}`;
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

document.addEventListener("DOMContentLoaded", () => {
    learningAlgorithm.initialize();
});
