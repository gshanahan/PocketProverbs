  import { auth, db, onAuthStateChanged, doc, setDoc} from "./firebaseConfig.js";
  import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

  // Example sign-out function (replace with Firebase auth method)
    document.addEventListener('DOMContentLoaded', () => {
        const signOutBtn = document.getElementById('signOut');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', logoutUser);
        }
    });

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
//#1: 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
//#2: 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
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a biblical scholar and research assistant. You will only answer questions related to the Bible, its history, context, and teachings. If asked non-biblical questions, politely redirect the user to ask about biblical topics." },
            { role: "user", content: userMessage }
          ]
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

  async function saveDocument(userId, title, category, content) {
    try {
        const docRef = doc(collection(db, "users", userId, "documents"));
        await setDoc(docRef, {
            name: title,
            category: category, // "bible_study", "general_notes", or "chat_log"
            date: new Date(),
            content: content, // Store the content of the document (HTML or plain text)
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log("Document saved.");
    } catch (error) {
        console.error("Error saving document:", error);
        throw error;  // Rethrow to handle it in the calling function
    }
}

async function fetchDocuments(userId) {
  try {
      const documentsRef = collection(db, "users", userId, "documents");
      const querySnapshot = await getDocs(documentsRef);

      // Clear previous table entries
      const table = document.getElementById('documentsTable');
      table.innerHTML = ""; // Clear table

      // Populate table with fetched documents
      querySnapshot.forEach(doc => {
          const document = doc.data();
          const row = table.insertRow();
          
          const nameCell = row.insertCell(0);
          const categoryCell = row.insertCell(1);
          const dateCell = row.insertCell(2);
          const actionsCell = row.insertCell(3);

          nameCell.textContent = document.name;
          categoryCell.textContent = document.category;
          dateCell.textContent = new Date(document.date.seconds * 1000).toLocaleDateString();

          // Button to view the document
          actionsCell.innerHTML = `<button onclick="viewDocument('${doc.id}')">View</button>`;
      });
  } catch (error) {
      console.error("Error fetching documents: ", error);
  }
}

async function viewDocument(docId, userId) {
  try {
      const docRef = doc(db, "users", userId, "documents", docId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
          const document = docSnapshot.data();
          alert(`
              Name: ${document.name}
              Category: ${document.category}
              Date: ${new Date(document.date.seconds * 1000).toLocaleDateString()}
              Content: ${document.content}
          `);
      } else {
          console.log("No such document!");
      }
  } catch (error) {
      console.error("Error retrieving document: ", error);
  }
}

//const quill = new Quill('#editor-container', {
//  theme: 'snow',
//  modules: {
//    toolbar: '#toolbar',
//  },
//});

document.getElementById('save-btn').addEventListener('click', async function() {
  alert("Save button pressed");
  const title = document.getElementById('title-input').value;
  const category = document.getElementById('category-select').value;
  const content = quill.root.innerHTML; // Get the content from Quill editor

  if (!title || !content) {
      alert('Please enter a title and some content before saving.');
      return;
  }

  const user = auth.user;
  const userId = user.uid; // Replace with actual userId, possibly from auth state
  console.log(userId);
  try {
      await saveDocument(userId, title, category, content);
      alert('Document saved successfully!');
  } catch (error) {
      console.error("Error saving document: ", error);
      alert('Error saving the document. Please try again.');
  }
});

window.logoutUser = logoutUser;