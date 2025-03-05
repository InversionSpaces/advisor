"""
AI Service for generating responses to user messages.
"""
import asyncio
from datetime import datetime, timezone
from openai import OpenAI

# Define the AI model to use
MODEL_NAME = "gpt-4o-mini"

async def generate_response(user_message: str) -> dict:
    """
    Generate an AI response to a user message.

    Args:
        user_message: The message from the user

    Returns:
        A dict containing the AI response text and metadata
    """
    
    client = OpenAI()

    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a helpful educational and career advisor."},
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    response_text = completion.choices[0].message.content

    return {"text": response_text, "origin": "ai", "created_at": datetime.now(timezone.utc).isoformat()}
