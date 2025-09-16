from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import json

def get_transcript(video_id):
    try:
        # Get the list of available transcripts
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Prioritize specific languages
        language_codes = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'gu', 'mr', 'bn', 'pa']  # Add more as needed

        transcript = None

        # Try to fetch transcripts in preferred languages
        for lang in language_codes:
            try:
                transcript = transcript_list.find_transcript([lang])
                break
            except NoTranscriptFound:
                continue

        # Fallback to auto-generated transcript if no manual transcript is available
        if not transcript:
            try:
                transcript = transcript_list.find_generated_transcript(language_codes)
            except NoTranscriptFound:
                return {"error": "No auto-generated transcript found"}

        # Extracting and formatting transcript
        transcript_data = transcript.fetch()

       

        return transcript_data

    except TranscriptsDisabled:
        return {"error": "Transcripts are disabled for this video"}
    except NoTranscriptFound:
        return {"error": "No transcript found"}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import sys
    video_id = sys.argv[1]
    result = get_transcript(video_id)
    print(json.dumps(result))
