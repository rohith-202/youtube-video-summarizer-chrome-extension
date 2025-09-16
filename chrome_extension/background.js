chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchTranscript") {
        console.log("Received request in background.js");

        fetch(`http://127.0.0.1:5000/transcript/${encodeURIComponent(request.videoUrl)}`)
            .then(response => response.json())
            .then(data => {
                sendResponse({ transcript: data.transcript });
            })
            .catch(error => {
                console.error("Error fetching transcript:", error);
                sendResponse({ error: "Failed to fetch transcript" });
            });

        return true; 
    }
});
