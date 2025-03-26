import { auth } from "../config/firebaseConfig";
  
    document.addEventListener("DOMContentLoaded", () => {
        // Attach event listeners to buttons
        document.getElementById("login-btn").addEventListener("click", login);
        document.getElementById("register-btn").addEventListener("click", register);
    });

    function login() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.signInWithEmailAndPassword(email, password)
        .then(() => window.location.href = "/index.html")
        .catch(error => document.getElementById("error-message").innerText = error.message);
    }
  
    function register() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => window.location.href = "/index.html")
        .catch(error => document.getElementById("error-message").innerText = error.message);
    }
  
    window.login = login;
    window.register = register;