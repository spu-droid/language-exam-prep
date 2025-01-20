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
let isItalianToGerman = true; // Default language direction
let words = []; // Words from Firebase

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

// Event listener for "Show Answer" button
showAnswerButton.addEventListener("click", () => {
  if (currentDeck.length === 0) return;
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
  button.addEventListener("click", (e) => {
    const selectedDeck = e.target.getAttribute("data-deck");

    // Highlight the active button
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Filter words for the selected deck
    currentDeck = words.filter((word) => {
      return word.categories && word.categories.includes(selectedDeck);
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
