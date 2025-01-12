// Sample flashcards
const words = [
  { word: "Hund", meaning: "Dog" },
  { word: "Katze", meaning: "Cat" },
  { word: "Apfel", meaning: "Apple" },
  { word: "Haus", meaning: "House" },
  { word: "Baum", meaning: "Tree" }
];

// DOM Elements
const card = document.getElementById("card");
const showAnswerButton = document.getElementById("show-answer");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");

let currentIndex = 0;
let showAnswer = false;

// Display a word
function displayWord() {
  card.innerHTML = `<p>${showAnswer ? words[currentIndex].meaning : words[currentIndex].word}</p>`;
}

// Show next card based on user difficulty
function nextCard() {
  currentIndex = (currentIndex + 1) % words.length;
  showAnswer = false;
  displayWord();
}

// Event listeners
showAnswerButton.addEventListener("click", () => {
  showAnswer = !showAnswer;
  displayWord();
});

easyButton.addEventListener("click", () => {
  console.log("Marked Easy");
  nextCard();
});

mediumButton.addEventListener("click", () => {
  console.log("Marked Medium");
  nextCard();
});

hardButton.addEventListener("click", () => {
  console.log("Marked Hard");
  nextCard();
});

// Initialize
displayWord();
