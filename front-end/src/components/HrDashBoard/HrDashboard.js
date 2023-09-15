import React, { useState, useEffect } from 'react';
import VenueManagement from './VenueManagement';
import EquipmentManagement from './EquipmentManagement';
import BookingRequests from './BookingRequests';
import '../../CSS/HrDashbord.css';
import { useNavigate } from 'react-router-dom'; // Import useHistory for programmatic navigation

const HrDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('venues');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Initialize useHistory

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      fetch(`http://localhost:3001/api/v1/getUserDetails/${storedUsername}`)
        .then(response => response.json())
        .then(data => {
          console.log('User data:', data.data.user.name);
          console.log('name:',storedUsername)
          setUserName(storedUsername);

        })
        .catch(error => console.error('Error fetching user name:', error));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/'); // Redirect to Home.js component
  };

  const renderSelectedTab = () => {
    switch (selectedTab) {
      case 'venues':
        return <VenueManagement />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'bookingRequests':
        return <BookingRequests />;
      default:
        return null;
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="sidebar">
        <div className="user-info">
          <div className="profile-picture">
            <img src="profile.jpg" alt="Profile" />
          </div>
          <div className="user-name">
            Player Name - <h3>{userName}</h3>
          </div>
        </div>
        <button onClick={() => setSelectedTab('venues')}>Add Venues</button>
        <button onClick={() => setSelectedTab('equipment')}>Add Equipment</button>
        <button onClick={() => setSelectedTab('bookingRequests')}>Booking Requests</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="content">
        {renderSelectedTab()}
      </div>
    </div>
  );
};

export default HrDashboard;
