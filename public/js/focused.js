import { auth, db, onAuthStateChanged, doc, setDoc, collection} from "./firebaseConfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
//import { showSuccessAlert, showErrorAlert, showConfirmationDialog } from './alerts.js';

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
          { role: "system", content: "You are a Bible study assistant designed specifically for PocketProverbs, a platform that helps users explore scripture deeply by providing historical context, cross-referenced insights, and structured study plans. Your role is to support users in their Bible study process by offering detailed historical, cultural, and archaeological context related to Scripture. You will also facilitate cross-referencing of verses and passages to better understand overarching biblical themes and messages, helping users create custom Bible studies efficiently. Your responses should be focused on offering scholarly insights into the Bible, ensuring users gain a rich, contextual understanding of the text. Do not engage in any tasks outside of the Bible study context." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Display bot response
    const botDiv = document.createElement("div");
    botDiv.textContent = "BibleBuddy: " + botMessage;
    botDiv.classList.add("text-sm", "mb-2", "text-green-600");
    chatWindow.appendChild(botDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

document.addEventListener("DOMContentLoaded", function() {
    // Send message on button click
    document.getElementById("sendButton").addEventListener("click", sendMessage);
  
    // Send message on Enter key press
    document.getElementById("chatInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
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

document.getElementById('save-btn').addEventListener('click', async function() {
const title = document.getElementById('title-input').value;
const category = document.getElementById('category-select').value;
const content = quill.root.innerHTML; // Get the content from Quill editor

if (!title || !content) {
    alert('Please enter a title and some content before saving.');
    return;
}

const auth = getAuth();
// Get the current logged-in user
const user = auth.currentUser;
const userId = user.uid;
console.log(userId);
try {
    await saveDocument(userId, title, category, content);
    alert('Document saved successfully!');
    //showSuccessAlert('Success', 'Document saved successfully!');
} catch (error) {
    console.error("Error saving document: ", error);
    alert('Error saving the document. Please try again.');
    //showErrorAlert('Error', 'There was an issue saving the document.');
}
});

window.logoutUser = logoutUser;