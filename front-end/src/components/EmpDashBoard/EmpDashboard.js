import React from 'react';
import Profile from './Profile';
import BookVenue from './BookVenues';
import BookingList from './BookingList';
import Notifications from './Notification';

import { useNavigate } from 'react-router-dom'
import '../../CSS/empDashBoard.css'

const EmpDashboard = () => {
  
  const [activeTab, setActiveTab] = React.useState('bookVenue');
  const navigate = useNavigate();

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
      
        <button onClick={() => handleTabChange('profile')}>Profile</button>
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
