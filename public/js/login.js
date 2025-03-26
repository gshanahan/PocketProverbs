import { auth } from "../config/firebaseConfig.js";
  
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