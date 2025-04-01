import { db, auth, collection, getDocs, query, orderBy, limit, onAuthStateChanged } from './firebaseConfig.js';

// Function to fetch leaderboard data from Firebase
async function fetchLeaderboardData() {
    try {
        const usersRef = collection(db, 'users');

        // Top 5 Highest Consecutive Days
        const consecutiveQuery = query(usersRef, orderBy('consecutiveDays', 'desc'), limit(5));
        const consecutiveSnapshot = await getDocs(consecutiveQuery);
        const consecutiveData = consecutiveSnapshot.docs.map(doc => doc.data());

        // Top 5 Most Active Days
        const activeQuery = query(usersRef, orderBy('totalActiveDays', 'desc'), limit(5));
        const activeSnapshot = await getDocs(activeQuery);
        const activeData = activeSnapshot.docs.map(doc => doc.data());

        // Current Longest Active Streak
        const streakQuery = query(usersRef, orderBy('consecutiveDays', 'desc'), limit(1));
        const streakSnapshot = await getDocs(streakQuery);
        const longestStreakData = streakSnapshot.docs[0]?.data() || null;

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
    console.log('Top Consecutive:', consecutiveData);
    console.log('Top Active Days:', activeData);
    console.log('Longest Streak:', longestStreakData);
    console.log('Total Users:', totalUserCount);
    
    // Total Users
    const totalUsersElement = document.querySelector('.total-users');
    if (totalUsersElement) {
        totalUsersElement.textContent = `Total Users: ${totalUsers}`;
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
    const consecutiveList = document.querySelector('.top-consecutive-list');
    if (consecutiveList) {
        consecutiveList.innerHTML = ''; // Clear previous list
        topConsecutive.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username}: ${user.consecutiveDays} days`;
            consecutiveList.appendChild(listItem);
        });
    }

    // Top 5 Active Days
    const activeList = document.querySelector('.top-active-days-list');
    if (activeList) {
        activeList.innerHTML = ''; // Clear previous list
        topActiveDays.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username}: ${user.totalActiveDays} days`;
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
