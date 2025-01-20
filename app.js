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
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const deckButtons = document.querySelectorAll(".deck-btn");
const cardElement = document.getElementById("card");
const wordCountElement = document.getElementById("word-count");
const showAnswerButton = document.getElementById("show-answer");
const switchButton = document.getElementById("switch");
const controls = document.getElementById("controls");

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
        : words.filter((word) => word.category === category);
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
    return;
  }

  const word = currentDeck[currentIndex];
  cardElement.innerHTML = `<p>${showAnswer ? word.german : word.italian}</p>`;
};

// Function to update word count
const updateWordCount = () => {
  wordCountElement.textContent = `Words in total: ${currentDeck.length}`;
};

// Event listeners for deck buttons
deckButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const category = button.getAttribute("data-deck");
    currentDeck = await fetchWords(category === "all" ? "all" : category);
    currentIndex = 0;
    showAnswer = false;
    updateFlashcard();
    updateWordCount();
  });
});

// Event listener for "Show Answer" button
showAnswerButton.addEventListener("click", () => {
  showAnswer = !showAnswer;
  updateFlashcard();
});

// Event listener for "Switch" button
switchButton.addEventListener("click", () => {
  if (currentDeck.length > 0) {
    currentIndex = (currentIndex + 1) % currentDeck.length;
    showAnswer = false;
    updateFlashcard();
  }
});
