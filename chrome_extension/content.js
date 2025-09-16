function addTranscriptButton() {
    if (document.getElementById("fetchTranscriptBtn")) return;

    let container = document.querySelector(".ytp-left-controls");
    if (!container) return;

    let button = document.createElement("button");
    button.innerHTML = `<img src="${chrome.runtime.getURL("ButtonIcon.png")}" alt="Send" >`;
    button.id = "fetchTranscriptBtn";
    button.title = "Summarize this video using AI";

    container.appendChild(button);

    button.addEventListener("click", async () => {
      

        let videoUrl = window.location.href;
        let loadingPopup = document.createElement("div");
        loadingPopup.id = "loadingPopup";
        loadingPopup.innerText = "Summarizing... Please wait.";
        loadingPopup.style.position = "fixed";
        loadingPopup.style.top = "8%";
        loadingPopup.style.left = "50%";
        loadingPopup.style.transform = "translate(-50%, -50%)";
        loadingPopup.style.padding = "20px";
        loadingPopup.style.backgroundColor = "aliceblue";
        loadingPopup.style.color = "black";
        loadingPopup.style.borderRadius = "20px";
        loadingPopup.style.fontSize = "1.5rem";
        loadingPopup.style.zIndex = "9999";
        document.body.appendChild(loadingPopup);

        try {
            let response = await fetch(`http://127.0.0.1:5000/transcript/${encodeURIComponent(videoUrl)}`);
            let data = await response.json();

            document.body.removeChild(loadingPopup);

            if (response.ok) {
                let summaryText = data.summary || "Summary not available";
                showSummaryModal(summaryText);
            } else {
                alert("Error fetching AI Summary: " + data.error);
            }
        } catch (error) {
            document.body.removeChild(loadingPopup);
            console.error("Error fetching AI Summary:", error);
            alert("Failed to fetch AI Summary.");
        }
    });
}

function getVideoId() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v"); // Extracts the YouTube video ID from the URL
}

function saveChatHistory(videoId, chatHistory) {
    localStorage.setItem(`chatHistory_${videoId}`, JSON.stringify(chatHistory));
}

function loadChatHistory(videoId) {
    let history = localStorage.getItem(`chatHistory_${videoId}`);
    return history ? JSON.parse(history) : [];
}

function clearChatHistory(videoId) {
    localStorage.removeItem(`chatHistory_${videoId}`);
    let chatContainer = document.getElementById("chatContainer");
    chatContainer.innerHTML = `<div id="initialMessage" style="color: gray; font-style: italic; font-size: 16px;">Do you have any queries?</div>`;
}

function showSummaryModal(summary) {
    if (document.getElementById("summaryModal")) return;

    let videoId = getVideoId();
    let modal = document.createElement("div");
    modal.id = "summaryModal";

    let navbar = document.createElement("div");
    navbar.id = "summaryNavbar";

    let title = document.createElement("span");
    title.innerText = "SummarIQ";
    title.style.flex = "1";
    title.style.textAlign = "center";

    let closeButton = document.createElement("button");
    closeButton.id = "closeNavbarBtn";
    closeButton.innerHTML = "&times;";
    closeButton.style.fontSize = "4rem";
    closeButton.style.background = "transparent";
    closeButton.style.color = "white";
    closeButton.style.cursor = "pointer";
    closeButton.style.position = "absolute";
    closeButton.style.borderRadius = "50%";
    closeButton.style.right = "10px";
    closeButton.onclick = () => modal.remove();

    navbar.style.position = "sticky";
    navbar.style.top = "0";
    navbar.style.background = "black";
    navbar.style.color = "white";
    navbar.style.padding = "10px";
    navbar.style.display = "flex";
    navbar.style.height = "40px";
    navbar.style.alignItems = "center";
    navbar.style.justifyContent = "center";
    navbar.style.fontSize = "2rem";
    navbar.style.zIndex = "1000";

    navbar.appendChild(title);
    navbar.appendChild(closeButton);

    let summaryDiv = document.createElement("div");
    summaryDiv.innerHTML = `<h2>Summary</h2><ul>${summary
        .split(". ")
        .map(point => `<li>${point}</li>`)
        .join("")}</ul>`;

    let chatbox = document.createElement("div");
    chatbox.id = "chatbox";
    chatbox.innerHTML = `
   <div id="Chatboxheading" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
    <h3 style="margin: 0;">Ask AI</h3>
    <button id="clearChat">Clear Chat</button>
</div>
    
    <div id="chatContainer">
        <div id="initialMessage" style="color: gray; font-style: italic; font-size: 16px;">Do you have any queries?</div>
    </div>
    <div id="chatInputContainer">
        <textarea id="chatInput" placeholder="Ask about the video..." rows="1"></textarea>
        <button id="sendChat">➤</button>
        
    </div>
`;

    modal.appendChild(navbar);
    modal.appendChild(summaryDiv);
    modal.appendChild(chatbox);
    document.body.appendChild(modal);

    let chatContainer = document.getElementById("chatContainer");
    let chatHistory = loadChatHistory(videoId);
    chatHistory.forEach(entry => {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(entry.sender === "AI" ? "ai-message" : "user-message");
        messageDiv.innerHTML = `<strong>${entry.sender}:</strong> ${entry.message}`;
        chatContainer.appendChild(messageDiv);
    });

    chatbox.querySelector("#sendChat").addEventListener("click", sendChatMessage);
    chatbox.querySelector("#clearChat").addEventListener("click", () => clearChatHistory(videoId));
    chatbox.querySelector("#chatInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendChatMessage();
        }
    });
}

async function sendChatMessage() {
    let videoId = getVideoId();
    let question = document.getElementById("chatInput").value;
    if (!question.trim()) return;

    let chatContainer = document.getElementById("chatContainer");

    let initialMessage = document.getElementById("initialMessage");
    if (initialMessage) {
        initialMessage.remove();
    }

    let userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerHTML = `<strong>You:</strong> ${question}`;
    chatContainer.appendChild(userMessage);

    document.getElementById("chatInput").value = "";

    let typingIndicator = document.createElement("div");
    typingIndicator.id = "typingIndicator";
    typingIndicator.innerHTML = `<em>AI is typing...</em>`;
    typingIndicator.style.color = "gray";
    typingIndicator.style.fontStyle = "italic";
    typingIndicator.style.fontSize = "16px";
    typingIndicator.style.fontWeight = "bold";
    typingIndicator.style.margin = "5px 0";
    typingIndicator.style.textAlign = "left";
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        let chatHistory2 = loadChatHistory(videoId);
        let response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question,chatHistory2 })
        });

        let data = await response.json();
        let answer = data.answer || "No response available.";

        typingIndicator.remove();

        let aiMessage = document.createElement("div");
        aiMessage.classList.add("ai-message");
        aiMessage.innerHTML = `<strong>AI:</strong><br><br>${answer.replace(/\.\s+/g, ".<br><br>")}`;
        chatContainer.appendChild(aiMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        let chatHistory = loadChatHistory(videoId);
        chatHistory.push({ sender: "You", message: question });
        chatHistory.push({ sender: "AI", message: answer });
        saveChatHistory(videoId, chatHistory);
    } catch (error) {
        typingIndicator.remove();
        let errorMessage = document.createElement("div");
        errorMessage.innerHTML = `<strong>AI:</strong> Failed to fetch response.`;
        errorMessage.style.color = "red";
        chatContainer.appendChild(errorMessage);
    }
}

const observer = new MutationObserver(() => {
    addTranscriptButton();
});

observer.observe(document.body, { childList: true, subtree: true });
