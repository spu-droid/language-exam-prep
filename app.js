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
let countdown_timers = [];
let ready_array = [];
let totalWordsInDeck = 0;
let learnedWordsCount = 0;
let countdown_queue = [];
let wordIndex = 0;

// Event Listeners
deckButtons.forEach(button => button.addEventListener("click", function() {
    deckButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    fetchWords(this.getAttribute("data-deck"));
}));

document.addEventListener('keydown', function(event) {
   if (event.keyCode === 32) {  // 32 is the keycode for the spacebar
        event.preventDefault();  // Prevent the default action to stop scrolling the page
        showAnswerButton.click();  // Simulate clicking the "Show Answer" button
    }

   // Check if the left arrow key (key code 37) is pressed
    if (event.keyCode === 37) {
        // Mimic a click on the prevButton
        prevButton.click();
    }
	// Check if the right arrow key (key code 39) is pressed
    if (event.keyCode === 39) {
        // Mimic a click on the nextButton
        nextButton.click();
    }
});

// Fetch words for the selected deck
function fetchWords(deck) {
    const wordsRef = ref(database, 'words');
    onValue(wordsRef, snapshot => {
        const data = snapshot.val();
        currentDeck = Object.entries(data)
            .filter(([key, word]) => word.category && word.category.includes(deck))
            .map(([key, word]) => ({...word, id: key}));
			
		learnedWordsCount = currentDeck.filter(word => word.lock_date === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })).length;

        // After fetching and filtering the words, calculate words learned today
        updateWordsLearned();
		updateWordsToLearn()
        currentIndex = 0; // Start from the first word
        displayWord(); // Display the first or next available word
    }, {onlyOnce: true});
}


function updateWordsLearned() {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const learnedCount = currentDeck.reduce((count, word) => count + (word.lock_date === today ? 1 : 0), 0);
    document.getElementById("words-learned").textContent = `Words learned: ${learnedWordsCount}`;             //here
	
}

function updateWordsToLearn() {
    const wordsToLearnCount = currentDeck.length;
    document.getElementById("word-count").textContent = `Words to learn: ${wordsToLearnCount}`;          //here
	
}

function displayWord() {
    let word;

    // Check for words in ready_array first
    if (ready_array.length > 0) {
        word = ready_array.pop();
        if (!word) {
            console.error("Empty or invalid word popped from ready_array");
            return; // Exit function if no valid word to display
        }
        // Update the display with the word from ready_array
        updateDisplay(word);
        return; // Exit function after displaying the ready word
    }

    // Handle normal flow from currentDeck
    if (currentDeck.length > 0 && currentIndex < currentDeck.length) {
        word = currentDeck[currentIndex];
        const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        if (viewMode === "Learn" && word.lock_date === today) {
            currentIndex++; // Skip locked word
            if (currentIndex < currentDeck.length) {
                displayWord(); // Recursive call to find an unlocked word
            } else {
                card.innerHTML = "No available words to review today. Please come back tomorrow.";
                resetDisplay();
            }
        } else {
            updateDisplay(word); // Display the current word
        }
    } else {
        card.innerHTML = "No words in this deck! Please select another.";
        resetDisplay();
    }
}

function updateDisplay(word) {
    let displayText = isGermanFirst ? word.german : word.italian;
    // Replace | with HTML line breaks to display each part on a new line
    displayText = displayText.replace(/\|/g, '<br>');

    card.innerHTML = displayText;
    wordCount.textContent = `Words in total: ${currentDeck.length}`;
    modeDisplay.textContent = `Mode: ${isGermanFirst ? 'DE-IT' : 'IT-DE'}`;
    updateWordsLearned();
    updateWordsToLearn();
}

function resetDisplay() {
    wordCount.textContent = "Words in total: 0";
    modeDisplay.textContent = "";
    updateWordsLearned(); // Reset learned count when no words are in the deck
    updateWordsToLearn();
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
	
	// Reload the first word in Learn mode to apply date filtering
    if (viewMode === "Learn" && currentDeck.length > 0) {
        currentIndex = 0; // Reset to start
        displayWord(); // Display with new filtering logic
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
        let displayText = isGermanFirst ? word.german + ": " + word.italian : word.italian + ": " + word.german;
        
        // Apply the replacement of '|' with '<br>' to ensure consistent new line formatting
        displayText = displayText.replace(/\|/g, '<br>');
        
        card.innerHTML = displayText;
    }
});

controlButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (viewMode === "Learn") {
            const difficulty = button.getAttribute("data-difficulty");
            console.log("Control button clicked:", difficulty);
            const word = currentDeck[currentIndex];
            const wordId = word.id;

            if (difficulty === "easy") {
                console.log("Easy button pressed");
                const today = new Date().toLocaleDateString('en-GB');
                update(ref(database, `words/${wordId}`), { lock_date: today })
                    .then(() => {
                        console.log(`Lock date set to today for word: ${word.german}`, today);
                        updateWordsLearned();
                        updateWordsToLearn();
                        displayWord();
                    })
                    .catch(error => console.error("Failed to set lock date:", error));
            } else if (["again", "hard", "good"].includes(difficulty)) {
                console.log(`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} button pressed for word: ${word.german}`);
                sendToQueue(wordId, difficulty === "again" ? 1 : (difficulty === "hard" ? 6 : 10));
            }

            // Move to the next word or wrap around
            currentIndex = (currentIndex + 1) % currentDeck.length;
            displayWord();
        }
    });
});

// Function to send a word to the queue with a specified delay
function sendToQueue(wordId, minutes) {
    const milliseconds = minutes * 60 * 1000; // Convert minutes to milliseconds
    const word = currentDeck.find(word => word.id === wordId); // Fetch the word object from the currentDeck

    if (!word) {
        console.error("Word not found in current deck.");
        return;
    }

    // Check for an existing timer index
    let index = countdown_timers.findIndex(item => !item); // Find the first empty spot
    if (index === -1) { // If no empty spot, prepare to add to the end
        index = countdown_timers.length;
    }

    // Create a timer for the word
    countdown_timers[index] = {
        word: word,
        timer: setTimeout(() => moveToReadyArray(word), milliseconds)
    };

    console.log(`Scheduled '${word.german}' for moving to ready_array at ${new Date(Date.now() + milliseconds).toLocaleTimeString()}.`);
}

// Function to move a word from the countdown queue to the ready array
function moveToReadyArray(word) {
    const index = countdown_timers.findIndex(item => item && item.word.id === word.id);
    if (index !== -1) {
        clearTimeout(countdown_timers[index].timer);  // Clear the timer
        countdown_timers[index] = null;  // Remove the word from the countdown array

        // Add the word to the beginning of the ready_array
        ready_array.unshift(word);
        console.log(`Word '${word.german}' timer completed. Prepended to ready_array at ${new Date().toLocaleTimeString()}.`);
    } else {
        console.error("Failed to find the word in countdown_timers for removal.");
    }

    // Display updated arrays for verification
    displayArrays();
}

// Utility function to display the contents of both arrays for debugging
function displayArrays() {
    console.log("Current countdown_timers: [" + countdown_timers.map(item => item && item.word ? item.word.german : 'Empty').join(', ') + "]");
    console.log("Current ready_array: [" + ready_array.map(word => word ? word.german : 'Empty').join(', ') + "]");
}