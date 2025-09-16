import google.generativeai as genai

# Replace with your actual Gemini API key
GEMINI_API_KEY = "AIzaSyBwEXL2j7ee9i4JLZcRNfln2nQQGVVJRBI"

genai.configure(api_key=GEMINI_API_KEY)

# List available models
try:
    models = genai.list_models()
    print("Available Gemini Models:")
    for model in models:
        print(model.name)
except Exception as e:
    print(f"Error: {e}")
