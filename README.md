# 🚀 **YouTube Summarizer - Installation, Usage & Challenges**

---

## ⚙️ **Installation**

### 🔹 **Set Up the Extension**
1. Open Chrome and navigate to `chrome://extensions/`.  
2. Enable **Developer Mode** (top right corner).  
3. Click on **"Load unpacked"**.  
4. Select the project folder to install the extension.  

### 🔹 **Backend Setup**
1. Install required Python libraries:  
```bash
pip install youtube-transcript-api
```
# ⚙️ **How It Works**

---

## 🛠️ **Transcript Extraction**
- The extension uses the `youtube-transcript-api` to fetch the transcript of the YouTube video.  
- If captions are disabled, the extension cannot generate a summary.  

---

## 🔥 **AI-Powered Summarization**
- The transcript is sent to **Gemini AI** via API calls.  
- Gemini processes the content and generates a concise summary.  

---

## 🤖 **Chatbot Functionality**
- Users can ask questions related to the video content.  
- The AI responds based on the summarized information.  

---

## 🔥 **Persistent Chat History**
- The chat history is preserved as users switch between videos.  
- When they revisit, previous conversations remain intact.  

---

## 🚀 **Usage**

### **Open a YouTube Video:**  
- Click on the extension icon.  
- The extension automatically fetches the video transcript.  

### **Generate Summary:**  
- The extension displays the summarized content.  
- Supports **multiple languages** (if captions are available).  

### **Chat with AI:**  
- Use the chatbot to ask questions related to the video.  
- Get **relevant and accurate** answers instantly.  

### **Persistent Chat History:**  
- Switch between different videos while maintaining your chat history.  

---

## 🔥 **Challenges Faced**

### 🔹 **Transcript Fetching**
- Initially, fetching transcripts was challenging.  
- Solved it using the `youtube-transcript-api` library.  

### 🔹 **Multi-Language Support**
- Supporting multiple languages was difficult due to varying transcript availability.  
- Fixed it by refining the Python code.  

### 🔹 **Real-Time Performance**
- Optimized the extension for **faster and more accurate** real-time processing.  

---

## 🚀 **Future Enhancements**

✅ **Improved Language Support:**  
- Add more language models for better multilingual performance.  

✅ **Enhanced UI/UX:**  
- Refine the user interface for a more seamless experience.  

✅ **Offline Mode:**  
- Enable the summarizer to work offline by caching transcripts.  

✅ **API Rate Limiting:**  
- Implement handling for **API rate limits** and errors.  

---

## 👥 **Contributors**

💡 **Team Members:**  
- **Prathik Balaji**  
- **Pavin S**  
- **Rohith T M**  
- **Prasath**  

