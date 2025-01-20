import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU0vkul_XzwI97y9AUBFujN0MDefUnA3A",
    authDomain: "language-exam-prep-6698a.firebaseapp.com",
    databaseURL: "https://language-exam-prep-6698a-default-rtdb.firebaseio.com",
    projectId: "language-exam-prep-6698a",
    storageBucket: "language-exam-prep-6698a.appspot.com",
    messagingSenderId: "858022856301",
    appId: "1:858022856301:web:c416c22f250679783c6164",
    measurementId: "G-HLEJ2829GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to words in the database
const wordsRef = ref(database, 'words');

// Fetch words and display them
onValue(wordsRef, (snapshot) => {
    const words = snapshot.val();
    if (words) {
        // Example: Display the first word in the console
        console.log("Words loaded:", words);
        populateDecks(words);
    } else {
        console.log("No words found in the database.");
    }
});

// Populate decks with words
function populateDecks(words) {
    const deckButtons = document.querySelectorAll(".deck-btn");
    const card = document.getElementById("card");
    const wordCount = document.getElementById("word-count");

    let currentDeck = [];
    let currentWordIndex = 0;

    deckButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-deck");
            currentDeck = Object.values(words).filter(word =>
                category === "all" || word.category === category
            );
            currentWordIndex = 0;
            updateCard();
        });
    });

    function updateCard() {
        if (currentDeck.length > 0) {
            card.textContent = currentDeck[currentWordIndex].german; // Show German by default
            wordCount.textContent = `Words in total: ${currentDeck.length}`;
        } else {
            card.textContent = "No words in this deck!";
            wordCount.textContent = "Words in total: 0";
        }
    }
}

