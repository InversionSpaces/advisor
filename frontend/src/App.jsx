import React, { useState } from 'react';
import AboutMe from './components/AboutMe';
import Chat from './components/Chat';

const FEEDBACK_FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL;

function App() {
    const [userId, setUserId] = useState('');
    const [showChat, setShowChat] = useState(false);

    // Handle user ID changes from AboutMe component
    const handleUserIdChange = (id) => {
        setUserId(id);
    };

    // Handle show chat changes from AboutMe component
    const handleShowChatChange = (show) => {
        setShowChat(show);
    };

    return (
        <div className="app">
            <header>
                <h1>Advisor App</h1>
                <p className="app-description">
                    Your personalized AI-powered educational and career advisor.
                </p>
            </header>
            <main>
                <div className="container">
                    {!userId && (
                        <div className="usage-instructions">
                            <h2>How to use the app:</h2>
                            <ol>
                                <li>Describe yourself, your background, and interests in the form below</li>
                                <li>Once saved, you can start chatting with your AI advisor for personalized guidance</li>
                            </ol>
                        </div>
                    )}
                    <div className="content-wrapper">
                        {showChat && userId && (
                            <div className="chat-and-feedback">
                                <Chat userId={userId} />
                                {FEEDBACK_FORM_URL && (
                                    <button
                                        onClick={() => window.open(FEEDBACK_FORM_URL, '_blank')}
                                        className="feedback-button"
                                    >
                                        Give Feedback
                                    </button>
                                )}
                            </div>
                        )}

                        <AboutMe
                            onUserIdChange={handleUserIdChange}
                            onShowChatChange={handleShowChatChange}
                        />
                    </div>
                </div>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Advisor App</p>
            </footer>
        </div>
    );
}

export default App; 