import { auth } from "./firebaseConfig.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "/login.html"; // Redirect to login if not authenticated
    }
});
