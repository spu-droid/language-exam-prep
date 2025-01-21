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
const editButton = document.getElementById("edit-button");
const controlButtons = document.querySelectorAll("#controls button");

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
    }, { onlyOnce: true });
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
    card.textContent = isGermanFirst ? word.italian : word.german;
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
    let editModal = document.getElementById('edit-modal');
    let editGerman = document.getElementById('edit-german');
    let editItalian = document.getElementById('edit-italian');

    editGerman.value = currentDeck[currentIndex].german;
    editItalian.value = currentDeck[currentIndex].italian;
    editModal.style.display = 'block';
});

function saveChanges() {
    const updatedGerman = document.getElementById('edit-german').value;
    const updatedItalian = document.getElementById('edit-italian').value;
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

function closeModal() {
    let editModal = document.getElementById('edit-modal');
    editModal.style.display = 'none';
}
