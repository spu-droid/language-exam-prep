// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue, update } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
const editButton = document.getElementById("edit-button");
const editModal = document.getElementById("edit-modal");
const editGerman = document.getElementById("edit-german");
const editItalian = document.getElementById("edit-italian");
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
        currentDeck = deck === "All Words" ? Object.values(data) : Object.values(data).filter(word => word.category && word.category.split(';').includes(deck));
        currentIndex = 0;
        displayWord();
    }, { onlyOnce: true });
}

// Display the current word on the card
function displayWord() {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        card.innerHTML = isGermanFirst ? word.german : word.italian;
        wordCount.textContent = `Words in total: ${currentDeck.length}`;
    } else {
        card.innerHTML = "<p>No words in this deck! Please select another.</p>";
        wordCount.textContent = "Words in total: 0";
    }
}

// Event listener for the Show Answer button
showAnswerButton.addEventListener("click", () => {
    const word = currentDeck[currentIndex];
    card.innerHTML = isGermanFirst ? word.italian : word.german;
});

// Event listener for the Switch button
switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});

// Event listeners for control buttons (Easy, Medium, Hard)
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

// Editing flashcards
editButton.addEventListener('click', function() {
    editGerman.value = currentDeck[currentIndex].german;
    editItalian.value = currentDeck[currentIndex].italian;
    editModal.style.display = 'block';
});

function closeModal() {
    editModal.style.display = 'none';
}

function saveChanges() {
    const updatedGerman = editGerman.value;
    const updatedItalian = editItalian.value;
    const wordRef = ref(database, `words/${currentDeck[currentIndex].key}`);
    update(wordRef, {
        german: updatedGerman,
        italian: updatedItalian
    }).then(() => {
        currentDeck[currentIndex].german = updatedGerman;
        currentDeck[currentIndex].italian = updatedItalian;
        displayWord();
        closeModal();
    }).catch(error => {
        console.error("Error updating document: ", error);
    });
}

