// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, update } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

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
const editButton = document.getElementById("edit");

// Default settings
let currentDeck = [];
let currentIndex = 0;
let isGermanFirst = true;
let wordKeys = [];  // Array to store Firebase keys of the words

// Event listeners for deck selection buttons
deckButtons.forEach(button => {
    button.addEventListener("click", function() {
        deckButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        fetchWords(this.getAttribute("data-deck"));
    });
});

// Fetch words from Firebase based on the selected category
function fetchWords(deck) {
    const wordsRef = ref(database, 'words');
    onValue(wordsRef, snapshot => {
        const data = snapshot.val();
        currentDeck = [];
        wordKeys = [];
        Object.entries(data).forEach(([key, word]) => {
            if (deck === "All Words" || word.category && word.category.split(';').includes(deck)) {
                currentDeck.push(word);
                wordKeys.push(key);
            }
        });
        currentIndex = 0;
        displayWord();
    }, {
        onlyOnce: true
    });
}

// Display the current word on the card
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

// Event listener for the Edit button
editButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    const newGerman = prompt("Edit German word:", word.german);
    const newItalian = prompt("Edit Italian word:", word.italian);
    if (newGerman !== null && newItalian !== null) {
        word.german = newGerman;
        word.italian = newItalian;
        const updates = {};
        updates[`/words/${wordKeys[currentIndex]}`] = word;
        update(ref(database), updates);
        displayWord();
    }
});

// Additional event listeners as previously defined
