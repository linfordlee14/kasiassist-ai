import React, { useState } from 'react';

const AuthPage = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    } else {
      alert('Please enter your name.');
    }
  };

  return (
    <section id="login-screen" className="view">
      <div className="login-container">
        <h2>Welcome!</h2>
        <p>What should we call you?</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name" 
            autoFocus
          />
          <button type="submit" className="primary-btn">Continue</button>
        </form>
      </div>
    </section>
  );
};

export default AuthPage;
