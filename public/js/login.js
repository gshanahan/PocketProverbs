import { auth, db, doc, setDoc, getDoc, addDoc, collection, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "./firebaseConfig.js";
  
    document.addEventListener("DOMContentLoaded", () => {
        // Attach event listeners to buttons
        document.getElementById("loginButton").addEventListener("click", loginUser);
        document.getElementById("registerButton").addEventListener("click", registerUser);
    });

    function loginUser() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      showLoading();
  
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
        window.location.href = "/index.html"; // Redirect to private page
        hideLoading();
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
        hideLoading();
      });
    }
  
    async function registerUser() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            console.log("Account created:", user.uid);
    
            // Save user data to Firestore
            await saveUserData(user.uid, email);
    
            // Redirect after Firestore data is saved
            window.location.href = "/index.html";
    
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    }
    
    // Function to Save User Data in Firestore
    async function saveUserData(userId, email, profilePictureUrl = null) {
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, {
                email: email,
                createdAt: serverTimestamp(), // Firestore timestamp instead of new Date()
                profilePicture: profilePictureUrl || null // Ensuring null if no profile picture
            });
    
            console.log("User data saved in Firestore.");
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log("User signed in: ", user.uid);
            saveUserData(user.uid, user.email);
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
      
      // Trigger login with button click
      document.getElementById("loginButton").addEventListener("click", loginUser);
      
  
    window.loginUser = loginUser;
    window.registerUser = registerUser;