// Sample word dataset
const words = [
  { word: "Hund", meaning: "Dog", categories: ["animals", "nouns", "all"] },
  { word: "Katze", meaning: "Cat", categories: ["animals", "nouns", "all"] },
  { word: "Apfel", meaning: "Apple", categories: ["food", "nouns", "all"] },
  { word: "Haus", meaning: "House", categories: ["living", "nouns", "all"] },
  { word: "Baum", meaning: "Tree", categories: ["living", "nouns", "all"] },
  { word: "Zehn", meaning: "Ten", categories: ["numbers", "all"] },
  { word: "Laufen", meaning: "Run", categories: ["verbs", "all"] },
  { word: "Schnell", meaning: "Fast", categories: ["adjectives", "all"] },
  { word: "Tisch", meaning: "Table", categories: ["nouns", "living", "all"] },
  { word: "Hemd", meaning: "Shirt", categories: ["clothes", "nouns", "all"] },
  { word: "Schön", meaning: "Beautiful", categories: ["adjectives", "all"] },
  { word: "Brot", meaning: "Bread", categories: ["food", "nouns", "all"] },
  { word: "Danke", meaning: "Thank you", categories: ["phrases", "all"] },
  { word: "Auf Wiedersehen", meaning: "Goodbye", categories: ["phrases", "cool_phrases", "all"] },
  { word: "Kein Problem", meaning: "No problem", categories: ["phrases", "cool_phrases", "all"] }
];

const card = document.getElementById("card");
const showAnswerButton = document.getElementById("show-answer");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
const deckButtons = document.querySelectorAll(".deck-btn");
const deckSection = document.getElementById("deck");
const deckSelection = document.getElementById("deck-selection");

let currentDeck = [];
let currentIndex = 0;
let showAnswer = false;

// Function to display a word on the flashcard
function displayWord() {
  if (currentDeck.length === 0) {
    card.innerHTML = "<p>No words available in this deck!</p>";
    return;
  }
  card.innerHTML = `<p>${showAnswer ? currentDeck[currentIndex].meaning : currentDeck[currentIndex].word}</p>`;
}

// Function to go to the next card
function nextCard() {
  if (currentDeck.length === 0) return;
  currentIndex = (currentIndex + 1) % currentDeck.length;
  showAnswer = false;
  displayWord();
}

// Event listener for "Show Answer" button
showAnswerButton.addEventListener("click", () => {
  showAnswer = !showAnswer;
  displayWord();
});

// Event listeners for difficulty buttons
easyButton.addEventListener("click", nextCard);
mediumButton.addEventListener("click", nextCard);
hardButton.addEventListener("click", nextCard);

// Function to handle deck selection
deckButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedDeck = e.target.getAttribute("data-deck");

    // Highlight the selected button
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Filter the words by category
    currentDeck = words.filter((word) =>
      word.categories.includes(selectedDeck)
    );

    currentIndex = 0;
    showAnswer = false;

    // Hide deck selection and show the flashcard section
    deckSelection.style.display = "none";
    deckSection.style.display = "block";

    displayWord();
  });
});

// Initialize with a default display
displayWord();
