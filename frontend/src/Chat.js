import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BACKEND_URL } from './config';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token is found
            navigate('/login');
            return;
        }

        // const fetchMessages = async () => {
        //     try {
        //         const response = await fetch(`${BACKEND_URL}/api/messages/`, {
        //             headers: {
        //                 'Authorization': `Bearer ${token}`,
        //             },
        //         });

        //         // If unauthorized, redirect to login
        //         if (response.status === 401) {
        //             localStorage.removeItem('token');
        //             localStorage.removeItem('refreshToken');
        //             navigate('/login');
        //             return;
        //         }

        //         const data = await response.json();
        //         setMessages(data.messages);
        //     } catch (error) {
        //         console.error('Error fetching messages:', error);
        //     }
        // };

        // fetchMessages();
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

            const data = await response.json();
            if (response.ok) {
                setMessages([...messages, data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default Chat; 