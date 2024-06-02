import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please enter all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3004/api/flickfinder/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      navigate('/moviesselect'); // Redirect to the movie selection page
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Failed to login');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sign In</h2>
        <form onSubmit={handleLoginSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="App-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="App-input"
          />
          <button type="submit" className="App-button">Sign In</button>
        </form>
        {errorMessage && <div className="App-error">{errorMessage}</div>}
        <div className="navigation-buttons">
          <button onClick={() => navigate('/')} className="App-button">Back to Main</button>
          <button onClick={() => navigate('/sign-up')} className="App-button">Sign Up</button>
        </div>
      </header>
    </div>
  );
}

export default SignIn;
