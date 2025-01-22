// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, remove, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

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
const deleteButton = document.getElementById("delete");
const editButton = document.getElementById("edit");
const addButton = document.getElementById("add");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const controlButtons = document.querySelectorAll("#controls button");

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
        currentDeck = Object.values(data).filter(word => word.category && word.category.split(';').includes(deck));
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
        card.textContent = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
    } else {
        card.textContent = "No words in this deck! Please select another.";
        wordCount.textContent = "Words in total: 0";
    }
}

// Event listener for the Show Answer button
showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    card.textContent = isGermanFirst ? word.german + " : " + word.italian : word.italian + " : " + word.german;
});

// Event listener for the Switch button
switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});

// Event listener for the Delete button
deleteButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    remove(ref(database, 'words/' + word.key));
    currentDeck.splice(currentIndex, 1);
    displayWord();
});

// Event listener for the Add button
addButton.addEventListener("click", () => {
    const newItalian = prompt("Enter new Italian word:");
    const newGerman = prompt("Enter new German word:");
    const newWord = {
        italian: newItalian,
        german: newGerman,
        category: document.querySelector(".deck-btn.active").getAttribute("data-deck") + ";All Words"
    };
    push(ref(database, 'words'), newWord);
});

// Event listeners for control buttons (Easy, Medium, Hard)
controlButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % currentDeck.length;
        displayWord();
    });
});

// Navigation buttons
prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayWord();
    } else {
        alert("This is the first card of the deck.");
    }
});

nextButton.addEventListener("click", () => {
    if (currentIndex < currentDeck.length - 1) {
        currentIndex++;
        displayWord();
    } else {
        alert("This is the last card of the deck.");
    }
});
