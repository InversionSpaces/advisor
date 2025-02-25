import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessageList.css';

import { BACKEND_URL } from './config';

function MessageList() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
    }, [limit]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to view messages');
                setLoading(false);
                navigate('/login');
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/messages/?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setError('Your session has expired. Please log in again.');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            const data = await response.json();
            setMessages(data.messages || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError(err.message || 'An error occurred while fetching messages');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const loadMore = () => {
        setLimit(prevLimit => prevLimit + 10);
    };

    return (
        <div className="message-list">
            <h2>Your Messages</h2>

            {loading && <p>Loading messages...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && messages.length === 0 && (
                <p>You dont have any messages yet.</p>
            )}

            {messages.length > 0 && (
                <div>
                    <ul className="messages">
                        {messages.map((message, index) => (
                            <li key={index} className="message-item">
                                <div className="message-content">{message.content}</div>
                                <div className="message-time">
                                    Posted: {formatDate(message.posted_time)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button onClick={loadMore} className="load-more-btn">
                        Load More
                    </button>
                </div>
            )}

            <button onClick={fetchMessages} className="refresh-btn">
                Refresh
            </button>
        </div>
    );
}

export default MessageList; 