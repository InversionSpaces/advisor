"""
AI Service for generating responses to user messages.
This is a stub implementation that can be replaced with a real AI API later.
"""
import random
import asyncio
from datetime import datetime

# Sample responses for the stub AI
SAMPLE_RESPONSES = [
    "That's an interesting point. Could you tell me more about it?",
    "I understand your perspective. Have you considered looking at it from another angle?",
    "Thanks for sharing that with me. I'm here to help if you have any questions.",
    "I appreciate your message. Is there anything specific you'd like to discuss further?",
    "That's valuable information. Let me know if you need any assistance with this topic.",
    "I see what you mean. Would you like me to provide more information about this?",
    "Thank you for your input. How can I best support you with this?",
    "I'm processing what you've shared. Is there a particular aspect you'd like me to focus on?",
    "Your message gives me a good understanding of the situation. What would you like to know next?",
    "I'm here to assist with this. Would you like some suggestions or recommendations?"
]

async def generate_response(user_message: str) -> dict:
    """
    Generate an AI response to a user message.
    This is a stub implementation that returns a random response after a delay.
    
    Args:
        user_message: The message from the user
        
    Returns:
        A dict containing the AI response text and metadata
    """
    # Simulate API call delay (1-3 seconds)
    await asyncio.sleep(1 + random.random() * 2)
    
    # For now, just return a random response from the sample list
    response_text = random.choice(SAMPLE_RESPONSES)
    
    return {
        "text": response_text,
        "origin": "ai",
        "created_at": datetime.utcnow().isoformat()
    } 