import { auth, db, onAuthStateChanged, doc, setDoc, collection} from "./firebaseConfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

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
alert("Save button pressed");
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
alert("This is your userId:", userId);
try {
    await saveDocument(userId, title, category, content);
    alert('Document saved successfully!');
} catch (error) {
    console.error("Error saving document: ", error);
    alert('Error saving the document. Please try again.');
}
});

window.logoutUser = logoutUser;