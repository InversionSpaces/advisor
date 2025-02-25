import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

import './App.css';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Chat from './Chat';

function NavigationLinks() {
  const location = useLocation();
  return (
    <div className="nav-links">
      {location.pathname === '/login' && <Link to="/register">Register</Link>}
      {location.pathname === '/register' && <Link to="/login">Login</Link>}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Advisor</h1>
          <NavigationLinks />
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
