async function fetchDailyVerse() {
    const storedVerse = localStorage.getItem("dailyVerse");
    const storedAnalysis = localStorage.getItem("verseAnalysis");
    const storedDate = localStorage.getItem("verseDate");
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

    // Typing effect function
    function typeOutText(element, text, speed = 50) {
        let index = 0;
        element.innerText = ""; // Clear existing text

        function typeChar() {
            if (index < text.length) {
                element.innerText += text[index];
                index++;
                setTimeout(typeChar, speed);
            }
        }

        typeChar();
    }

    // Check if stored data exists and if the stored date matches today's date
    if (storedVerse && storedAnalysis && storedDate === today) {
        // Use stored verse and analysis if available
        document.getElementById("dailyVerse").innerText = storedVerse;
        document.getElementById("verseAnalysis").innerText = storedAnalysis;
    } else {
        try {
            const response = await fetch('https://bible-api.com/?random=1'); // Fetch a random verse
            const data = await response.json();

            if (data && data.text && data.reference) {
                const verseText = `${data.text} - ${data.reference}`;
                document.getElementById("dailyVerse").innerText = verseText;

                let analysis = "";
                // Generate AI-based analysis
                try {
                    console.log("Calling fetchVerseAnalysis");
                    analysis = await fetchVerseAnalysis(verseText);
                    console.log("Fetch complete");
                } catch (error) {
                    console.error("Error calling fetchVerseAnalysis:", error);
                }

                // Store in localStorage
                localStorage.setItem("dailyVerse", verseText);
                localStorage.setItem("verseAnalysis", analysis);
                localStorage.setItem("verseDate", today);

                // Display analysis with typing effect
                const analysisElement = document.getElementById('verseAnalysis');
                typeOutText(analysisElement, analysis, 50); // Adjust speed as needed
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
        console.log("Fetching AI analysis for:", verse);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer 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` // Replace with your API key
            },
            body: JSON.stringify({
                model: "gpt-4-turbo", // or use "gpt-4" if available
                messages: [
                    { role: "system", content: "You are a biblical historian assistant that provides concise and informative analysis." },
                    { role: "user", content: `Analyze, give historical context, or provide some insight for this Bible verse in 75 words or less: ${verse}` }
                ],
                max_tokens: 150,   // Adjust to control the response length
                temperature: 0.7,  // Adjust the creativity level (lower is more deterministic)
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("GPT Response:", data);
        const botMessage = data.choices[0].message.content;

        return botMessage;

    } catch (error) {
        console.error("Error fetching AI analysis:", error);
        return "Analysis not available.";
    }
}



// Fetch the daily verse when the page loads
fetchDailyVerse();