// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, push, remove, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

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
const addButton = document.getElementById("add");
const editButton = document.getElementById("edit");
const deleteButton = document.getElementById("delete");

// Default settings
let currentDeck = [];
let currentIndex = 0;
let currentKey = null;
let isGermanFirst = true;  // Default to show German word first

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
        if (deck === "All Words") {
            currentDeck = Object.entries(data).map(([key, word]) => ({
                key,
                ...word
            }));
        } else {
            currentDeck = Object.entries(data).filter(([key, word]) =>
                word.category && word.category.split(';').includes(deck)
            ).map(([key, word]) => ({
                key,
                ...word
            }));
        }
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
        currentKey = word.key;  // Store current word's Firebase key
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
        modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    } else {
        card.innerHTML = "<p>No words in this deck! Please select another.</p>";
        wordCount.textContent = "Words in total: 0";
        modeDisplay.textContent = "";
    }
}

// Toggle language
switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});

// Show the answer for the current card
showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    card.innerHTML = isGermanFirst ? word.italian : word.german;
});

// Control buttons logic: Easy, Medium, Hard (currently just navigates through cards)
controlButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentIndex < currentDeck.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to the first card
        }
        displayWord();
    });
});

// Add a new card
addButton.addEventListener("click", () => {
    const newItalian = prompt("Enter new Italian word:");
    const newGerman = prompt("Enter new German word:");
    if (newItalian && newGerman) {
        const selectedDeck = document.querySelector(".deck-btn.active").getAttribute("data-deck");
        const newWord = {
            italian: newItalian,
            german: newGerman,
            category: selectedDeck + ";All Words"  // Adds to selected and All Words deck
        };
        push(ref(database, 'words'), newWord);
    }
});

// Edit the current card
editButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    const updatedItalian = prompt("Update Italian word:", word.italian);
    const updatedGerman = prompt("Update German word:", word.german);
    if (updatedItalian && updatedGerman) {
        set(ref(database, `words/${currentKey}`), {
            ...word,
            italian: updatedItalian,
            german: updatedGerman
        });
    }
});

// Delete the current card
deleteButton.addEventListener("click", () => {
    if (currentKey) {
        remove(ref(database, `words/${currentKey}`));
        currentDeck.splice(currentIndex, 1);  // Remove from local array
        displayWord();  // Refresh display
    }
});
