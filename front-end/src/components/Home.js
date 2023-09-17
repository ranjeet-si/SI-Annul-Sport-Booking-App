import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import '../CSS/Home.css'; 

const Home = () => {
  const messages = [
    "Welcome to SI Annual Sports Event",
    "Are you excited for it 🤗",
    "Get ready for an action-packed event with thrilling surprises! 🔥",
    "Let's make this event unforgettable! 🏆💥"
  ];

  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer;

    if (charIndex < messages[index].length) {
      timer = setTimeout(() => {
        setText(prevText => prevText + messages[index][charIndex]);
        setCharIndex(prevCharIndex => prevCharIndex + 1);
      }, 100);
    } else {
      timer = setTimeout(() => {
        setCharIndex(0);
        setText('');
        setIndex(prevIndex => (prevIndex + 1) % messages.length);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [charIndex, index, messages]);

  return (
    <div className='profile-container'>
      <div className='profile-parent'>
        <div className='profile-details-name'>
          <span className='pramary-text'>
            {""}
            <span className='highlighted'>Hello, SI Player🌟</span>
          </span>
        </div>
        <div className='profile-details-role'>
          <span className='primary-text'>
            <h1>{text}</h1>
          </span>
        </div>
        <div className='profile-options'>
          <Link to="/hrlogin">
            <button>Login as HR</button>
          </Link>
          <Link to="/employeelogin">
            <button>Login as Employee</button>
          </Link>                      
        </div>
      </div>
    </div>
  );
};

export default Home;
