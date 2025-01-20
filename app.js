// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const deckButtons = document.querySelectorAll(".deck-btn");
const card = document.getElementById("card");
const wordCountElement = document.getElementById("word-count");

let allWords = [];

// Load words from Firebase
function loadWords() {
  const wordsRef = ref(database, "words");
  onValue(wordsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      allWords = Object.values(data);
    } else {
      allWords = [];
    }
    updateDeck("all"); // Default to All Words on page load
  });
}

// Update the deck display
function updateDeck(deck) {
  const filteredWords =
    deck === "all"
      ? allWords
      : allWords.filter((word) => word.category.toLowerCase() === deck);

  if (filteredWords.length > 0) {
    card.innerHTML = filteredWords[0].italian; // Display the first word
    wordCountElement.textContent = `Words in total: ${filteredWords.length}`;
  } else {
    card.innerHTML = "No words in this deck!";
    wordCountElement.textContent = "Words in total: 0";
  }
}

// Add click event listeners to the deck buttons
deckButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedDeck = button.dataset.deck.toLowerCase();
    updateDeck(selectedDeck);
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Initialize the app
loadWords();
