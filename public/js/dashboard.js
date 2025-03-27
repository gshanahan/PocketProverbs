  import { auth } from "./firebaseConfig.js";
  import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

  // Example sign-out function (replace with Firebase auth method)
  function logoutUser() {
    // Firebase auth sign-out logic
    signOut(auth).then(() => {
      // Redirect to the login page or sign-in page
      window.location.href = '/login.html';
    }).catch(function(error) {
      console.error("Error signing out: ", error);
    });
  }

  // Example function for handling user messages to ChatGPT
  function handleUserMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
      // Send message to the backend (API call) for ChatGPT response
      console.log("User message:", userInput);
      // Example: add the user message to chat history
      const chatHistory = document.querySelector('.chat-history');
      chatHistory.innerHTML += `<div class="user-message">${userInput}</div>`;
      document.getElementById('user-input').value = '';  // Clear input field
      // Simulate GPT response (replace with actual GPT API integration)
      setTimeout(() => {
        chatHistory.innerHTML += `<div class="gpt-message">This is GPT's response to: ${userInput}</div>`;
      }, 1000);
    }
  }

  // Toggle Mobile Menu
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
  });

  // Verse generation
  const verses = [
    { text: '"Trust in the LORD with all your heart and lean not on your own understanding." - Proverbs 3:5' },
    { text: '"I can do all things through Christ who strengthens me." - Philippians 4:13' },
    { text: '"Be still, and know that I am God." - Psalm 46:10' }
  ];

  // Load a random verse
  document.getElementById("dailyVerse").innerText = verses[Math.floor(Math.random() * verses.length)].text;

  // Placeholder for analysis (Replace this with AI integration if needed)
  document.getElementById("generateAnalysis").addEventListener("click", function () {
      document.getElementById("verseAnalysis").value = "This verse emphasizes faith and reliance on God.";
  });

  window.logoutUser = logoutUser;