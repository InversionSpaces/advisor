import React from 'react';
import AboutMe from './components/AboutMe';

function App() {
    return (
        <div className="app">
            <header>
                <h1>Advisor App</h1>
                <p className="app-description">
                    Your personal space to share and save information about yourself.
                </p>
            </header>
            <main>
                <AboutMe />
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Advisor App</p>
            </footer>
        </div>
    );
}

export default App; 