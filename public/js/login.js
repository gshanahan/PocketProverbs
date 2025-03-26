import { auth } from "./firebaseConfig.js";
  
    document.addEventListener("DOMContentLoaded", () => {
        // Attach event listeners to buttons
        document.getElementById("login-btn").addEventListener("click", login);
        document.getElementById("register-btn").addEventListener("click", register);
    });

    function login() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
        window.location.href = "/inbox.html"; // Redirect to private page
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
    }
  
    function register() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.createUserWithEmailAndPassword(email, password)
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
  
    window.login = login;
    window.register = register;