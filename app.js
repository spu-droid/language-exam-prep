document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase !== 'undefined') {
        try {
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
            console.log('Firebase initialized');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    } else {
        console.error('Firebase SDK not loaded');
    }

    const deckButtons = document.querySelectorAll(".deck-btn");
    const card = document.getElementById("card");
    const wordCount = document.getElementById("word-count");

    deckButtons.forEach(button => {
        button.addEventListener("click", function() {
            deckButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            fetchWords(this.getAttribute("data-deck"));
        });
    });

    function fetchWords(deck) {
        const wordsRef = firebase.database().ref('words');
        wordsRef.on('value', snapshot => {
            const data = snapshot.val();
            if (!data) {
                card.innerHTML = "<p>No data available.</p>";
                return;
            }
            const words = filterWords(data, deck);
            displayWords(words);
        }, error => {
            console.error('Error fetching words:', error);
            card.innerHTML = "<p>Error loading words.</p>";
        });
    }

    function filterWords(words, category) {
        const filteredWords = Object.values(words).filter(word => {
            return word.category.split(';').includes(category);
        });
        console.log('Filtered Words:', filteredWords);
        return filteredWords;
    }

    function displayWords(words) {
        if (words.length > 0) {
            const word = words[0]; // Display the first word as an example
            card.innerHTML = `<p>${word.german} / ${word.italian}</p>`;
            wordCount.textContent = `Words in total: ${words.length}`;
        } else {
            card.innerHTML = "<p>No words in this deck! Please select another.</p>";
            wordCount.textContent = "Words in total: 0";
        }
    }
});
