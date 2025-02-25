import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { BACKEND_URL } from './config';


function App() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/greet/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button onClick={handleSubmit}>Greet</button>
        <p>{response}</p>
        <RegistrationForm />
        <LoginForm />
      </header>
    </div>
  );
}

export default App;
