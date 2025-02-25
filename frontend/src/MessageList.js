import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './MessageList.css';

import { BACKEND_URL } from './config';

function MessageList({ refreshTrigger }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 20; // Number of messages per page
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const observer = useRef();

    // Function to fetch messages with pagination
    const fetchMessages = async (pageNum = 1, append = false) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to view messages');
                setLoading(false);
                navigate('/login');
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/messages/?page=${pageNum}&page_size=${pageSize}`, {
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
            const newMessages = data.messages || [];

            // Check if we've reached the end of available messages
            if (newMessages.length < pageSize) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            // Either append new messages or replace existing ones
            if (append) {
                setMessages(prevMessages => [...prevMessages, ...newMessages]);
            } else {
                setMessages(newMessages);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError(err.message || 'An error occurred while fetching messages');
        } finally {
            setLoading(false);
        }
    };

    // Initial load and refresh
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchMessages(1, false);
    }, [refreshTrigger]);

    // Load more messages when page changes
    useEffect(() => {
        if (page > 1) {
            fetchMessages(page, true);
        }
    }, [page]);

    // Setup intersection observer for infinite scrolling
    const lastMessageRef = useCallback(node => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Scroll to bottom when messages change (only for initial load)
    useEffect(() => {
        if (page === 1 && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, page]);

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
            <h2>Your Messages</h2>

            {error && <p className="error">{error}</p>}

            {!loading && !error && messages.length === 0 && (
                <p>You don&apos;t have any messages yet.</p>
            )}

            {messages.length > 0 && (
                <div>
                    <ul className="messages">
                        {messages.map((message, index) => {
                            // Apply ref to last message for infinite scrolling
                            const messageClass = message.is_from_user ? 'message-item outgoing' : 'message-item incoming';

                            if (index === messages.length - 1) {
                                return (
                                    <li
                                        ref={lastMessageRef}
                                        key={index}
                                        className={messageClass}
                                    >
                                        <div className="message-content">{message.content}</div>
                                        <div className="message-time">
                                            Posted: {formatDate(message.posted_time)}
                                        </div>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={index} className={messageClass}>
                                        <div className="message-content">{message.content}</div>
                                        <div className="message-time">
                                            Posted: {formatDate(message.posted_time)}
                                        </div>
                                    </li>
                                );
                            }
                        })}
                        <div ref={messagesEndRef} />
                    </ul>

                    {loading && <p className="loading-more">Loading more messages...</p>}
                </div>
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