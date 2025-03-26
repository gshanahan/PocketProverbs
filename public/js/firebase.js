import { auth } from "./config/firebaseConfig.js";

// Check authentication on page load
auth.onAuthStateChanged(user => {
  const isLoginPage = window.location.pathname.includes("login.html");

  if (user) {
    if (isLoginPage) {
      window.location.href = "/index.html";
    }
  } else {
    if (!isLoginPage) {
      window.location.href = "/login.html";
    }
  }
});

// Logout function
function signOut() {
  auth.signOut().then(() => {
    window.location.href = "/login.html";
  }).catch(error => {
    console.error("Error signing out:", error);
  });
}

export { signOut };