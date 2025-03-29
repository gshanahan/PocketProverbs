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

  //Chat window logic
  async function sendMessage() {
    const chatWindow = document.getElementById("chatWindow");
    const chatInput = document.getElementById("chatInput");
    const userMessage = chatInput.value;
    if (!userMessage.trim()) return;
  
    // Display user message
    const userDiv = document.createElement("div");
    userDiv.textContent = "You: " + userMessage;
    userDiv.classList.add("text-sm", "mb-2", "text-blue-600");
    chatWindow.appendChild(userDiv);
    chatInput.value = "";
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer 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` // Replace with your API key
},
        body: JSON.stringify({
          model: "gpt-40-mini",
          messages: [{ role: "user", content: userMessage }]
        })
      });
  
      const data = await response.json();
      const botMessage = data.choices[0].message.content;
  
      // Display bot response
      const botDiv = document.createElement("div");
      botDiv.textContent = "Bot: " + botMessage;
      botDiv.classList.add("text-sm", "mb-2", "text-green-600");
      chatWindow.appendChild(botDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  }
  
  // Send message on button click
  document.getElementById("sendButton").addEventListener("click", sendMessage);
  
  // Send message on Enter key press
  document.getElementById("chatInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  window.logoutUser = logoutUser;