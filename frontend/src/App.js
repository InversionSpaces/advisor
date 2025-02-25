import React, { useState } from 'react';

import './App.css';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';


function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowLogin(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Advisor</h1>
      </header>
      <div>
        {showLogin ? <LoginForm /> : <RegistrationForm onSuccess={handleRegistrationSuccess} />}
        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
}

export default App;
