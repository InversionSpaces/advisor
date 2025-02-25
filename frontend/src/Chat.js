import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BACKEND_URL } from './config';
import MessageList from './MessageList';
import './Chat.css';

function Chat() {
    const [newMessage, setNewMessage] = useState('');
    const [refreshMessages, setRefreshMessages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token is found
            navigate('/login');
        }
    }, [navigate]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token is found
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message: newMessage }),
            });

            // If unauthorized, redirect to login
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
                return;
            }

            if (response.ok) {
                // Clear the input and trigger a refresh of the message list
                setNewMessage('');
                setRefreshMessages(prev => prev + 1);
            } else {
                console.error('Error sending message:', await response.json());
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat</h2>

            <MessageList refreshTrigger={refreshMessages} />

            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message"
                    className="message-input"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
}

export default Chat; 