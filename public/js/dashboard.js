  // Example sign-out function (replace with Firebase auth method)
  function signOut() {
    // Firebase auth sign-out logic
    firebase.auth().signOut().then(function() {
      // Redirect to the login page or sign-in page
      window.location.href = '/login';
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