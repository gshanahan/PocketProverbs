import { auth, db, doc, setDoc, getDoc, collection, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, serverTimestamp } from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginButton").addEventListener("click", loginUser);
    document.getElementById("registerButton").addEventListener("click", registerUser);
});

async function loginUser() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    showLoading();

    try {
        // Attempt login with email
        if (email) {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in with email:", email);
        }
        // Attempt login with username
        else if (username) {
            const userQuery = await db.collection("users").where("username", "==", username).get();
            if (!userQuery.empty) {
                const userDoc = userQuery.docs[0];
                await signInWithEmailAndPassword(auth, userDoc.data().email, password);
                console.log("Logged in with username:", username);
            } else {
                alert("Username does not exist.");
            }
        }

        window.location.href = "/index.html"; // Redirect to private page
    } catch (error) {
        console.error("Error logging in: ", error.message);
        alert(error.message);
    } finally {
        hideLoading();
    }
}

async function registerUser() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!email || !username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    showLoading();

    try {
        // Check if email already exists
        const emailQuery = await db.collection("users").where("email", "==", email).get();
        if (!emailQuery.empty) {
            alert("Email is already in use. Please choose a different email.");
            return;
        }

        // Check if username already exists
        const usernameQuery = await db.collection("users").where("username", "==", username).get();
        if (!usernameQuery.empty) {
            alert("Username is already taken. Please choose a different username.");
            return;
        }

        // Create the user account with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created:", userCredential.user);

        // Save user data to Firestore
        await saveUserData(userCredential.user, email, username);

        window.location.href = "/index.html"; // Redirect after registration
    } catch (error) {
        console.error("Error registering user: ", error.message);
        alert(error.message);
    } finally {
        hideLoading();
    }
}

// Function to Save User Data in Firestore
async function saveUserData(user, email, username) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    // If user document doesn't exist, initialize the data
    if (!userDoc.exists()) {
        await setDoc(userRef, {
            email: email,
            username: username,
            createdAt: serverTimestamp(),
            profilePicture: null, // Optional field for profile picture
            queries: 0,
            documentsSaved: 0
        });

        console.log("User data saved in Firestore.");
    } else {
        console.log("User data already exists. No need to overwrite.");
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in: ", user.uid);
    } else {
        console.log("No user signed in.");
    }
});

function showLoading() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.remove("hidden");
}

function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.add("hidden");
}
