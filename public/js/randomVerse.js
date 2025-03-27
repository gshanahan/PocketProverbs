async function fetchDailyVerse() {
    const storedVerse = localStorage.getItem("dailyVerse");
    const storedDate = localStorage.getItem("verseDate");
    const today = new Date().toISOString().split("T")[0]; // Get current date as YYYY-MM-DD

    if (storedVerse && storedDate === today) {
        // Use stored verse if it was fetched today
        document.getElementById("dailyVerse").innerText = storedVerse;
    } else {
        try {
            const response = await fetch('https://bible-api.com/?random=1'); // Fetch a random verse
            const data = await response.json();

            if (data && data.text && data.reference) {
                const verseText = `"${data.text}" - ${data.reference}`;
                document.getElementById("dailyVerse").innerText = verseText;

                // Store verse and date in localStorage
                localStorage.setItem("dailyVerse", verseText);
                localStorage.setItem("verseDate", today);
            } else {
                document.getElementById("dailyVerse").innerText = "Could not fetch verse.";
            }
        } catch (error) {
            console.error("Error fetching verse:", error);
            document.getElementById("dailyVerse").innerText = "Error loading verse.";
        }
    }
}

// Fetch verse only if needed
fetchDailyVerse();

// Placeholder for analysis (Replace with AI if needed)
document.getElementById("generateAnalysis").addEventListener("click", function () {
    document.getElementById("verseAnalysis").value = "This verse emphasizes faith and reliance on God.";
});