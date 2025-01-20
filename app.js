// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
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
let isGermanToItalian = true; // Default language direction
let words = []; // Words from Firebase

// Function to display a word
function displayWord() {
  if (currentDeck.length === 0) {
    card.innerHTML = "<p>No words in this deck!</p>";
    return;
  }
  const word = currentDeck[currentIndex];
  card.innerHTML = `<p>${isGermanToItalian ? word.german : word.italian}</p>`;
}

// Function to show the answer
function showAnswer() {
  if (currentDeck.length === 0) return;
  const word = currentDeck[currentIndex];
  card.innerHTML = `<p>${isGermanToItalian ? word.italian : word.german}</p>`;
}

// Function to update word count
function updateWordCount() {
  wordCount.textContent = `Words in total: ${currentDeck.length}`;
}

// Fetch words from Firebase
function fetchWords() {
  database
    .ref("words")
    .once("value")
    .then((snapshot) => {
      words = [];
      snapshot.forEach((childSnapshot) => {
        words.push(childSnapshot.val());
      });
      console.log("Words loaded:", words);
    })
    .catch((error) => console.error("Error fetching words:", error));
}

// Function to move to the next word
function nextWord() {
  if (currentDeck.length === 0) return;
  currentIndex = (currentIndex + 1) % currentDeck.length;
  displayWord();
}

// Event listeners for controls
showAnswerButton.addEventListener("click", showAnswer);
switchButton.addEventListener("click", () => {
  isGermanToItalian = !isGermanToItalian;
  displayWord();
});
easyButton.addEventListener("click", nextWord);
mediumButton.addEventListener("click", nextWord);
hardButton.addEventListener("click", nextWord);

// Handle deck selection
deckButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedDeck = e.target.getAttribute("data-deck");

    // Highlight the active button
    deckButtons.forEach((btn) => btn.classList.remove("active")); // Clear previous selection
    e.target.classList.add("active"); // Set the clicked button as active

    // Filter words for the selected deck
    currentDeck = words.filter((word) => {
      return word.category && word.category.toLowerCase() === selectedDeck.toLowerCase();
    });

    currentIndex = 0;

    // Update word count and display the first word
    updateWordCount();
    displayWord();
  });
});

// Initialize app
fetchWords();
updateWordCount();
displayWord();

