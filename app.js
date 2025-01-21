// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU0vkul_XzwI97y9AUBFujN0MDefUnA3A",
    authDomain: "language-exam-prep-6698a.firebaseapp.com",
    databaseURL: "https://language-exam-prep-6698a-default-rtdb.firebaseio.com",
    projectId: "language-exam-prep-6698a",
    storageBucket: "language-exam-prep-6698a.firebasestorage.app",
    messagingSenderId: "858022856301",
    appId: "1:858022856301:web:c416c22f250679783c6164",
    measurementId: "G-HLEJ2829GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// UI Elements
const deckButtons = document.querySelectorAll(".deck-btn");
const card = document.getElementById("card");
const wordCount = document.getElementById("word-count");
const showAnswerButton = document.getElementById("show-answer");
const switchButton = document.getElementById("switch");
const controlButtons = document.querySelectorAll("#controls button");
const modeDisplay = document.getElementById("mode");
const deleteButton = document.getElementById("delete");

let currentDeck = [];
let currentIndex = 0;
let isGermanFirst = true;

// Fetching all words or filtered by category
function fetchWords(deck) {
    const wordsRef = ref(database, 'words');
    onValue(wordsRef, snapshot => {
        const data = snapshot.val();
        if (deck === "All Words") {
            currentDeck = Object.values(data).map((word, index) => ({ ...word, key: Object.keys(data)[index] }));
        } else {
            currentDeck = Object.values(data)
                                .filter(word => word.category && word.category.split(';').includes(deck))
                                .map((word, index) => ({ ...word, key: Object.keys(data)[index] }));
        }
        currentIndex = 0;
        displayWord();
    }, { onlyOnce: true });
}

// Display the current word
function displayWord() {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
        modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    } else {
        card.innerHTML = "<p>No words in this deck! Please select another.</p>";
        wordCount.textContent = "Words in total: 0";
        modeDisplay.textContent = "";
    }
}

// Button functionalities
deckButtons.forEach(button => button.addEventListener("click", function() {
    deckButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    fetchWords(this.getAttribute("data-deck"));
}));

showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    card.innerHTML = isGermanFirst ? word.italian : word.german;
});

switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});

controlButtons.forEach(button => button.addEventListener("click", () => {
    if (currentIndex < currentDeck.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    displayWord();
}));

deleteButton.addEventListener("click", () => {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const wordRef = ref(database, `words/${currentDeck[currentIndex].key}`);
        remove(wordRef).then(() => {
            currentDeck.splice(currentIndex, 1); // Remove from local array
            if (currentIndex >= currentDeck.length) { // If last word was deleted, adjust index
                currentIndex = currentDeck.length - 1;
            }
            displayWord(); // Update UI
        }).catch(error => {
            console.error("Failed to delete word:", error);
        });
    }
});
