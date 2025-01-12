const words = {
  all: [
    { word: "Hund", meaning: "Dog", category: "animals" },
    { word: "Katze", meaning: "Cat", category: "animals" },
    { word: "Apfel", meaning: "Apple", category: "food" },
    { word: "Haus", meaning: "House", category: "living" },
    { word: "Baum", meaning: "Tree", category: "living" },
    { word: "Zehn", meaning: "Ten", category: "numbers" },
    { word: "Laufen", meaning: "Run", category: "verbs" },
    { word: "Schnell", meaning: "Fast", category: "adjectives" },
    { word: "Tisch", meaning: "Table", category: "nouns" },
    { word: "Hemd", meaning: "Shirt", category: "clothes" },
    { word: "Schön", meaning: "Beautiful", category: "adjectives" },
    { word: "Brot", meaning: "Bread", category: "food" },
    { word: "Danke", meaning: "Thank you", category: "phrases" },
    { word: "Auf Wiedersehen", meaning: "Goodbye", category: "cool_phrases" },
    { word: "Kein Problem", meaning: "No problem", category: "cool_phrases" }
  ],
  numbers: [],
  animals: [],
  verbs: [],
  nouns: [],
  adjectives: [],
  phrases: [],
  food: [],
  living: [],
  clothes: [],
  cool_phrases: [],
  no_category: []
};

// Populate category-specific decks
for (let category in words) {
  if (category !== "all") {
    words[category] = words.all.filter((word) => word.category === category);
  }
}

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

function displayWord() {
  card.innerHTML = `<p>${showAnswer ? currentDeck[currentIndex].meaning : currentDeck[currentIndex].word}</p>`;
}

function nextCard() {
  currentIndex = (currentIndex + 1) % currentDeck.length;
  showAnswer = false;
  displayWord();
}

showAnswerButton.addEventListener("click", () => {
  showAnswer = !showAnswer;
  displayWord();
});

easyButton.addEventListener("click", nextCard);
mediumButton.addEventListener("click", nextCard);
hardButton.addEventListener("click", nextCard);

deckButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    const deck = e.target.getAttribute("data-deck");
    currentDeck = words[deck];
    currentIndex = 0;
    showAnswer = false;
    deckSelection.style.display = "none";
    deckSection.style.display = "block";
    displayWord();
  })
);

displayWord();
