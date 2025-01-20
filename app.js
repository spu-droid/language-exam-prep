import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU0vkul_XzwI97y9AUBFujN0MDefUnA3A",
  authDomain: "language-exam-prep-6698a.firebaseapp.com",
  databaseURL: "https://language-exam-prep-6698a-default-rtdb.firebaseio.com",
  projectId: "language-exam-prep-6698a",
  storageBucket: "language-exam-prep-6698a.appspot.com",
  messagingSenderId: "858022856301",
  appId: "1:858022856301:web:c416c22f250679783c6164",
  measurementId: "G-HLEJ2829GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM elements
const deckButtons = document.querySelectorAll(".deck-btn");
const cardElement = document.getElementById("card");
const wordCountElement = document.getElementById("word-count");
const showAnswerButton = document.getElementById("show-answer");
const switchButton = document.getElementById("switch");

let words = [];
let currentDeck = "all";
let currentCardIndex = 0;
let showGerman = true;

// Fetch words from Firebase
function fetchWords() {
  const wordsRef = ref(database, "words");
  onValue(wordsRef, (snapshot) => {
    const data = snapshot.val();
    words = Object.values(data || {});
    updateWordCount();
    showNextCard();
  });
}

// Update word count for the current category
function updateWordCount() {
  const count =
    currentDeck === "all"
      ? words.length
      : words.filter((word) => word.category === currentDeck).length;
  wordCountElement.textContent = `Words in total: ${count}`;
}

// Show the next card
function showNextCard() {
  const deckWords =
    currentDeck === "all"
      ? words
      : words.filter((word) => word.category === currentDeck);

  if (deckWords.length > 0) {
    const word = deckWords[currentCardIndex % deckWords.length];
    cardElement.textContent = showGerman ? word.german : word.italian;
  } else {
    cardElement.textContent = "No words in this deck!";
  }
}

// Event listeners
deckButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentDeck = button.dataset.deck;
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    updateWordCount();
    showNextCard();
  });
});

showAnswerButton.addEventListener("click", () => {
  const deckWords =
    currentDeck === "all"
      ? words
      : words.filter((word) => word.category === currentDeck);

  if (deckWords.length > 0) {
    const word = deckWords[currentCardIndex % deckWords.length];
    cardElement.textContent = showGerman ? word.italian : word.german;
  }
});

switchButton.addEventListener("click", () => {
  showGerman = !showGerman;
  showNextCard();
});

// Initialize the app
fetchWords();
