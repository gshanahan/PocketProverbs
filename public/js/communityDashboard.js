import { db, auth, collection, getDocs, query, orderBy, limit, onAuthStateChanged } from './firebaseConfig.js';

async function fetchLeaderboardData() {
    try {
        const usersRef = collection(db, 'users');

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

        // Update the DOM with the fetched data
        updateDashboard(consecutiveData, activeData, longestStreakData, totalUserCount);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
}

// Function to update the DOM with fetched data
function updateDashboard(topConsecutive, topActiveDays, longestStreak, totalUsers) {
    // Update Title
    document.querySelector('.community-dashboard-title').textContent = 'Community Dashboard';
    console.log("topConsecutive: ", topConsecutive);
    console.log("topActiveDays: ", topActiveDays);
    console.log("longestStreak: ", longestStreak);
    console.log("totalUsers: ", totalUsers);

    
    // Total Users
    const totalUsersElement = document.querySelector('#total-users-count');
    if (totalUsersElement) {
        totalUsersElement.textContent = totalUsers;
    }


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
    const consecutiveList = document.querySelector('.top-consecutive');
    if (consecutiveList) {
        consecutiveList.innerHTML = ''; // Clear previous list
        topConsecutive.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username}: ${user.consecutiveDays} days`;
            consecutiveList.appendChild(listItem);
        });
    }

    // Top 5 Active Days
    const activeList = document.getElementById('top-active-days');
    if (activeList) {
        activeList.innerHTML = ''; // Clear previous list
        topActiveDays.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username}: ${user.activeDays} days`;
            activeList.appendChild(listItem);
        });
    }
}

// Fetch leaderboard data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchLeaderboardData(); // Fetch leaderboard data only if the user is authenticated
        } else {
            console.error("User not authenticated");
            // Redirect to login page or show a message
            window.location.href = "/login.html";
        }
    });
});
