// DOM Elements
const deckButtons = document.querySelectorAll(".deck-btn");

// Handle deck selection
deckButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Remove 'active' class from all buttons to ensure only one can be active at a time
    deckButtons.forEach((btn) => btn.classList.remove("active"));
    
    // Add 'active' class to the clicked button
    e.target.classList.add("active");
  });
});

// Keep other functionalities as they are in the existing app.js code
// Just ensure that these functionalities are not altered by the deck button behavior