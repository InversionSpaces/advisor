import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './MessageList.css';

import { BACKEND_URL } from './config';

function MessageList({ refreshTrigger }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10); // Initial limit of messages to fetch
    const [hasMore, setHasMore] = useState(true); // Indicator if there might be more messages
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Function to fetch messages from the backend
    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get the authentication token from local storage
            const token = localStorage.getItem('token');

            if (!token) {
                // No token found, redirect to login
                navigate('/login');
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/messages/?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized, redirect to login
                    localStorage.removeItem('token'); // Clear invalid token
                    localStorage.removeItem('refreshToken'); // Also clear the refresh token
                    navigate('/login');
                    return;
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const messages = data.messages?.reverse() || [];
            // Update state with the messages array
            setMessages(messages);

            // If we receive fewer messages than requested, we've reached the end
            setHasMore(messages.length >= limit);
        } catch (err) {
            setError(`Failed to fetch messages: ${err.message}`);
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load messages when component mounts or when refreshTrigger changes
    useEffect(() => {
        fetchMessages();
    }, [refreshTrigger, limit]);

    // Scroll to bottom of message list when new messages are loaded
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Function to load previous messages
    const loadPreviousMessages = () => {
        setLimit(prevLimit => prevLimit + 10); // Increase limit by 10
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';

        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="message-list">
            {loading && messages.length === 0 && <p className="loading">Loading messages...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && messages.length === 0 && (
                <p className="no-messages">You don&apos;t have any messages yet.</p>
            )}
            {messages.length > 0 && (
                <ul className="messages">
                    {hasMore && (
                        <li className="load-more-container">
                            <button
                                className="load-more-button"
                                onClick={loadPreviousMessages}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More Messages'}
                            </button>
                        </li>
                    )}
                    {messages.map((message) => (
                        <li key={message.message_id} className="message-item">
                            <div className="message-content">{message.content}</div>
                            <div className="message-time">Posted: {formatDate(message.posted_time)}</div>
                        </li>
                    ))}
                    <div ref={messagesEndRef} />
                </ul>
            )}
        </div>
    );
}

export default MessageList;

// PropTypes validation
MessageList.propTypes = {
    refreshTrigger: PropTypes.number
};

// Default props
MessageList.defaultProps = {
    refreshTrigger: 0
}; 