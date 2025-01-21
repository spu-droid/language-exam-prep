document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase if available
    if (typeof firebase !== 'undefined' && firebase.app) {
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
        firebase.initializeApp(firebaseConfig);
    }

    // DOM Elements
    const card = document.getElementById("card");
    const wordCount = document.getElementById("word-count");
    const deckButtons = document.querySelectorAll(".deck-btn");

    // Function to display a message if no words or no Firebase
    function displayMessage(message) {
        card.innerHTML = `<p>${message}</p>`;
    }

    // Event listener for deck buttons
    deckButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            // Highlight the active button
            deckButtons.forEach((btn) => btn.classList.remove("active"));
            e.target.classList.add("active");

            // Check for Firebase and fetch words
            if (firebase && firebase.database) {
                fetchWords(e.target.getAttribute("data-deck"));
            } else {
                displayMessage("Firebase is not available. Displaying local data may not be possible.");
            }
        });
    });

    // Fetch words from Firebase Database
    async function fetchWords(category) {
        try {
            const database = firebase.database();
            const snapshot = await database.ref("words").once("value");
            const words = snapshot.val() || {};

            // Filter and display words
            displayWords(filterWords(words, category));
        } catch (error) {
            console.error("Firebase operation failed: ", error);
            displayMessage("Error fetching data. Please check your network connection.");
        }
    }

    // Filter words by category
    function filterWords(words, category) {
        if (category === "all") {
            return Object.values(words);
        }
        return Object.values(words).filter(word => word.category.split(';').map(cat => cat.trim()).includes(category));
    }

    // Function to display words
    function displayWords(words) {
        if (words.length > 0) {
            card.innerHTML = `<p>${words[0].german} / ${words[0].italian}</p>`; // Example display
            wordCount.textContent = `Words in total: ${words.length}`;
        } else {
            displayMessage("No words in this deck! Please select another.");
        }
    }
});
