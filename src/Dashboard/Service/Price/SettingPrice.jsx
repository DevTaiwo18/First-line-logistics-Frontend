import React, { useState, useEffect } from 'react';
import { usePrices } from '../../../context/PriceContext'; // Adjust path as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for notifications

const SettingPrice = () => {
  const { prices, loading, error, addPrice } = usePrices();
  const [categoryName, setCategoryName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [vatCharge, setvatCharge] = useState('');
  const [weightCharges, setWeightCharges] = useState([{ range: '', charge: '' }]);
  const [deliveryCharges, setDeliveryCharges] = useState([{ type: '', charge: '' }]);
  const [deliveryScopeCharges, setDeliveryScopeCharges] = useState([{ scope: '', charge: '' }]);

  // Effect to calculate VAT whenever base price changes
  useEffect(() => {
    if (basePrice) {
      const basePriceNumber = parseFloat(basePrice.replace(/,/g, '')) || 0;
      const calculatedVAT = (basePriceNumber * 7.5) / 100;
      setvatCharge(calculatedVAT.toFixed(2)); // Set VAT charge with 2 decimal places
    } else {
      setvatCharge('');
    }
  }, [basePrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPrice = {
      categories: [{
        name: categoryName,
        basePrice: parseFloat(basePrice.replace(/,/g, '')),
        vatCharge: parseFloat(vatCharge.replace(/,/g, '')),
        weightCharges: weightCharges.map(wc => ({
          range: wc.range,
          charge: parseFloat(wc.charge.replace(/,/g, ''))
        })),
        deliveryCharges: deliveryCharges.map(dc => ({
          type: dc.type,
          charge: parseFloat(dc.charge.replace(/,/g, ''))
        })),
        deliveryScopeCharges: deliveryScopeCharges.map(dsc => ({
          scope: dsc.scope,
          charge: parseFloat(dsc.charge.replace(/,/g, ''))
        }))
      }],
      createdBy: '66eab34f92b02cf6d2ce2c16'
    };

    try {
      console.log(newPrice);

      await addPrice(newPrice);
      // Reset form
      setCategoryName('');
      setBasePrice('');
      setvatCharge('');
      setWeightCharges([{ range: '', charge: '' }]);
      setDeliveryCharges([{ type: '', charge: '' }]);
      setDeliveryScopeCharges([{ scope: '', charge: '' }]);
      toast.success('Price saved successfully!');
    } catch (err) {
      toast.error('Failed to save price. Please try again.');
    }
  };

  const formatCurrency = (value) => {
    const number = Number(value.replace(/[^0-9.]/g, ''));
    return number.toLocaleString();
  };

  return (
    <div className="shadow-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-custom-blue">Set Pricing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name:</label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price:</label>
          <input
            type="text"
            value={formatCurrency(basePrice)}
            onChange={(e) => setBasePrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="vatCharge" className="block text-sm font-medium text-gray-700">Vat Charge:</label>
          <input
            type="text"
            value={formatCurrency(vatCharge)}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm bg-gray-100"
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Weight Charges</h2>
          {weightCharges.map((wc, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Weight Range"
                value={wc.range}
                onChange={(e) => {
                  const newWeightCharges = [...weightCharges];
                  newWeightCharges[index].range = e.target.value;
                  setWeightCharges(newWeightCharges);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
              />
              <input
                type="text"
                placeholder="Charge"
                value={formatCurrency(wc.charge)}
                onChange={(e) => {
                  const newWeightCharges = [...weightCharges];
                  newWeightCharges[index].charge = e.target.value;
                  setWeightCharges(newWeightCharges);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setWeightCharges(weightCharges.filter((_, i) => i !== index))}
                className="px-3 py-2 bg-red-800 text-white font-semibold rounded-md shadow-sm hover:bg-red-900"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setWeightCharges([...weightCharges, { range: '', charge: '' }])}
            className="px-4 py-2 bg-green-800 text-white font-semibold rounded-md shadow-sm hover:bg-green-900"
          >
            Add Weight Charge
          </button>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Delivery Charges</h2>
          {deliveryCharges.map((dc, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={dc.type}
                onChange={(e) => {
                  const newDeliveryCharges = [...deliveryCharges];
                  newDeliveryCharges[index].type = e.target.value;
                  setDeliveryCharges(newDeliveryCharges);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
              >
                <option value="">Select Delivery Type</option>
                <option value="hubToHub">Hub to Hub</option>
                <option value="officeToHub">Office to Hub</option>
              </select>
              <input
                type="text"
                placeholder="Charge"
                value={formatCurrency(dc.charge)}
                onChange={(e) => {
                  const newDeliveryCharges = [...deliveryCharges];
                  newDeliveryCharges[index].charge = e.target.value;
                  setDeliveryCharges(newDeliveryCharges);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setDeliveryCharges(deliveryCharges.filter((_, i) => i !== index))}
                className="px-3 py-2 bg-red-800 text-white font-semibold rounded-md shadow-sm hover:bg-red-900"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDeliveryCharges([...deliveryCharges, { type: '', charge: '' }])}
            className="px-4 py-2 bg-green-800 text-white font-semibold rounded-md shadow-sm hover:bg-green-900"
          >
            Add Delivery Charge
          </button>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Delivery Scope Charges</h2>
          {deliveryScopeCharges.map((dsc, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={dsc.scope}
                onChange={(e) => {
                  const newDeliveryScopeCharges = [...deliveryScopeCharges];
                  newDeliveryScopeCharges[index].scope = e.target.value;
                  setDeliveryScopeCharges(newDeliveryScopeCharges);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
              >
                <option value="">Select Scope</option>
                <option value="withinState">Within State</option>
                <option value="interstate">Interstate</option>
              </select>
              <input
                type="text"
                placeholder="Charge"
                value={formatCurrency(dsc.charge)}
                onChange={(e) => {
                  const newDeliveryScopeCharges = [...deliveryScopeCharges];
                  newDeliveryScopeCharges[index].charge = e.target.value;
                  setDeliveryScopeCharges(newDeliveryScopeCharges);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setDeliveryScopeCharges(deliveryScopeCharges.filter((_, i) => i !== index))}
                className="px-3 py-2 bg-red-800 text-white font-semibold rounded-md shadow-sm hover:bg-red-900"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDeliveryScopeCharges([...deliveryScopeCharges, { scope: '', charge: '' }])}
            className="px-4 py-2 bg-green-800 text-white font-semibold rounded-md shadow-sm hover:bg-green-900"
          >
            Add Delivery Scope Charge
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-800 text-white font-semibold rounded-md shadow-sm hover:bg-blue-900"
        >
          Save
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SettingPrice;
