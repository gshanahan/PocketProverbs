async function fetchDailyVerse() {
    const storedVerse = localStorage.getItem("dailyVerse");
    const storedAnalysis = localStorage.getItem("verseAnalysis");
    const storedDate = localStorage.getItem("verseDate");
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD

    if (storedVerse && storedAnalysis && storedDate === today) {
        // Use stored verse and analysis if available
        document.getElementById("dailyVerse").innerText = storedVerse;
        document.getElementById("verseAnalysis").value = storedAnalysis;
    } else {
        try {
            const response = await fetch('https://bible-api.com/?random=1'); // Fetch a random verse
            const data = await response.json();

            if (data && data.text && data.reference) {
                const verseText = `"${data.text}" - ${data.reference}`;
                document.getElementById("dailyVerse").innerText = verseText;

                // Generate AI-based analysis
                const analysis = await fetchVerseAnalysis(verseText);

                // Store in localStorage
                localStorage.setItem("dailyVerse", verseText);
                localStorage.setItem("verseAnalysis", analysis);
                localStorage.setItem("verseDate", today);

                // Display analysis
                document.getElementById("verseAnalysis").value = analysis;
            } else {
                document.getElementById("dailyVerse").innerText = "Could not fetch verse.";
            }
        } catch (error) {
            console.error("Error fetching verse:", error);
            document.getElementById("dailyVerse").innerText = "Error loading verse.";
        }
    }
}

async function fetchVerseAnalysis(verse) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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` // Replace with your API key
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `Provide a short biblical analysis for this verse:\n\n${verse}`,
                max_tokens: 100
            })
        });

        const data = await response.json();
        console.log("AI Response:", data); //debug code
        return data.choices[0].text.trim();
    } catch (error) {
        console.error("Error fetching AI analysis:", error);
        return "Analysis not available.";
    }
}

// Fetch the daily verse when the page loads
fetchDailyVerse();