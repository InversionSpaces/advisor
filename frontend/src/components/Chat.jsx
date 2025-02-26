import React, { useState, useEffect, useRef } from 'react';
import { userApi } from '../services/api';

const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Fetch messages on component mount and when userId changes
    useEffect(() => {
        if (userId) {
            fetchMessages();
        }
    }, [userId]);

    // Scroll to bottom of messages when messages change
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const data = await userApi.getMessages(userId);
            setMessages(data.messages || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || isLoading) {
            return;
        }

        try {
            setIsLoading(true);

            // Send message to backend (which will also generate and save AI response)
            const updatedMessages = await userApi.addMessage(userId, newMessage);

            // Update local state with all messages (including the new AI response)
            setMessages(updatedMessages.messages || []);
            setNewMessage('');
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to send message:', error);
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        // Scroll only the messages container, not the entire page
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-section">
            <h2>Chat with advisor</h2>

            <div className="messages-container" ref={messagesContainerRef}>
                {messages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`message ${message.origin === 'ai' ? 'ai-message' : 'user-message'}`}>
                            <div className="message-text">{message.text}</div>
                            <div className="message-time">{formatDate(message.created_at)}</div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isLoading ? "Processing..." : "Type a message..."}
                    disabled={isLoading}
                    maxLength={200}
                />
                <button type="submit" disabled={isLoading || !newMessage.trim()}>
                    {isLoading ? 'Processing...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default Chat; 