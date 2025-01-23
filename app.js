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
const modeSwitchButton = document.getElementById("mode-switch");
const modeDisplay2 = document.getElementById("mode2");
const controlButtons = document.querySelectorAll(".control-btn"); // Again, Hard, Good, Easy butto

let currentDeck = [];
let currentIndex = 0;
let isGermanFirst = true;  // Language mode default
let viewMode = "View";  // Learning mode default

// Event Listeners
deckButtons.forEach(button => button.addEventListener("click", function() {
    deckButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    fetchWords(this.getAttribute("data-deck"));
}));

// Fetch words for the selected deck
function fetchWords(deck) {
    const wordsRef = ref(database, 'words');
    onValue(wordsRef, snapshot => {
        const data = snapshot.val();
        currentDeck = Object.entries(data)
            .filter(([key, word]) => word.category.includes(deck))
            .map(([key, word]) => ({...word, id: key}));
        currentIndex = 0;
        displayWord();
    }, {onlyOnce: true});
}

// Display the current word
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

// Toggle language mode
switchButton.addEventListener("click", () => {
    isGermanFirst = !isGermanFirst;
    displayWord();
});

// Event listener for the mode switch button
modeSwitchButton.addEventListener("click", () => {
    // Toggle the mode between View and Learn
    viewMode = viewMode === "View" ? "Learn" : "View";
    modeDisplay2.textContent = `Learning Mode: ${viewMode}`;

    // Update the enabled state of control and navigation buttons based on the mode
    controlButtons.forEach(button => {
        button.disabled = (viewMode === "View"); // Disable learning control buttons in View mode
    });

    // Enable navigation buttons in View mode and disable them in Learn mode
    prevButton.disabled = (viewMode === "Learn");
    nextButton.disabled = (viewMode === "Learn");
	
	if (viewMode === "Learn") {
        currentIndex = 0;  // Set currentIndex to 0 to start from the first card
        displayWord();     // Display the first word of the current deck
    }
});


// Navigation through cards
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

// CRUD operations for cards
addButton.addEventListener("click", () => {
    const italian = prompt("Enter Italian word:");
    const german = prompt("Enter German word:");
    if (italian && german) {
        const newWord = { italian, german, category: document.querySelector(".deck-btn.active").getAttribute("data-deck") + ";All Words" };
        push(ref(database, 'words'), newWord);
    }
});

editButton.addEventListener("click", () => {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        const updatedItalian = prompt("Update Italian word:", word.italian);
        const updatedGerman = prompt("Update German word:", word.german);
        const updates = {};
        updates[`/words/${word.id}`] = { ...word, italian: updatedItalian, german: updatedGerman };
        update(ref(database), updates);
    }
});

deleteButton.addEventListener("click", () => {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        if (confirm("Are you sure you want to delete this word?")) {
            const wordRef = ref(database, `words/${currentDeck[currentIndex].id}`);
            remove(wordRef).then(() => {
                currentDeck.splice(currentIndex, 1);
                if (currentIndex >= currentDeck.length) currentIndex = currentDeck.length - 1;
                displayWord();
            });
        }
    }
});

// Showing answer
showAnswerButton.addEventListener("click", () => {
    if (currentDeck.length > 0 && currentDeck[currentIndex]) {
        const word = currentDeck[currentIndex];
        card.innerHTML = isGermanFirst ? word.german + ": " + word.italian : word.italian + ": " + word.german;
    }
});

controlButtons.forEach(button => {
    button.addEventListener("click", () => {
        console.log("Control button clicked:", button.getAttribute("data-difficulty"));
        if (button.getAttribute("data-difficulty") === "easy") {
            console.log("Easy button pressed");
            // Implement your Anki-like algorithm here for "easy"
			const today = new Date().toLocaleDateString('en-GB');
			const wordRef = ref(database, `words/${currentDeck[currentIndex].id}`);
            update(wordRef, { lock_date: today })
                .then(() => console.log("Lock date set to today:", today))
                .catch(error => console.error("Failed to set lock date:", error));
        } else if (button.getAttribute("data-difficulty") === "again") {
            console.log("Again button pressed");
            // Implement the action for "again"
        } else if (button.getAttribute("data-difficulty") === "hard") {
            console.log("Hard button pressed");
            // Implement the action for "hard"
        } else if (button.getAttribute("data-difficulty") === "good") {
            console.log("Good button pressed");
            // Implement the action for "good"
        } else {
            console.log("Unknown difficulty button pressed");
            // Handle any other cases or ignore
        }
    });
});
