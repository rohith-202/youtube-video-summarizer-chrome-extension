from flask import Flask, jsonify, request
from flask_cors import CORS  
from get_transcript import get_transcript
import re
import google.generativeai as genai  

app = Flask(__name__)
CORS(app)  

GEMINI_API_KEY = "" 
genai.configure(api_key=GEMINI_API_KEY)

def extract_video_id(url):
    """Extract the YouTube video ID from a URL"""
    match = re.search(r"(?:v=|\/(?:embed|shorts|v)\/|youtu\.be\/)([a-zA-Z0-9_-]{11})", url)
    if match:
        return match.group(1)
    else:
        print(f"[ERROR] Invalid YouTube URL: {url}")  
        return None

def summarize_transcript(transcript):
    """Summarize the transcript using Gemini AI"""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash-latest")  
        response = model.generate_content(f"Summarize this transcript in detailed way:\n{transcript}")
        summary = response.text.strip()
        print("[DEBUG] AI Summary Generated Successfully!")  
        return summary
    except Exception as e:
        print(f"[ERROR] Failed to summarize transcript: {e}")
        return "Failed to generate summary."

transcript_cache = {}

@app.route("/transcript/<path:video_url>")
def transcript(video_url):
    video_id = extract_video_id(video_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        transcript_text = get_transcript(video_id)
        if not transcript_text:
            raise ValueError("Transcript not available")

        print("[DEBUG] Full Transcript Retrieved!{transcript_text}")
        
        summary_text = summarize_transcript(transcript_text) 
        transcript_cache["latest_transcript"] = transcript_text  # Store latest transcript
        
        return jsonify({"transcript": transcript_text, "summary": summary_text})

    except Exception as e:
        print(f"[ERROR] Failed to fetch transcript for {video_id}: {str(e)}")  
        return jsonify({"error": "Failed to fetch transcript"}), 500

@app.route("/chat", methods=["POST"])
def chat_with_gemini():
    data = request.get_json()
    user_question = data.get("question", "")
    chat_history = data.get("chatHistory2", [])  
    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    transcript_text = transcript_cache.get("latest_transcript", "")
    chat_context = (
    f"Here is a transcript of a video:\n{transcript_text}\n\n"
    f"Here are previous chats:\n{chat_history}\n\n" 
    f"If the user asks something from the previous chat, use that chat to respond.\n"
    f"Now answer the following question only in English. "
    f"You should answer only if the content is related to the transcript:\n{user_question}"
) if transcript_text else user_question

    try:
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        response = model.generate_content(chat_context)
        answer = response.text.strip() if hasattr(response, "text") else "Sorry, I couldn't generate a response."
        return jsonify({"answer": answer})

    except Exception as e:
        print(f"[ERROR] Chat error: {e}")
        return jsonify({"error": "Failed to process request"}), 500

if __name__ == "__main__":
    app.run(debug=True)
