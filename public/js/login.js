import { auth } from "./firebaseConfig.js";
  
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
        window.location.href = "/inbox.html"; // Redirect to private page
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
    }
  
    function registerUser() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      createUserWithEmailAndPassword(window.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
          // Save user to Firestore
        saveUserData(user.uid, email);
        console.log("Account created:", userCredential.user);
        alert("Account created successfully!");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
    }
  
    window.loginUser = loginUser;
    window.registerUser = registerUser;