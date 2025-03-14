import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';

const AboutMe = ({ onUserIdChange, onShowChatChange }) => {
    const [aboutMe, setAboutMe] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Check for existing user ID in localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            onUserIdChange(storedUserId);
            onShowChatChange(true);
            fetchUserData(storedUserId);
        }
    }, [onUserIdChange, onShowChatChange]);

    // Fetch user data if we have a userId
    const fetchUserData = async (id) => {
        try {
            setIsLoading(true);
            const userData = await userApi.getUser(id);
            setAboutMe(userData.about_me);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setIsLoading(false);
            // If user not found, clear localStorage
            if (error.response && error.response.status === 404) {
                localStorage.removeItem('userId');
                setUserId('');
                onUserIdChange('');
                onShowChatChange(false);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!aboutMe.trim()) {
            setMessage('Please enter some text about yourself.');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            let response;

            if (userId) {
                // Update existing user
                response = await userApi.updateUser(userId, aboutMe);
                setMessage('Your information has been updated!');
            } else {
                // Create new user
                response = await userApi.createUser(aboutMe);
                // Save the user ID to localStorage
                localStorage.setItem('userId', response.id);
                setUserId(response.id);
                onUserIdChange(response.id);
                onShowChatChange(true);
                setMessage('Your information has been saved!');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            setMessage('An error occurred. Please try again.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="about-me-section">
            <h2>About me:</h2>

            <form onSubmit={handleSubmit} className="form-group">
                <textarea
                    id="aboutMe"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Share your background, interests, and goals..."
                    disabled={isLoading}
                    maxLength={500}
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : userId ? 'Update' : 'Save'}
                </button>
            </form>

            {message && (
                <div className={isError ? 'error' : 'success-message'}>
                    {message}
                </div>
            )}

            {userId && (
                <div className="user-id">
                    <small>User ID: {userId}</small>
                </div>
            )}
        </div>
    );
};

export default AboutMe; 