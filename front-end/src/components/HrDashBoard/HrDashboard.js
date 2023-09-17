import React, { useState, useEffect } from 'react';
import VenueManagement from './VenueManagement';
import EquipmentManagement from './EquipmentManagement';

import '../../CSS/HrDashbord.css';
import { useNavigate } from 'react-router-dom'; // Import useHistory for programmatic navigation
import HRBookingRequests from './BookingRequests';

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
        
          setUserName(data.data.user.name);

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
        return <HRBookingRequests />;
      default:
        return null;
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="sidebar">
        <div className="user-info">
          <div className="profile-picture">
            <img src="https://static.vecteezy.com/system/resources/previews/004/899/680/non_2x/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg" alt="Profile" />
          </div>
          <br/>
          <div className="user-name">
          Player Name -
             <h3><span >{userName}</span></h3>
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
