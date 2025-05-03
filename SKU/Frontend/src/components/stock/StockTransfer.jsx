import  { useState } from 'react';

export default function StockTransfer() {
  const [transferData, setTransferData] = useState({
    skuCode: '',
    quantity: '',
    fromLocation: '',
    toLocation: '',
    reason: '',
    expectedDate: ''
  });

  const locations = [
    { id: 'WH001', name: 'Main Warehouse' },
    { id: 'ST001', name: 'Downtown Store' },
    { id: 'ST002', name: 'Uptown Store' },
    { id: 'WH002', name: 'Secondary Warehouse' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to process the transfer
    console.log('Stock transfer submitted:', transferData);
    alert(`Transfer initiated: ${transferData.quantity} units of SKU ${transferData.skuCode} from ${transferData.fromLocation} to ${transferData.toLocation}`);
    setTransferData({
      skuCode: '',
      quantity: '',
      fromLocation: '',
      toLocation: '',
      reason: '',
      expectedDate: ''
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Stock Transfer</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
            <input
              type="text"
              name="skuCode"
              value={transferData.skuCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={transferData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Transfer Date</label>
              <input
                type="date"
                name="expectedDate"
                value={transferData.expectedDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
              <select
                name="fromLocation"
                value={transferData.fromLocation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Source</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
              <select
                name="toLocation"
                value={transferData.toLocation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Destination</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Transfer</label>
            <select
              name="reason"
              value={transferData.reason}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Reason</option>
              <option value="restock">Store Restock</option>
              <option value="excess">Excess Inventory</option>
              <option value="sale">Promotional Sale</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Initiate Transfer
          </button>
        </form>
      </div>
    </div>
  );
}