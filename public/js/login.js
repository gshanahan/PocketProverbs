import { auth, db, doc, setDoc, getDoc, collection, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, serverTimestamp, query, where, getDocs } from "./firebaseConfig.js";

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
        if (email) {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in with email:", email);
        } else if (username) {
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userEmail = userDoc.data().email;
                await signInWithEmailAndPassword(auth, userEmail, password);
                console.log("Logged in with username:", username);
            } else {
                alert("Username does not exist.");
            }
        }

        window.location.href = "/index.html";
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
        const usersRef = collection(db, "users");
        const emailQuery = query(usersRef, where("email", "==", email));
        const emailSnapshot = await getDocs(emailQuery);
        if (!emailSnapshot.empty) {
            alert("Email is already in use. Please choose a different email.");
            return;
        }

        const usernameQuery = query(usersRef, where("username", "==", username));
        const usernameSnapshot = await getDocs(usernameQuery);
        if (!usernameSnapshot.empty) {
            alert("Username is already taken. Please choose a different username.");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created:", userCredential.user);
        await saveUserData(userCredential.user, email, username);

        window.location.href = "/index.html";
    } catch (error) {
        console.error("Error registering user: ", error.message);
        alert(error.message);
    } finally {
        hideLoading();
    }
}

async function saveUserData(user, email, username) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            email: email,
            username: username,
            createdAt: serverTimestamp(),
            profilePicture: null,
            queries: 0,
            documentsSaved: 0
        });
        console.log("User data saved in Firestore.");
    } else {
        console.log("User data already exists. No need to overwrite.");
    }
}

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
