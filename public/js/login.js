import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

  
    document.addEventListener("DOMContentLoaded", () => {
        // Attach event listeners to buttons
        document.getElementById("loginButton").addEventListener("click", loginUser);
        document.getElementById("registerButton").addEventListener("click", registerUser);
    });

    function loginUser() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
        window.location.href = "/index.html"; // Redirect to private page
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
    }
  
    function registerUser() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
          // Save user to Firestore
        saveUserData(user.uid, email);
        console.log("Account created:", userCredential.user);
        alert("Account created successfully!");
        window.location.href = "/index.html"; // Redirect to private page
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
    }

    async function saveUserData(userId, email) {
        try {
            const userRef = doc(db, "users", userId); // Creates /users/{userId}
            await setDoc(userRef, {
                email: email,
                createdAt: new Date(),
                savedStudies: [] // Empty array for studies (optional)
            });
            console.log("User data saved in Firestore.");
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }
  
    window.loginUser = loginUser;
    window.registerUser = registerUser;