import { db } from "./firebaseConfig.js";

const CommunityDashboard = () => {
    const [topConsecutive, setTopConsecutive] = useState([]);
    const [topActiveDays, setTopActiveDays] = useState([]);
    const [longestStreak, setLongestStreak] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);

    // Fetch the leaderboard data from Firebase on component mount
    useEffect(() => {
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

                // Update state with fetched data
                setTopConsecutive(consecutiveData);
                setTopActiveDays(activeData);
                setLongestStreak(longestStreakData);
                setTotalUsers(totalUserCount);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        }

        fetchLeaderboardData();
    }, []);

    return (
        <div className="community-dashboard-container">
            <h1 className="community-dashboard-title">Community Dashboard</h1>

            <div className="community-card">
                <h2>Total Users: {totalUsers}</h2>
                {longestStreak && (
                    <p>Current Longest Active Streak: {longestStreak.username} - {longestStreak.consecutiveDays} days</p>
                )}
            </div>

            <div className="community-grid">
                <div className="community-card">
                    <h3>Top 5 Consecutive Days</h3>
                    <ul>
                        {topConsecutive.map((user, index) => (
                            <li key={index}>
                                {user.username}: {user.consecutiveDays} days
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="community-card">
                    <h3>Top 5 Active Days</h3>
                    <ul>
                        {topActiveDays.map((user, index) => (
                            <li key={index}>
                                {user.username}: {user.totalActiveDays} days
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CommunityDashboard;
