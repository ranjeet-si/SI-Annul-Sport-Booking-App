import React, { useState, useEffect } from 'react';
import "../../CSS/BookingReq.css"

const HRBookingRequests = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch booking data from your backend API
    fetch('http://localhost:3001/api/v1/getBookings')
      .then((response) => response.json())
      .then((data) => {
        setBookingData(data.data.bookings);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching booking data:', error);
        setLoading(false);
      });
  }, []);

  const handleApprove = (bookingId) => {
    // Send a PUT request to update the booking status to "approved"
    fetch(`http://localhost:3001/api/v1/updateBookingStatus/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'approved' }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Remove the booking card from the UI
          setBookingData((prevData) =>
            prevData.filter((booking) => booking.bookingid !== bookingId)
          );
        }
      })
      .catch((error) => {
        console.error('Error approving booking:', error);
      });
  };

  const handleReject = (bookingId) => {
    // Send a PUT request to update the booking status to "rejected"
    fetch(`http://localhost:3001/api/v1/updateBookingStatus/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected' }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Remove the booking card from the UI
          setBookingData((prevData) =>
            prevData.filter((booking) => booking.bookingid !== bookingId)
          );
        }
      })
      .catch((error) => {
        console.error('Error rejecting booking:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>HR Booking Requests</h2>
      {bookingData.length === 0 ? (
        <p>No booking requests available.</p>
      ) : (
        <ul>
          {bookingData.map((booking) => (
            <li key={booking.bookingid}>
              <div>
                <strong>Booking ID:</strong> {booking.bookingid}
              </div>
              <div>
                <strong>User ID:</strong> {booking.userid}
              </div>
              <div>
                <strong>Venue ID:</strong> {booking.venueid}
              </div>
              <div>
                <strong>Equipment ID:</strong> {booking.equipmentid}
              </div>
              <div>
                <strong>Status:</strong> {booking.status}
              </div>
              <button className="approve-btn" onClick={() => handleApprove(booking.bookingid)}>
              Approve
            </button>
            <button className="reject-btn" onClick={() => handleReject(booking.bookingid)}>
              Reject
            </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HRBookingRequests;
