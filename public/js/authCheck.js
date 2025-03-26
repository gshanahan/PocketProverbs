import { auth } from "../config/firebaseConfig.js";

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "/login.html"; // Redirect to login if not authenticated
    }
});
