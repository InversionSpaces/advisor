"""
AI Service for generating responses to user messages.
"""
from datetime import datetime, timezone
from openai import OpenAI

# Define the AI model to use
MODEL_NAME = "gpt-4o-mini"

# System prompt
SYSTEM_PROMPT = """You are a highly knowledgeable educational assistant specializing in designing personalized learning plans. When a user expresses a learning goal (e.g., "learn Python programming to build chatbots" or "become a data scientist"), analyze their background and objectives to create a clear, actionable, and step-by-step roadmap. Your response should include:

• Specific, measurable milestones and deadlines
• Recommended courses, tutorials, and resource links
• Practical exercises and project suggestions
• A structured timeline with clear, prioritized action steps

Maintain a supportive, encouraging, and concise tone. Structure your output using bullet points and subheadings to ensure clarity, and always tailor your recommendations to align with the user's unique context and skill level. Ask clarifying questions to gather more information if needed."""

def origin_to_ai_role(origin: str) -> str:
    """
    Convert a database origin to an AI role.

    Args:
        origin (str): The origin of the message

    Returns:
        The AI role for the message
    """
    
    if origin == "user":
        return "user"
    elif origin == "ai":
        return "assistant"
    else:
        raise ValueError(f"Unknown origin: {origin}")
    

async def generate_response(user_aboutme: str, chat_history: list[str]) -> dict:
    """
    Generate an AI response to a user message.

    Args:
        user_aboutme (str): The user's about_me text
        chat_history (list[str]): A list of chat messages

    Returns:
        A dict containing the AI response text and metadata
    """
    
    client = OpenAI()

    messages = [
        {"role": "developer", "content": [{"type": "text", "text": SYSTEM_PROMPT}]},
        {"role": "user", "content": [{"type": "text", "text": f"About me: {user_aboutme}"}]}
    ]
    for message in chat_history:
        role = origin_to_ai_role(message["origin"])
        messages.append({"role": role, "content": [{ "type": "text", "text": message['text'] }]})

    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=0.7
    )

    response_text = completion.choices[0].message.content.strip()

    return {"text": response_text, "origin": "ai", "created_at": datetime.now(timezone.utc).isoformat()}
