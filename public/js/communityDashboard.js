import { db, auth, collection, getDoc, getDocs, query, orderBy, limit, onAuthStateChanged, doc } from './firebaseConfig.js';

async function fetchLeaderboardData() {
    try {
        const usersRef = collection(db, 'users');
        const communityStatsDocRef = doc(db, "users", "CommunityStats101");

        // Top 5 Highest Consecutive Days
        const consecutiveQuery = query(usersRef, orderBy('consecutiveDays', 'desc'), limit(5));
        const consecutiveSnapshot = await getDocs(consecutiveQuery);
        const consecutiveData = consecutiveSnapshot.empty ? [] : consecutiveSnapshot.docs.map(doc => doc.data());

        // Top 5 Most Active Days
        const activeQuery = query(usersRef, orderBy('activeDays', 'desc'), limit(5));
        const activeSnapshot = await getDocs(activeQuery);
        const activeData = activeSnapshot.empty ? [] : activeSnapshot.docs.map(doc => doc.data());

        // Current Longest Active Streak
        const streakQuery = query(usersRef, orderBy('longestStreak', 'desc'), limit(1));
        const streakSnapshot = await getDocs(streakQuery);
        const longestStreakData = streakSnapshot.empty ? null : streakSnapshot.docs[0].data();

        // Total Users
        const totalSnapshot = await getDocs(usersRef);
        const totalUserCount = totalSnapshot.size;

        // Total BB Queries
        const docSnapshot = await getDoc(communityStatsDocRef);
        const totalBBQueries = docSnapshot.data().TotalBBQueries;

        // Update the DOM with the fetched data
        updateDashboard(consecutiveData, activeData, longestStreakData, totalUserCount, totalBBQueries);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
}

// Function to update the DOM with fetched data
function updateDashboard(topConsecutive, topActiveDays, longestStreak, totalUsers, totalBBQueries) {
    // Update Title
    document.querySelector('.community-dashboard-title').textContent = 'Community Dashboard';
    console.log("topConsecutive: ", topConsecutive);
    console.log("topActiveDays: ", topActiveDays);
    console.log("longestStreak: ", longestStreak);
    console.log("totalUsers: ", totalUsers);

    console.log("TotalBBQueries: ", totalBBQueries);

    
    // Total Users
    const totalUsersElement = document.querySelector('#total-users-count');
    if (totalUsersElement) {
        totalUsersElement.textContent = totalUsers;
    }

    // Update the Total Queries on the dashboard
    const totalQueriesElement = document.getElementById("total-queries-count");
    totalQueriesElement.textContent = totalBBQueries;

    // Longest Streak
    const streakElement = document.querySelector('.longest-streak');
    if (streakElement) {
        if (longestStreak) {
            streakElement.textContent = `Current Longest Active Streak: ${longestStreak.username} - ${longestStreak.consecutiveDays} days`;
        } else {
            streakElement.textContent = 'No streak data available.';
        }
    }

    // Top 5 Consecutive Days
    const consecutiveList = document.getElementById('top-consecutive');
    if (consecutiveList) {
        consecutiveList.innerHTML = ''; // Clear previous list
        topConsecutive.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${user.username}</strong>: <span style="color: #87CEEB">${user.consecutiveDays} days</span>`;
            consecutiveList.appendChild(listItem);
        });
    }

    // Top 5 Active Days
    const activeList = document.getElementById('top-active-days');
    if (activeList) {
        activeList.innerHTML = ''; // Clear previous list
        topActiveDays.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${user.username}</strong>: <span style="color: #87CEEB">${user.activeDays} days</span>`;
            activeList.appendChild(listItem);
        });
    }
}

// Fetch leaderboard data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            showLoading();
            fetchLeaderboardData(); // Fetch leaderboard data only if the user is authenticated
            hideLoading();
        } else {
            console.error("User not authenticated");
            // Redirect to login page or show a message
            window.location.href = "/login.html";
        }
    });
});

function showLoading() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.remove("hidden");
}

function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.add("hidden");
}
