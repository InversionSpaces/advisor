import React, { useState } from 'react';
import AboutMe from './components/AboutMe';
import Chat from './components/Chat';

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
                    Your personal space to share and save information about yourself.
                </p>
            </header>
            <main>
                <div className="container">
                    <div className="content-wrapper">
                        {showChat && userId && (
                            <Chat userId={userId} />
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