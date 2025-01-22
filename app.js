// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, set, remove, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

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
            currentDeck = Object.values(data).filter(word => word.category.includes("All Words"));
        } else {
            currentDeck = Object.values(data).filter(word => word.category.split(';').includes(deck));
        }
        currentIndex = 0;
        displayWord();
    }, {
        onlyOnce: true
    });
}

// Function to display the current word on the card, modified to show just the first word initially
function displayWord() {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        // Only show the initial word when first displaying the flashcard
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
        modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    } else {
        card.innerHTML = "<p>No words in this deck! Please select another.</p>";
        wordCount.textContent = "Words in total: 0";
        modeDisplay.textContent = "";
    }
}

addButton.addEventListener("click", () => {
    const selectedDeck = document.querySelector('.deck-btn.active').getAttribute('data-deck');
    if (selectedDeck === "All Words") {
        alert("Add words to any other deck.");
        return; // Prevent adding when "All Words" is selected
    }
    const italian = prompt("Enter Italian word:");
    const german = prompt("Enter German translation:");
    if (italian && german) {
        const category = selectedDeck + ";All Words";  // Adds to selected and All Words deck
        const newWord = { italian, german, category };
        push(ref(database, 'words'), newWord);
    }
});

// Edit current word
editButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    const newItalian = prompt("Edit Italian word:", word.italian);
    const newGerman = prompt("Edit German translation:", word.german);
    if (newItalian !== null && newGerman !== null) {
        set(ref(database, 'words/' + word.key), { ...word, italian: newItalian, german: newGerman });
    }
});

// Delete current word
deleteButton.addEventListener("click", () => {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        remove(ref(database, 'words/' + word.key));
        fetchWords(document.querySelector('.deck-btn.active').getAttribute('data-deck'));
    }
});

// Event listener for the Show Answer button
showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    // Update to display both the German and Italian words together after clicking "Show Answer"
    card.innerHTML = isGermanFirst ? `${word.german}: ${word.italian}` : `${word.italian}: ${word.german}`;
});

// Event listener for the Switch button
switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();  // Ensure this function adjusts display based on isGermanFirst
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
