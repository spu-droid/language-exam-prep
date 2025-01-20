// DOM Elements
const deckButtons = document.querySelectorAll(".deck-btn");
const flashcardsHeader = document.getElementById("flashcards-header");

// Function to update the Flashcards header and highlight the selected button
function handleDeckSelection(event) {
  // Remove "active" class from all buttons
  deckButtons.forEach((button) => button.classList.remove("active"));

  // Add "active" class to the clicked button
  const clickedButton = event.target;
  clickedButton.classList.add("active");

  // Update the Flashcards header
  const selectedDeck = clickedButton.getAttribute("data-deck");
  flashcardsHeader.textContent = `Flashcards : ${selectedDeck}`;
}

// Add event listeners to all deck buttons
deckButtons.forEach((button) => {
  button.addEventListener("click", handleDeckSelection);
});
