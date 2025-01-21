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

let currentDeck = [];
let currentIndex = 0;
let isItalianToGerman = true; // Default language direction

// Fetch words from Firebase Database
async function fetchWords(category) {
  const snapshot = await database.ref("words").once("value");
  const words = snapshot.val();

  // Filter words by category, handling semicolon-separated categories
  if (category === "all") {
    return Object.values(words);
  }
  return Object.values(words).filter(word => {
    const categories = word.category.split(';'); // Split the category string into an array
    return categories.includes(category);
  });
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

// Event listeners for difficulty buttons
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

    // Fetch and display words
    currentDeck = await fetchWords(selectedDeck);
    currentIndex = 0;
    displayWord();
    updateWordCount(); // Update the word count whenever a new deck is selected
  });
});

// Initialize with a default message
updateWordCount();
displayWord();
