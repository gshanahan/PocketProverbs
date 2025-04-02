import { checkMessageLimit, messageLimit } from "./accountTiers.js";
import { auth, db, onAuthStateChanged, doc, setDoc, getDocs, collection, query, where, getDoc} from "./firebaseConfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Fetch user data and stats
async function fetchUserProfile() {
    const user = auth.currentUser;

    if (user) {
        try {
            // Get the username from Firestore
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const username = userDoc.data().username;

                // Display user email, join date, and username
                document.getElementById("user-email").textContent = user.email;
                document.getElementById("join-date").textContent = new Date(user.metadata.creationTime).toLocaleDateString();
                document.getElementById("userProfileHeading").textContent = `${username}'s Profile`;

                // Fetch user stats and profile picture
                getUserStats(user.uid);
                getProfilePicture(user.uid);
            } else {
                console.log("No user data found.");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error.message);
        }
    } else {
        console.log("User is not logged in.");
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

document.addEventListener('DOMContentLoaded', function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserProfile();
    } else {
        console.log('User is not logged in');
        // Optionally, redirect to the login page
        window.location.href = '/login.html';
    }
});
});

// Assuming you have the user's data loaded, including their daily query limit and usage.
function updateRemainingQueries(dailyLimit, queriesUsed, isPremium) {
    const queryStats = document.getElementById('query-stats');
    if (isPremium) {
        queryStats.style.display = 'none'; // Hide the stat for premium users
        return;
    }

    queryStats.style.display = 'block'; // Show the stat for non-premium users
    const remaining = dailyLimit - queriesUsed;
    const remainingQueriesElement = document.getElementById('remaining-queries');
    remainingQueriesElement.textContent = remaining > 0 ? remaining : 0;
}

async function getUserData() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is currently logged in.");

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) throw new Error("User data not found.");

        const { queriesUsed = 0, premiumAccount = false } = userDoc.data();
        
        const dailyLimit = messageLimit;  // Assuming messageLimit is defined elsewhere
        console.log(dailyLimit, queriesUsed, premiumAccount)
        
        return { dailyLimit, queriesUsed, isPremium: premiumAccount };
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        return { dailyLimit: 0, queriesUsed: 0, isPremium: false }; // Return defaults in case of error
    }
}

// Call the function to fetch documents on page load
document.addEventListener('DOMContentLoaded', function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
        const { dailyLimit, queriesUsed, isPremium } = getUserData();

        // Call this function to update the displayed remaining queries
        updateRemainingQueries(dailyLimit, queriesUsed, isPremium);
    } else {
        console.log('User is not logged in');
        // Optionally, redirect to the login page
        window.location.href = '/login.html';
    }
});
});