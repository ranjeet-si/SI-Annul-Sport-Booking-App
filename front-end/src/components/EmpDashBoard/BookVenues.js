import React, { useState, useEffect } from 'react';
import '../../CSS/Bookvenues.css';

const BookVenue = () => {
  const [venueList, setVenueList] = useState([]);
  const [venueSports, setVenueSports] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [cart, setCart] = useState([]);
  const [sports, setSports] = useState([]);
  let count = 0;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/venues');
        const data = await response.json();
        setVenueList(data.data.venues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  const handleVenueSelect = async (venue) => {
    try {
      const response = await fetch(`http://localhost:3001/api/venuesports/${venue.venueid}`);
      const data = await response.json();
      const sportsForVenue = data.data.venuesports;
      setVenueSports(sportsForVenue);
      setSelectedVenue(venue);
    } catch (error) {
      console.error('Error fetching sports for venue:', error);
    }
  };

  const handleSportSelect = async (sport) => {
    console.log('Selected sport:', sport);
    try {
      if (!sport || !sport.sportid) {
        throw new Error("Invalid sport or sport id");
      }
  
      const response = await fetch(`http://localhost:3001/api/equipment/${sport.sportid}`);
      const data = await response.json();
  
      if (data.data && Array.isArray(data.data.equipment)) {
        const equipmentForSport = data.data.equipment;
        setEquipmentList(equipmentForSport);
        setSelectedSport(sport);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      console.error('Error fetching equipment for sport:', error);
    }
  };
  

  const handleEquipmentSelect = (event) => {
    const selectedEquipmentId = parseInt(event.target.value);
    const selectedEquipmentObj = equipmentList.find(
      (equipment) => equipment.equipmentid === selectedEquipmentId
    );

    setSelectedEquipment([...selectedEquipment, selectedEquipmentObj]);
  };

  const addToCart = () => {
    count++;
    if (selectedVenue && selectedSport) {
      const cartItem = {
        venue: selectedVenue,
        sport: selectedSport,
        equipment: selectedEquipment,
        startTime: new Date(), // Replace with actual start time logic
        endTime: new Date(), // Replace with actual end time logic
        status: 'booked', // Replace with default status
        user_id: 1, // Replace with actual user ID
      };
      setCart([...cart, cartItem]);
      setSelectedVenue(null);
      setSelectedSport(null);
      setSelectedEquipment([]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const submitBooking = async () => {
    try {
      await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });
      // Optionally, you can show a success message or redirect the user.
    } catch (error) {
      console.error('Error submitting booking:', error);
      // Handle error (e.g., show an error message to the user).
    }
  };

  return (
    <div className="book-venue">
      <h2>Book a Venue</h2>

      <div className="venue-list">
        <h3>Venues</h3>
        <ul>
          {venueList.map((venue) => (
            <li key={venue.venueid} onClick={() => handleVenueSelect(venue)}>
              {venue.venuename}
            </li>
          ))}
        </ul>
      </div>

      {venueSports.length > 0 && (
        <div className="selected-venue">
          <h3>Selected Venue: {selectedVenue.venuename}</h3>

          <div className="sport-list">
            <h4>Sports</h4>
            <ul>
              {venueSports.map((sport) => (
                <li key={sport.venuesportid} onClick={() => handleSportSelect(sport)}>
                  {sport.sportname}
                </li>
              ))}
            </ul>
          </div>

          {selectedSport && (
            <div className="selected-sport">
              <h4>Selected Sport: {selectedSport.sportname}</h4>

              <div className="equipment-list">
                <h5>Equipment</h5>
                <select onChange={handleEquipmentSelect}>
                  <option value="" disabled selected>
                    Select Equipment
                  </option>
                  {equipmentList.map((equipment) => (
                    <option key={equipment.equipmentid} value={equipment.equipmentid}>
                      {equipment.equipmentname}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={addToCart}>Add to Cart</button>
            </div>
          )}
        </div>
      )}

      <div className="cart">
        <h3>Your Booking Cart: {cart.length}</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <p>Venue: {item.venue.venuename}</p>
              <p>Sport: {item.sport.sportname}</p>
              <p>Equipment: {item.equipment.map((eq) => eq.equipmentname).join(', ')}</p>
              <p>Start Time: {item.startTime.toString()}</p>
              <p>End Time: {item.endTime.toString()}</p>
              <p>Status: {item.status}</p>
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={submitBooking}>Submit Booking</button>
      </div>
    </div>
  );}
 export default BookVenue;

    