// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const card = document.getElementById("card");
const wordCount = document.getElementById("word-count");
const showAnswerButton = document.getElementById("show-answer");
const switchButton = document.getElementById("switch");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
const deckButtons = document.querySelectorAll(".deck-btn");
const flashcardsTitle = document.getElementById("flashcards-title");

let currentDeck = [];
let currentIndex = 0;
let isItalianToGerman = true; // Default language direction

// Fetch words from Firebase Database
async function fetchWords(category) {
  const snapshot = await database.ref("words").once("value");
  const words = snapshot.val();

  // Filter words by category
  if (category === "all") {
    return Object.values(words);
  }
  return Object.values(words).filter(word => word.category.toLowerCase() === category.toLowerCase());
}

// Function to display a word
function displayWord() {
  if (currentDeck.length === 0) {
    card.innerHTML = "<p>No words in this deck!</p>";
    return;
  }
  const word = currentDeck[currentIndex];
  card.innerHTML = `<p>${isItalianToGerman ? word.italian : word.german}</p>`;
}

// Function to update word count
function updateWordCount() {
  wordCount.textContent = `Words in total: ${currentDeck.length}`;
}

// Event listener for "Show Answer" button
showAnswerButton.addEventListener("click", () => {
  const word = currentDeck[currentIndex];
  card.innerHTML = `<p>${isItalianToGerman ? word.german : word.italian}</p>`;
});

// Event listener for "Switch" button
switchButton.addEventListener("click", () => {
  isItalianToGerman = !isItalianToGerman;
  displayWord();
});

// Function to select the next card
function nextCard() {
  currentIndex = (currentIndex + 1) % currentDeck.length;
  displayWord();
}

// Event listeners for controls
easyButton.addEventListener("click", nextCard);
mediumButton.addEventListener("click", nextCard);
hardButton.addEventListener("click", nextCard);

// Handle deck selection
deckButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const selectedDeck = e.target.getAttribute("data-deck");

    // Highlight the active button
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Update Flashcards title
    flashcardsTitle.textContent = `Flashcards : ${selectedDeck.charAt(0).toUpperCase() + selectedDeck.slice(1)}`;

    // Fetch and display words
    currentDeck = await fetchWords(selectedDeck);
    currentIndex = 0;

    // Update word count and display the first word
    updateWordCount();
    displayWord();
  });
});

// Initialize with a default message
updateWordCount();
displayWord();