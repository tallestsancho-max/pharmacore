'use client';
import React, { useState } from 'react';

export default function RestockPage() {
  const [drugId, setDrugId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Sample hardcoded list for your dropdown selector
  const drugInventoryList = [
    { id: '1', name: 'Paracetamol' },
    { id: '2', name: 'Amoxicillin' },
    { id: '3', name: 'Ibuprofen' }
  ];

  const handleRestockSubmit = async (e) => {
    e.preventDefault();

    if (!drugId || !quantity || parseInt(quantity) <= 0) {
      setStatusMessage('Please select a valid drug and entering a quantity above 0.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/drugs/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: drugId,
          amount: parseInt(quantity)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage('Stock successfully updated! Redirecting...');
        setTimeout(() => {
          window.location.href = '/drugs'; // Redirects straight to your drugs page view
        }, 1500);
      } else {
        setStatusMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setStatusMessage('Failed to connect to server backend.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Restock Medical Inventory</h2>
      {statusMessage && <p style={{ color: statusMessage.includes('successfully') ? 'green' : 'red' }}>{statusMessage}</p>}
      
      <form onSubmit={handleRestockSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>Select Drug Item:</label>
          <select value={drugId} onChange={(e) => setDrugId(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="">-- Select Medication --</option>
            {drugInventoryList.map(drug => (
              <option key={drug.id} value={drug.id}>{drug.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>Quantity to Restock:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Add To Inventory
        </button>
      </form>
    </div>
  );
}
