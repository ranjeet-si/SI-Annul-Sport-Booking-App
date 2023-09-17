import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import BookVenue from './BookVenues';
import BookingList from './BookingList';
import Notifications from './Notification';

import { useNavigate } from 'react-router-dom'
import '../../CSS/empDashBoard.css'



const EmpDashboard = () => {
  
  const [activeTab, setActiveTab] = React.useState('bookVenue');
  const [userName, setUserName] = useState('Ranjeet');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
  
    // if (storedUsername) {
    //   fetch(`http://localhost:3001/api/v1/getUserDetails/${storedUsername}`)
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log('User data:', data.data.user.name);
    //       console.log('name:',storedUsername)
    //       setUserName(data.data.user.name);
  
    //     })
    //     .catch(error => console.error('Error fetching user name:', error));
    // }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  // Render the active tab content
  const renderActiveTab = () => {
    
    switch (activeTab) {

      case 'profile':
        return <Profile />;
      case 'bookVenue':
        return <BookVenue />;
      case 'bookingList':
        return <BookingList />;
      case 'notifications':
        return <Notifications />;
      default:
        return null;
    }
  };

  return (
    <div className="emp-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
      <div className="user-info">
      <div className="profile-picture">
        <img src="https://cdn-icons-png.flaticon.com/512/5556/5556499.png" alt="Profile" />
      </div>
      <br/>
      <div className="user-name">
      Player Name -
         <h3><span >{userName}</span></h3>
      </div>
    </div>
        
        <button onClick={() => handleTabChange('bookVenue')}>Book Venue</button>
        <button onClick={() => handleTabChange('bookingList')}>Booking List</button>
        <button onClick={() => handleTabChange('notifications')}>Notifications</button>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>

      {/* Content */}
      <div className="content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default EmpDashboard;
