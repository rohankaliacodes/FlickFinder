import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Add this line to get the navigate function

  async function handleRegisterSubmit(event) {
    event.preventDefault();

    if (!username || !email || !password || !confirmPassword || !displayName) {
      setErrorMessage('Please enter all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3004/api/flickfinder/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           username: username, 
           email: email, 
           password: password, 
           confirmPassword: confirmPassword,
           displayName: displayName,
          }), 
      });
      //console.log(response)

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      console.log('Registration successful');
      setErrorMessage("Success!")
      navigate('/sign-in'); 
    } catch (error) {
      console.log('Registration error');
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="App-input"
          />
          <input 
            type="text" 
            placeholder="Display Name/Username" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="App-input"
          />
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
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="App-input"
          />
          <button type="submit" className="App-button">Sign Up</button>
        </form>
        {errorMessage && <div className="App-error">{errorMessage}</div>}
        <div className="navigation-buttons">
          <button onClick={() => navigate('/')} className="App-button">Back to Main</button>
          <button onClick={() => navigate('/sign-in')} className="App-button">Sign In</button>
        </div>
      </header>
    </div>
  );
}

export default SignUp;
