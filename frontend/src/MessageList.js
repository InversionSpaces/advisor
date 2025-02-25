import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './MessageList.css';

import { BACKEND_URL } from './config';

function MessageList({ refreshTrigger }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Fetch messages from the API
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

            const response = await fetch(`${BACKEND_URL}/api/messages/?limit=10`, {
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
            // Reverse the messages array so newest messages appear at the bottom
            const reversedMessages = [...(data.messages || [])].reverse();
            setMessages(reversedMessages);
            setError(null);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError(err.message || 'An error occurred while fetching messages');
        } finally {
            setLoading(false);
        }
    };

    // Fetch messages on initial load and when refreshTrigger changes
    useEffect(() => {
        fetchMessages();
    }, [refreshTrigger]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="message-list">
            {loading && <p className="loading">Loading messages...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && messages.length === 0 && (
                <p className="no-messages">You don&apos;t have any messages yet.</p>
            )}

            {messages.length > 0 && (
                <ul className="messages">
                    {messages.map((message, index) => {
                        const messageClass = message.is_from_user
                            ? "message-item outgoing"
                            : "message-item incoming";

                        return (
                            <li key={message.id || index} className={messageClass}>
                                <div className="message-content">{message.content}</div>
                                <div className="message-time">
                                    Posted: {formatDate(message.posted_time)}
                                </div>
                            </li>
                        );
                    })}
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