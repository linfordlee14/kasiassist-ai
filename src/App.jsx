import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
      setCurrentPage('app');
    }
  }, []);

  const handleGetStarted = () => {
    setCurrentPage('auth');
  };

  const handleLogin = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    setCurrentPage('auth');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
      {currentPage === 'auth' && <AuthPage onLogin={handleLogin} />}
      {currentPage === 'app' && <MainApp userName={userName} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
