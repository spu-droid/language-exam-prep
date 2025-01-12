// Sample word dataset
const words = [
  { word: "Hund", meaning: "Dog", categories: ["animals", "nouns", "all"] },
  { word: "Katze", meaning: "Cat", categories: ["animals", "nouns", "all"] },
  { word: "Apfel", meaning: "Apple", categories: ["food", "nouns", "all"] },
  { word: "Haus", meaning: "House", categories: ["living", "nouns", "all"] },
  { word: "Baum", meaning: "Tree", categories: ["living", "nouns", "all"] },
  { word: "Zehn", meaning: "Ten", categories: ["numbers", "all"] },
  { word: "Drei", meaning: "Three", categories: ["numbers", "all"] },
  { word: "Laufen", meaning: "Run", categories: ["verbs", "all"] },
  { word: "Essen", meaning: "Eat", categories: ["verbs", "all"] },
  { word: "Schnell", meaning: "Fast", categories: ["adjectives", "all"] },
  { word: "Langsam", meaning: "Slow", categories: ["adjectives", "all"] },
  { word: "Tisch", meaning: "Table", categories: ["nouns", "living", "all"] },
  { word: "Hemd", meaning: "Shirt", categories: ["clothes", "nouns", "all"] },
  { word: "Hose", meaning: "Pants", categories: ["clothes", "all"] },
  { word: "Brot", meaning: "Bread", categories: ["food", "nouns", "all"] },
  { word: "Danke", meaning: "Thank you", categories: ["phrases", "all"] },
  { word: "Auf Wiedersehen", meaning: "Goodbye", categories: ["phrases", "cool_phrases", "all"] },
  { word: "Kein Problem", meaning: "No problem", categories: ["phrases", "cool_phrases", "all"] },
];

// DOM Elements
const card = document.getElementById("card");
const showAnswerButton = document.getElementById("show-answer");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
const deckButtons = document.querySelectorAll(".deck-btn");

let currentDeck = [];
let currentIndex = 0;
let showAnswer = false;

// Function to display a word
function displayWord() {
  if (currentDeck.length === 0) {
    card.innerHTML = "<p>No words in this deck!</p>";
    return;
  }
  card.innerHTML = `<p>${showAnswer ? currentDeck[currentIndex].meaning : currentDeck[currentIndex].word}</p>`;
}

// Event listener for "Show Answer" button
showAnswerButton.addEventListener("click", () => {
  showAnswer = !showAnswer;
  displayWord();
});

// Function to select the next card
function nextCard() {
  currentIndex = (currentIndex + 1) % currentDeck.length;
  showAnswer = false;
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
    showAnswer = false;

    // Display the first word
    displayWord();
  });
});

// Initialize with a default message
displayWord();
