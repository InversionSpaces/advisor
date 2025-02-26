import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import Chat from './Chat';

const AboutMe = () => {
    const [aboutMe, setAboutMe] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showChat, setShowChat] = useState(false);

    // Check for existing user ID in localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            setShowChat(true);
            fetchUserData(storedUserId);
        }
    }, []);

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
                setShowChat(false);
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
                setShowChat(true);
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
        <div className="container">
            {showChat && userId && (
                <Chat userId={userId} />
            )}

            <h1>About Me</h1>

            <form onSubmit={handleSubmit} className="form-group">
                <label htmlFor="aboutMe">Tell us about yourself:</label>
                <textarea
                    id="aboutMe"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Share something about yourself..."
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