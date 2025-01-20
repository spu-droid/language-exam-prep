// Sample word dataset
const words = [
  { italian: "mare", german: "Meer", categories: ["nouns", "all"] },
  { italian: "festa", german: "Fest", categories: ["nouns", "all"] },
  { italian: "due", german: "zwei", categories: ["numbers", "all"] },
  { italian: "dialogo", german: "Dialog", categories: ["nouns", "all"] },
  { italian: "ascoltare", german: "hören", categories: ["verbs", "all"] },
  { italian: "città", german: "Stadt", categories: ["nouns", "all"] },
  { italian: "cane", german: "Hund", categories: ["animals", "nouns", "all"] },
  { italian: "grazie", german: "danke", categories: ["phrases", "all"] },
  { italian: "arrivederci", german: "auf Wiedersehen", categories: ["phrases", "all"] },
  { italian: "vino", german: "Wein", categories: ["food", "all"] },
  { italian: "pane", german: "Brot", categories: ["food", "all"] },
];

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
  button.addEventListener("click", (e) => {
    const selectedDeck = e.target.getAttribute("data-deck");

    // Highlight the active button
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Filter words for the selected deck
    currentDeck = words.filter((word) => word.categories.includes(selectedDeck));
    currentIndex = 0;

    // Update word count and display the first word
    updateWordCount();
    displayWord();
  });
});

// Initialize with a default message
updateWordCount();
displayWord();
