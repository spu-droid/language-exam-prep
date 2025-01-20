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

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const deckButtons = document.querySelectorAll(".deck-btn");
const cardElement = document.getElementById("card");
const wordCountElement = document.getElementById("word-count");

// Variables to track state
let currentDeck = [];
let currentIndex = 0;
let showAnswer = false;

// Function to fetch words from Firebase
const fetchWords = async (category) => {
  try {
    const wordsRef = ref(database, "words");
    const snapshot = await get(wordsRef);
    if (snapshot.exists()) {
      const words = Object.values(snapshot.val());
      return category === "all"
        ? words
        : words.filter((word) => word.category.toLowerCase() === category.toLowerCase());
    }
    return [];
  } catch (error) {
    console.error("Error fetching words:", error);
    return [];
  }
};

// Function to update the flashcard
const updateFlashcard = () => {
  if (currentDeck.length === 0) {
    cardElement.innerHTML = "<p>No words in this deck!</p>";
    wordCountElement.innerHTML = "Words in total: 0";
    return;
  }

  const word = currentDeck[currentIndex];
  cardElement.innerHTML = `<p>${showAnswer ? word.german : word.italian}</p>`;
  wordCountElement.innerHTML = `Words in total: ${currentDeck.length}`;
};

// Function to highlight the active deck button
const highlightActiveDeck = (activeButton) => {
  deckButtons.forEach((button) => {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
};

// Event listeners for deck buttons
deckButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const category = button.getAttribute("data-deck");
    currentDeck = await fetchWords(category === "all" ? "all" : category);
    currentIndex = 0;
    showAnswer = false;
    updateFlashcard();
    highlightActiveDeck(button);
  });
});

// Event listener for "Show Answer" button
document.getElementById("show-answer").addEventListener("click", () => {
  showAnswer = !showAnswer;
  updateFlashcard();
});

// Event listener for "Switch" button
document.getElementById("switch").addEventListener("click", () => {
  if (currentDeck.length > 0) {
    currentIndex = (currentIndex + 1) % currentDeck.length;
    showAnswer = false;
    updateFlashcard();
  }
});
