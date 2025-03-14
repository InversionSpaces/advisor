import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// User API functions
export const userApi = {
    // Create a new user
    createUser: async (aboutMe) => {
        try {
            const response = await api.post('/api/users', { about_me: aboutMe });
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    // Get user by ID
    getUser: async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    },

    // Update user's about_me
    updateUser: async (userId, aboutMe) => {
        try {
            const response = await api.put(`/api/users/${userId}`, { about_me: aboutMe });
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Get user's messages
    getMessages: async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}/messages`);
            return response.data;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    },

    // Add a new message
    addMessage: async (userId, messageText) => {
        try {
            const response = await api.post(`/api/users/${userId}/messages`, {
                text: messageText
            });
            return response.data;
        } catch (error) {
            console.error('Error adding message:', error);
            throw error;
        }
    }
};

export default api; 