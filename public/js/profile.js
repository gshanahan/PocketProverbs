import { auth, db, onAuthStateChanged, doc, setDoc, getDocs, collection, query, where} from "./firebaseConfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Fetch user data and stats
function fetchUserProfile() {
    const user = auth.currentUser;

    if (user) {
        // Display user email and join date
        document.getElementById("user-email").textContent = user.email;
        document.getElementById("join-date").textContent = new Date(user.metadata.creationTime).toLocaleDateString();

        // Fetch user stats from Firestore
        getUserStats(user.uid);

        // Fetch and display profile picture URL from Firebase Storage
        getProfilePicture(user.uid);
    } else {
        console.log('User is not logged in');
    }
}

// Fetch user stats (queries made and documents saved)
async function getUserStats(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);  // Use getDoc() to fetch the document

        if (userDoc.exists()) {  // Ensure the document exists before accessing its data
            const data = userDoc.data();
            document.getElementById("queries-count").textContent = data.queries || 0;
            document.getElementById("documents-count").textContent = data.documentsSaved || 0;
        } else {
            console.log("No user stats found");
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
    }
}

// Get and display profile picture from Firebase Storage
async function getProfilePicture(userId) {
    const storageRef = storage.ref();
    const profilePicRef = storageRef.child(`profile_pics/${userId}.jpg`);

    try {
        const url = await profilePicRef.getDownloadURL();
        document.getElementById("profile-pic").src = url;
    } catch (error) {
        console.log("No profile picture found, using default.");
    }
}

// Upload profile picture to Firebase Storage
async function uploadProfilePicture() {
    const user = auth.currentUser;

    if (!user) {
        console.log('User is not logged in');
        return;
    }

    const fileInput = document.getElementById("profile-pic-upload");
    const file = fileInput.files[0];

    if (!file) {
        console.log('No file selected');
        return;
    }

    const storageRef = storage.ref();
    const userProfilePicRef = storageRef.child(`profile_pics/${user.uid}.jpg`);

    try {
        await userProfilePicRef.put(file);
        console.log("Profile picture uploaded successfully");

        // Fetch and display the newly uploaded profile picture
        getProfilePicture(user.uid);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
    }
}

// Initialize when the user is authenticated
auth.onAuthStateChanged(user => {
    if (user) {
        fetchUserProfile();
    } else {
        console.log('No user is logged in');
    }
});
