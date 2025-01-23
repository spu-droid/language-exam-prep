// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, remove, push, update } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Firebase configuration and initialization
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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// UI Elements setup
const deckButtons = document.querySelectorAll(".deck-btn");
const card = document.getElementById("card");
const wordCount = document.getElementById("word-count");
const showAnswerButton = document.getElementById("show-answer");
const switchButton = document.getElementById("switch");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const addButton = document.getElementById("add");
const editButton = document.getElementById("edit");
const deleteButton = document.getElementById("delete");
const modeDisplay = document.getElementById("mode");
const modeDisplay2 = document.getElementById("mode2");

let currentDeck = [];
let currentIndex = 0;
let isGermanFirst = true;

// Handling deck button interactions
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
        currentDeck = Object.entries(data)
            .filter(([key, word]) => word.category && word.category.includes(deck))
            .map(([key, word]) => ({ ...word, id: key }));
        currentIndex = 0;
        displayWord();
    }, {
        onlyOnce: true
    });
}

function displayWord() {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
        modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    } else {
        card.innerHTML = "No words in this deck! Please select another.";
        wordCount.textContent = "Words in total: 0";
        modeDisplay.textContent = "";
    }
}

// Navigating through cards
nextButton.addEventListener("click", () => {
    if (currentIndex < currentDeck.length - 1) {
        currentIndex++;
        displayWord();
    } else {
        alert("It is the last card of the deck");
    }
});

prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayWord();
    } else {
        alert("It is the first card of the deck");
    }
});

// Managing CRUD operations for flashcards
addButton.addEventListener("click", () => {
    const italian = prompt("Enter Italian word:");
    const german = prompt("Enter German word:");
    const newWord = {
        italian: italian,
        german: german,
        category: document.querySelector(".deck-btn.active").getAttribute("data-deck") + ";All Words"
    };
    push(ref(database, 'words'), newWord);
});

editButton.addEventListener("click", () => {
    const italian = prompt("Update Italian word:", currentDeck[currentIndex].italian);
    const german = prompt("Update German word:", currentDeck[currentIndex].german);
    const updatedWord = {
        italian: italian,
        german: german,
        category: currentDeck[currentIndex].category
    };
    const updates = {};
    updates['/words/' + Object.keys(currentDeck)[currentIndex]] = updatedWord;
    update(ref(database), updates);
});

deleteButton.addEventListener("click", () => {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        if (confirm("Are you sure you want to delete this word?")) {
            const wordRef = ref(database, `words/${currentDeck[currentIndex].id}`);
            remove(wordRef).then(() => {
                console.log("Word deleted successfully.");
                currentDeck.splice(currentIndex, 1);
                if (currentIndex >= currentDeck.length) {
                    currentIndex = currentDeck.length - 1; // Adjust index if needed
                }
                displayWord();
            }).catch(error => {
                console.error("Failed to delete word:", error);
            });
        }
    } else {
        console.log("No word selected or deck is empty.");
    }
});

// Showing the answer
showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    card.innerHTML = isGermanFirst ? word.italian + ": " + word.german : word.german + ": " + word.italian;
});

// Switching the language display
switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});
