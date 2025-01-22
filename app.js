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
const controlButtons = document.querySelectorAll(".control-btn");
const modeDisplay = document.getElementById("mode");
const deleteButton = document.getElementById("delete"); // Delete button

let currentDeck = [];
let currentIndex = 0;
let currentWordKey = null;  // To keep track of the current word's key
let isGermanFirst = true;

deckButtons.forEach(button => {
    button.addEventListener("click", function() {
        deckButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        fetchWords(this.getAttribute("data-deck"));
    });
});

function fetchWords(deck) {
    const wordsRef = ref(database, 'words');
    onValue(wordsRef, snapshot => {
        const data = snapshot.val();
        currentDeck = Object.entries(data).filter(([key, word]) => 
            word.category && word.category.split(';').includes(deck)
        );
        currentIndex = 0;
        displayWord();
    }, {
        onlyOnce: true
    });
}

function displayWord() {
    if (currentDeck.length > 0 && currentIndex < currentDeck.length) {
        const [key, word] = currentDeck[currentIndex];
        currentWordKey = key;  // Store current word's key
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
        modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    } else {
        card.innerHTML = "<p>No words in this deck! Please select another.</p>";
        wordCount.textContent = "Words in total: 0";
        modeDisplay.textContent = "";
    }
}

showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex][1];  // Adjusted to access tuple
    card.innerHTML = isGermanFirst ? word.italian : word.german;
});

switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});

controlButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentIndex < currentDeck.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;  // Loop back to the first card
        }
        displayWord();
    });
});

deleteButton.addEventListener("click", () => {
    if (currentWordKey) {
        remove(ref(database, `words/${currentWordKey}`))
            .then(() => {
                console.log("Word deleted successfully.");
                fetchWords(document.querySelector(".deck-btn.active").getAttribute("data-deck"));
            })
            .catch(error => console.error("Error deleting word:", error));
    }
});
