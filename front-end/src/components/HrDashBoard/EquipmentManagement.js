import React, { useState } from 'react';
import '../../CSS/EquipmentManagement.css';

const EquipmentManagement = () => {
  const [formData, setFormData] = useState({
    equipmentID: '',
    equipmentName: '',
   
    quantityAvailable: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/v1/addEquipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log(formData)
      if (response.ok) {
        alert('Equipment created successfully!');
        setFormData({
          equipmentID: '',
          equipmentName: '',
       
          quantityAvailable: '',
        });
      } else {
        alert('Failed to create equipment');
        console.error('Failed to create equipment', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="equipment-management-container">
      <h2 className="form-heading">Create Equipment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="equipmentID" className="equipment-id-label">Equipment ID:</label>
          <input
            type="text"
            id="equipmentID"
            name="equipmentID"
            value={formData.equipmentID}
            onChange={handleChange}
            required
            className="equipment-id-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="equipmentName" className="equipment-name-label">Equipment Name:</label>
          <input
            type="text"
            id="equipmentName"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            required
            className="equipment-name-input"
          />
        </div>
       

        <div className="form-group">
          <label htmlFor="quantityAvailable" className="quantity-label">Quantity Available:</label>
          <input
            type="number"
            id="quantityAvailable"
            name="quantityAvailable"
            value={formData.quantityAvailable}
            onChange={handleChange}
            required
            className="quantity-input"
          />
        </div>
        <button type="submit" className="submit-button">Create Equipment</button>
      </form>
    </div>
  );
};

export default EquipmentManagement;
