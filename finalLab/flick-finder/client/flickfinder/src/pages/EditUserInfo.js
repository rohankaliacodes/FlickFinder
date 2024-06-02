import React, { useState } from 'react';
import './EditUserInfo.css';
import { Link } from 'react-router-dom';

function EditUserInfo() {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldDisplayName, setOldDisplayName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [confirmNewDisplayName, setConfirmNewDisplayName] = useState('');
  const [notifications, setNotifications] = useState("Off");
  const [answer, setAnswer] = useState('');


  const handleChangePasswordSubmit = async () => {
    const payload = {
      userID: username,
      old: oldPassword,
      newp: newPassword,
      confirmPassword: confirmNewPassword
    };

    try {
      const response = await fetch('http://localhost:3004/api/flickfinder/updatePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text(); // Read the response as text instead of JSON
        throw new Error(text);
      }

      console.log('Password Update Response: Password Updated Successfully!');
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Password Update Error:', error);
      alert('Failed to update password: ' + error.message);
    }
    console.log('Submitting Password Change:');
  };




  const handleChangeDisplayNameSubmit = async () => {
    const payload = {
      userID: username,
      old: oldDisplayName,
      newd: newDisplayName,
      confirmDisplay: confirmNewDisplayName
    };

    try {
      const response = await fetch('http://localhost:3004/api/flickfinder/updateDisplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text(); // Read the response as text instead of JSON
        throw new Error(text);
      }

      console.log('Display Name Update Response: Display Name Updated Successfully!');
      alert('Display Name updated successfully!');
    } catch (error) {
      console.error('Display Name Update Error:', error);
      alert('Failed to update Disaplay Name: ' + error.message);
    }
    console.log('Submitting Disaplay Name Change:');
  };

  const toggleNotifications = async () => {
    let payload ={}
    if (!username) {
      alert('Please enter a username.');
      return;
    }
    if(notifications == "On"){
      payload = {
        userID: username,
        answer: 1
      };
    }
    if(notifications == "Off"){
      payload = {
        userID: username,
        answer: 0
      };
    }
  

    try {
      const response = await fetch('http://localhost:3004/api/flickfinder/updateNoti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text(); // Read the response as text instead of JSON
        throw new Error(text);
      }

      console.log('Notification Settings Update Response: Password Updated Successfully!');
      alert('Notification Settings updated successfully!');
    } catch (error) {
      console.error('Notification Settings Update Error:', error);
      alert('Failed to update Notification Settings: ' + error.message);
    }
    console.log('Submitting Notification Settings Change:');
  
  };
  


  return (
    <div className="edit-user-container">
      <div className="edit-section">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="edit-section">
        <h3>Change Password:</h3>
        <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        <button onClick={handleChangePasswordSubmit}>Submit</button>
      </div>

      <div className="edit-section">
        <h3>Edit Display Name:</h3>
        <input type="text" placeholder="Old Display Name" value={oldDisplayName} onChange={(e) => setOldDisplayName(e.target.value)} />
        <input type="text" placeholder="New Display Name" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
        <input type="text" placeholder="Confirm New Display Name" value={confirmNewDisplayName} onChange={(e) => setConfirmNewDisplayName(e.target.value)} />
        <button onClick={handleChangeDisplayNameSubmit}>Submit</button>
      </div>

      <div className="edit-section">
        <h3>Notifications:</h3>
        <select
          value={notifications}
          onChange={(e) => setNotifications(e.target.value)}
          className="notification-select"
        >
          <option value="On">On</option>
          <option value="Off">Off</option>
        </select>
        <button onClick={toggleNotifications} className="submit-button">Submit</button>
      </div>
      {/* Additional buttons for log out and edit user info */}
      <div className="additional-buttons-container">
        <Link to="/">
          <button className="logout-button">Log Out</button>
        </Link>
        
        <Link to="/moviesSelect">
          <button className="home-button">Return to Swipe</button>
        </Link>
      </div>
    </div>
  );
}

export default EditUserInfo;
