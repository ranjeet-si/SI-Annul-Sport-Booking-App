import React, { useState, useEffect } from 'react';

const BookingList = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      fetch(`http://localhost:3001/api/v1/getUserDetails/${storedUsername}`)
        .then(response => response.json())
        .then(data => {
          console.log('User data:', data.data.user.name);
          console.log('name:',storedUsername)
          setUserName(data.data.user.user_id);
        })
        .catch(error => console.error('Error fetching user name:', error));
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/getBookings/${userId}`);
        const data = await response.json();
        setBookings(data.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userId]);

  console.log(userId)

  return (
    <div className="booking-list" style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h2 style={{ color: 'blue' }}>Your Bookings</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {bookings.map((booking) => (
          <li key={booking.bookingid} style={{ marginBottom: '10px' }}>
            <p><strong>Venue:</strong> {booking.venuename}</p>
            <p><strong>Sport:</strong> {booking.sportname}</p>
            <p><strong>Start Time:</strong> {booking.starttime}</p>
            <p><strong>End Time:</strong> {booking.endtime}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
