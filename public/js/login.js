import { auth, db, doc, setDoc, getDoc, updateDoc, collection, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, serverTimestamp, query, where, getDocs } from "./firebaseConfig.js";

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

        window.location.href = "/";
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

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Account created:", userCredential.user);

      // Step 1: Check if the email or username is already in use
      const usersRef = collection(db, "users");

      // Email uniqueness check
      const emailQuery = query(usersRef, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
          alert("Email is already in use. Please choose a different email.");
          await userCredential.user.delete(); // Clean up the user if registration fails
          return;
      }

      // Username uniqueness check
      const usernameQuery = query(usersRef, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
          alert("Username is already taken. Please choose a different username.");
          await userCredential.user.delete(); // Clean up the user if registration fails
          return;
      }

      // Step 3: Save user data in Firestore after validation
      await saveUserData(userCredential.user, email, username);

      window.location.href = "/";
  } catch (error) {
      console.error("Error registering user: ", error.message);
      alert(error.message);
  } finally {
      hideLoading();
  }
}


async function saveUserData(user, email, username) {
    const userRef = doc(db, "users", user.uid);
    //const userDoc = await getDoc(userRef);
    let currentDate = new Date();

    try {
        await setDoc(userRef, {
            email: email,
            username: username,
            createdAt: serverTimestamp(),
            profilePicture: null,
            queries: 0,
            documentsSaved: 0,
            consecutiveDays: 0,
            activeDays: 0,
            longestStreak: 0,
            lastActiveDate: currentDate,
            premiumAccount: false,
            messagesSentToday: 0,
            lastResetTimestamp: serverTimestamp()
        });
        console.log("User data saved in Firestore.");
        alert("User data saved in firestore")
    } catch {
      console.error("Error saving user data:", error);
      alert("Error saving user data: " + error.message);

    }
}

async function updateUserActivity() {
  const user = auth.currentUser;
  console.log("UpdateUserData function called");
  if (!user) return;

  try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      if (userDoc.exists()) {
          const data = userDoc.data();
          const lastActiveDate = data.lastActiveDate || "";
          const activeDays = data.activeDays || 0;
          const consecutiveDays = data.consecutiveDays || 0;
          const longestStreak = data.longestStreak || 0;

          // Calculate the difference in days
          const lastDate = new Date(lastActiveDate);
          const currentDate = new Date(today);
          const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

          let updatedActiveDays = activeDays;
          let updatedConsecutiveDays = consecutiveDays;
          let updatedLongestStreak = longestStreak;

          if (diffDays === 0) {
              console.log("User already active today");
              return;
          } else if (diffDays === 1) {
              // Next consecutive day
              updatedActiveDays++;
              updatedConsecutiveDays++;
              if (updatedConsecutiveDays > updatedLongestStreak) {
                  updatedLongestStreak = updatedConsecutiveDays;
              }
          } else {
              // Non-consecutive day or new streak
              updatedActiveDays++;
              updatedConsecutiveDays = 1;
          }

          // Update Firestore
          await updateDoc(userRef, {
              lastActiveDate: today,
              activeDays: updatedActiveDays,
              consecutiveDays: updatedConsecutiveDays,
              longestStreak: updatedLongestStreak,
              lastLogin: serverTimestamp(),
          });

          console.log("User activity updated");
      } else {
          // New user or no previous activity recorded
          await setDoc(userRef, {
              lastActiveDate: today,
              activeDays: 1,
              consecutiveDays: 1,
              longestStreak: 1,
              lastLogin: serverTimestamp(),
          });
          console.log("New user activity initialized");
      }
  } catch (error) {
      console.error("Error updating user activity:", error.message);
  }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in: ", user.uid);
        updateUserActivity();
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