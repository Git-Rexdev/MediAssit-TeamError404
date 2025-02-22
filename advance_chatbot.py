import os
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv

env_path = find_dotenv(r"D:\Github\Techathon-Error404\.env")
if not load_dotenv(env_path):
    raise ValueError(f"Could not find .env file at {env_path}")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API key not found. Make sure you set it in the .env file or as an environment variable.")

genai.configure(api_key=api_key)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction=(
        "Tone should be soft and should only answer questions related to medical terminologies, "
        "home remedies, and basic medicines. It should also provide information about medicines available online "
        "and details about new diseases."
    ),
)

chat_session = model.start_chat(history=[])

user_input = input("Cure for common cold ")
response = chat_session.send_message(user_input)

print("\nChatbot:", response.text)
