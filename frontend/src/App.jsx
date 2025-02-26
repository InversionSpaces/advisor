import React from 'react';
import AboutMe from './components/AboutMe';

function App() {
    return (
        <div className="app">
            <header>
                <h1>Advisor App</h1>
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