  import { auth, db, onAuthStateChanged, doc, setDoc, getDocs, collection, query, where, updateDoc, increment } from "./firebaseConfig.js";
  import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
  import { checkMessageLimit } from "./accountTiers.js";

  document.getElementById("signOutBtn").addEventListener("click", logoutUser);
  document.getElementById("mobile-signOut").addEventListener("click", logoutUser);

  function logoutUser() {
      auth.signOut().then(() => {
          console.log("User signed out successfully");
          // Redirect to the login page
          window.location.href = '/login.html';
      }).catch(function(error) {
          console.error("Error signing out: ", error);
      });
  }

// Typing effect function for chatbot responses (renders HTML)
function typeOutBotMessage(element, htmlText, speed = 25) {
  let index = 0;
  element.innerHTML = ""; // Clear existing text

  function typeChar() {
      if (index < htmlText.length) {
          // Accumulate the text as HTML instead of plain text
          element.innerHTML = htmlText.slice(0, index + 1);
          index++;
          chatWindow.scrollTop = chatWindow.scrollHeight; // Keep chat scrolled to the bottom
          setTimeout(typeChar, speed);
      }
  }

  typeChar();
}

  async function trackQuery() {
    const user = auth.currentUser;  // Get the current logged-in user
    // Get reference to the 'CommunityStats101' document
    const communityStatsDocRef = doc(db, "users", "CommunityStats101");
  
    if (!user) {
      console.log('User is not logged in');
      return;
    }
  
    const userId = user.uid;
    
    try {
      // Get reference to the user's Firestore document
      const userDocRef = doc(db, "users", userId);
  
      // Atomically update the query count using the increment function
      await updateDoc(userDocRef, {
        queries: increment(1)  // Increment the queries count by 1
      });
      await updateDoc(communityStatsDocRef, {
        TotalBBQueries: increment(1)  // Increment the community stats query count by 1
      });
  
      console.log("Query count updated successfully");
  
    } catch (error) {
      console.error("Error updating query count:", error);
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
    const user = auth.currentUser;  // Get the current logged-in user
    const userId = user.uid;

    const canSend = await checkMessageLimit(userId);
        if (canSend) {
            // Logic to send the message and update the user's message count
            const userDocRef = doc(db, "users", userId);

            // Atomically update the messages count using the increment function
            await updateDoc(userDocRef, {
              messagesSentToday: increment(1)  // Increment the queries count by 1
            });
    
            const chatWindow = document.getElementById("chatWindow");
            const chatInput = document.getElementById("chatInput");
            const userMessage = chatInput.value;
            if (!userMessage.trim()) return;
          
            // Display user message
            const userDiv = document.createElement("div");
            userDiv.textContent = "You: " + userMessage;
            userDiv.classList.add("text-sm", "mb-2");
            userDiv.style.color = "#D3D3D3";
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
                  model: "gpt-4o",
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
            botDiv.classList.add("text-sm", "mb-2", "text-green-600");
            botDiv.style.color = "#87CEEB";
            chatWindow.appendChild(botDiv);
            chatWindow.scrollTop = chatWindow.scrollHeight;

            // Parse the GPT output with formatting
            const parsedBotMessage = formatGPTOutput(botMessage);

            // Wrap the message with a title
            const formattedMessage = `<strong>BibleBuddy:</strong> ${parsedBotMessage}`;

            // Use the typing effect for the bot message
            typeOutBotMessage(botDiv, formattedMessage, 10); // Adjust speed as needed
            } catch (error) {
              console.error("Error fetching response:", error);
            }
        
            trackQuery();
        }
        else {
              const botMessage = "You've reached your daily BibleBuddy message limit. Upgrade to a premium account to send unlimited messages!";
          
            // Display bot response
              const botDiv = document.createElement("div");
              botDiv.classList.add("text-sm", "mb-2", "text-green-600");
              botDiv.style.color = "#FFFFFF";
              chatWindow.appendChild(botDiv);
              chatWindow.scrollTop = chatWindow.scrollHeight;
        
              // Use the typing effect for the bot message
              typeOutBotMessage(botDiv, "BibleBuddy: " + botMessage, 10); // Adjust speed as needed
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

async function fetchDocuments(user) {
  try {
     // Get documents for the current user from the 'documents' collection
     const q = query(
      collection(db, `users/${user.uid}/documents`)
    );
    const querySnapshot = await getDocs(q);

    // Group documents by category
    const documentsByCategory = {
      bible_study: [],
      general_notes: [],
      chat_log: []
    };

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const { name, createdAt, category } = docData;
      const docId = doc.id;


      // Add document to the appropriate category group
      if (category === "bible_study") {
        documentsByCategory.bible_study.push({ name, createdAt, docId });
      } else if (category === "general_notes") {
        documentsByCategory.general_notes.push({ name, createdAt, docId });
      } else if (category === "chat_log") {
        documentsByCategory.chat_log.push({ name, createdAt, docId });
      }
    });

    // Populate the table with documents
    populateTable(documentsByCategory);

  } catch (error) {
    console.error('Error fetching documents: ', error);
  }
}

function populateTable(documentsByCategory) {
  const tbody = document.getElementById('documents-tbody');
  tbody.innerHTML = '';  // Clear previous content

  // Iterate through document categories and display them in the table
  for (const [category, documents] of Object.entries(documentsByCategory)) {
    documents.forEach((doc) => {
      const { name, createdAt, docId } = doc;
      const formattedDate = createdAt.toDate().toLocaleDateString();

      const row = document.createElement('tr');
      row.classList.add('document-row');
      row.dataset.docId = docId;  // Store the document ID in a data attribute

      row.innerHTML = `
        <td class="px-4 py-2 border-b">${name}</td>
        <td class="px-4 py-2 border-b">${formattedDate}</td>
        <td class="px-4 py-2 border-b">${category.replace('_', ' ').toUpperCase()}</td>
      `;

      // Add a click event to open the document
      row.addEventListener('click', () => openDocument(docId));

      tbody.appendChild(row);
    });
  }
}

function openDocument(docId) {
  // Redirect to the editor page, passing the document ID as a query parameter
  window.location.href = `focused.html?docId=${docId}`;
}

// Call the function to fetch documents on page load
document.addEventListener('DOMContentLoaded', function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
        // Call the function to fetch documents once the user is available
        fetchDocuments(user);
    } else {
        console.log('User is not logged in');
        // Optionally, redirect to the login page
        window.location.href = '/login.html';
    }
});
});

function formatGPTOutput(gptOutput) {
  return marked.parse(gptOutput);
}

window.logoutUser = logoutUser;