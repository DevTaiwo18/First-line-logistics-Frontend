// src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import logo from '../../assets/WhatsApp Image 2024-09-11 at 1.28.40 PM.jpeg';
import { useAuth } from '../../context/AuthContext';
import { useShipments } from '../../context/ShipmentContext';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { fetchShipmentByWaybillNumber } = useShipments();
  const [waybillNumber, setWaybillNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
  };

  const handleSearch = async () => {
    if (waybillNumber.trim()) {
      try {
        console.log(`Searching for waybill number: ${waybillNumber.trim()}`);
        const shipment = await fetchShipmentByWaybillNumber(waybillNumber.trim());
        if (shipment) {
          console.log(`Shipment found:`, shipment);
          navigate(`/dashboard/shipment/${shipment._id}`);
        } else {
          setError('Shipment not found. Please check the waybill number.');
        }
      } catch (error) {
        setError('Error retrieving shipment information.');
        console.error(error);
      }
    }
  };

  return (
    <header className="bg-white text-blue-900 p-5 flex items-center shadow-md fixed top-0 left-0 w-full z-50">
      <img src={logo} alt="Company Logo" className="h-10" />
      
      <div className="ml-auto flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by Waybill"
          value={waybillNumber}
          onChange={(e) => setWaybillNumber(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
        <button
          onClick={handleLogout}
          className="p-2 text-blue-900 hover:bg-blue-100 rounded shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <Logout className="h-6 w-6" />
        </button>
      </div>
      
      {error && <div className="text-red-800 mt-2">{error}</div>}
    </header>
  );
};

export default Header;
