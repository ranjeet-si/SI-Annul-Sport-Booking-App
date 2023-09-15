import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="container">
      <h2>Welcome to Sports Management System</h2>
      <div className="button-container">
        <Link to="/hrlogin">
          <button>Login as HR</button>
        </Link>
        <Link to="/employeelogin">
          <button>Login as Employee</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
