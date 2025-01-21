document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase libraries are loaded
    if (typeof firebase !== 'undefined' && firebase.app) {
        // Initialize Firebase
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
        firebase.initializeApp(firebaseConfig);
    } else {
        console.log('Firebase not loaded');
    }

    const deckButtons = document.querySelectorAll(".deck-btn");
    const card = document.getElementById("card");
    const wordCount = document.getElementById("word-count");

    deckButtons.forEach(button => {
        button.addEventListener("click", function() {
            deckButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            if (firebase && firebase.database) {
                fetchWords(this.getAttribute("data-deck"));
            } else {
                card.innerHTML = "<p>Firebase is not available. Displaying local data may not be possible.</p>";
                wordCount.textContent = "Words in total: 0";
            }
        });
    });

    async function fetchWords(deck) {
        try {
            const snapshot = await firebase.database().ref("words").once("value");
            const words = snapshot.val() || {};
            displayWords(filterWords(words, deck));
        } catch (error) {
            console.error("Error fetching words: ", error);
            card.innerHTML = "<p>Error loading data.</p>";
        }
    }

    function filterWords(words, category) {
        if (category === "all") {
            return Object.values(words);
        }
        return Object.values(words).filter(word => word.category.split(';').map(cat => cat.trim()).includes(category));
    }

    function displayWords(words) {
        if (words.length > 0) {
            card.innerHTML = `<p>${words[0].german} / ${words[0].italian}</p>`; // Example display of first word
            wordCount.textContent = `Words in total: ${words.length}`;
        } else {
            card.innerHTML = "<p>No words in this deck! Please select another.</p>";
            wordCount.textContent = "Words in total: 0";
        }
    }
});
