// Firebase configuration (Replace with your config)
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
const flashcardsHeader = document.getElementById("flashcards-header");
const deckButtons = document.querySelectorAll(".deck-btn");

let words = [];
let currentDeck = [];
let currentIndex = 0;

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

// Update Flashcards Header
function updateFlashcardsHeader(deckName) {
  flashcardsHeader.textContent = `Flashcards : ${deckName}`;
}

// Handle Deck Selection
deckButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedDeck = e.target.getAttribute("data-deck");

    // Highlight the active button
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Filter words for the selected deck
    currentDeck = words.filter((word) => word.category === selectedDeck);

    // Update Flashcards Header
    updateFlashcardsHeader(selectedDeck);

    // Update word count and display the first word
    wordCount.textContent = `Words in total: ${currentDeck.length}`;
    displayWord();
  });
});

// Display a word
function displayWord() {
  if (currentDeck.length === 0) {
    card.innerHTML = "<p>No words in this deck!</p>";
    return;
  }
  const word = currentDeck[currentIndex];
  card.innerHTML = `<p>${word.german}</p>`;
}

// Fetch words from the database on load
fetchWords();


// Initialize app
fetchWords();
updateWordCount();
displayWord();
