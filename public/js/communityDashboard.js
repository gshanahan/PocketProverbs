import { db } from './firebaseConfig.js';

// Function to fetch leaderboard data from Firebase
async function fetchLeaderboardData() {
    try {
        const usersRef = db.collection('users');

        // Top 5 Highest Consecutive Days
        const consecutiveQuery = usersRef.orderBy('consecutiveDays', 'desc').limit(5);
        const consecutiveSnapshot = await consecutiveQuery.get();
        const consecutiveData = consecutiveSnapshot.docs.map(doc => doc.data());

        // Top 5 Most Active Days
        const activeQuery = usersRef.orderBy('totalActiveDays', 'desc').limit(5);
        const activeSnapshot = await activeQuery.get();
        const activeData = activeSnapshot.docs.map(doc => doc.data());

        // Current Longest Active Streak
        const streakQuery = usersRef.orderBy('consecutiveDays', 'desc').limit(1);
        const streakSnapshot = await streakQuery.get();
        const longestStreakData = streakSnapshot.docs[0]?.data() || null;

        // Total Users
        const totalSnapshot = await usersRef.get();
        const totalUserCount = totalSnapshot.size;

        // Update the DOM with the fetched data
        updateDashboard(consecutiveData, activeData, longestStreakData, totalUserCount);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
}

// Function to update the DOM with fetched data
function updateDashboard(topConsecutive, topActiveDays, longestStreak, totalUsers) {
    document.querySelector('.community-dashboard-title').textContent = 'Community Dashboard';
    
    // Total Users
    document.querySelector('.total-users').textContent = `Total Users: ${totalUsers}`;

    // Longest Streak
    const streakElement = document.querySelector('.longest-streak');
    if (longestStreak) {
        streakElement.textContent = `Current Longest Active Streak: ${longestStreak.username} - ${longestStreak.consecutiveDays} days`;
    }

    // Top 5 Consecutive Days
    const consecutiveList = document.querySelector('.top-consecutive-list');
    consecutiveList.innerHTML = '';
    topConsecutive.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.username}: ${user.consecutiveDays} days`;
        consecutiveList.appendChild(listItem);
    });

    // Top 5 Active Days
    const activeList = document.querySelector('.top-active-days-list');
    activeList.innerHTML = '';
    topActiveDays.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.username}: ${user.totalActiveDays} days`;
        activeList.appendChild(listItem);
    });
}

// Fetch leaderboard data when the page loads
document.addEventListener('DOMContentLoaded', fetchLeaderboardData);
