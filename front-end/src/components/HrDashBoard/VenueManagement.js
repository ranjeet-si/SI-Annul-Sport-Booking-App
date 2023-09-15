
import React, { useState } from 'react';
import '../../CSS/VenueMangement.css'

const VenueManagement = () => {
  
  const [venueName, setVenueName] = useState('');
  const [sports, setSports] = useState([{ sportName: '', startTime: '', endTime: '' }]);

  const handleAddSport = () => {
    setSports([...sports, { sportName: '', startTime: '', endTime: '' }]);
  };

  const handleDeleteSport = (index) => {
    const updatedSports = [...sports];
    updatedSports.splice(index, 1);
    setSports(updatedSports);
  };

  const handleSportChange = (index, key, value) => {
    const updatedSports = [...sports];
    updatedSports[index][key] = value;
    setSports(updatedSports);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = { venueName, sports };

    try {
      const response = await fetch('http://localhost:3001/api/v1/addVenueAndSports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert('Venue and sports added successfully!');
        setVenueName('');
        setSports([{ sportName: '', startTime: '', endTime: '' }]);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const username= "UserName"

  return (
    <>
    <div className='username'>
     <h1>Hii, <span>{username}</span> Plz Add  Sport in Venue</h1>
    </div>
    <div className="App">
      
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Venue Name:</label>
          <input
            type="text"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
          <button type="button" onClick={handleAddSport}>
          Add Sport
        </button>
        </div>
        <div>
         
        </div>
        {sports.map((sport, index) => (
          <div className="sport-entry" key={index}>
            <h3>Sport {index + 1}</h3>
            <div>
              <label>Sport Name:</label>
              <input
                type="text"
                value={sport.sportName}
                onChange={(e) =>
                  handleSportChange(index, 'sportName', e.target.value)
                }
              />
            </div>
            <div>
              <label>Start Time:</label>
              <input
                type="time"
                value={sport.startTime}
                onChange={(e) =>
                  handleSportChange(index, 'startTime', e.target.value)
                }
              />
              
              
              
            </div>
            <div>
              <label>End Time:</label>
              <input
                type="time"
                value={sport.endTime}
                onChange={(e) =>
                  handleSportChange(index, 'endTime', e.target.value)
                }
              />
            </div>
            <button
              type="button"
              onClick={() => handleDeleteSport(index)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
  }
  
  export default VenueManagement;
  