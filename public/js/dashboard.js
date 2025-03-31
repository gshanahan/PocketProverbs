  import { auth, db, onAuthStateChanged, doc, setDoc, getDocs, collection, query, where} from "./firebaseConfig.js";
  import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

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

async function fetchDocuments() {
  try {
    const user = auth.currentUser;  // Get the current logged-in user

    if (!user) {
      console.log('User is not logged in');
      return;
    }

    // Get documents for the current user from the 'documents' collection
    const q = query(collection(db, "documents"), where("userId", "==", user.uid));
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

      // Add document to the appropriate category group
      if (category === "bible_study") {
        documentsByCategory.bible_study.push({ name, createdAt });
      } else if (category === "general_notes") {
        documentsByCategory.general_notes.push({ name, createdAt });
      } else if (category === "chat_log") {
        documentsByCategory.chat_log.push({ name, createdAt });
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
      const { name, createdAt } = doc;
      const formattedDate = createdAt.toDate().toLocaleDateString();  // Format the date to a readable string

      const row = document.createElement('tr');
      row.classList.add('document-row');

      row.innerHTML = `
        <td class="px-4 py-2 border-b">${name}</td>
        <td class="px-4 py-2 border-b">${formattedDate}</td>
        <td class="px-4 py-2 border-b">${category.replace('_', ' ').toUpperCase()}</td> <!-- Format category for display -->
      `;

      tbody.appendChild(row);
    });
  }
}

// Call the function to fetch documents on page load
fetchDocuments();


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