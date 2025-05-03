import  { useState } from 'react';

export default function ReorderAlert() {
  const [alerts, setAlerts] = useState([
    { id: 1, sku: 'SKU001', name: 'Smartphone X', currentStock: 3, reorderLevel: 5, status: 'pending' },
    { id: 2, sku: 'SKU002', name: 'Laptop Pro', currentStock: 2, reorderLevel: 3, status: 'processed' },
    { id: 3, sku: 'SKU004', name: 'Cotton T-shirt', currentStock: 15, reorderLevel: 20, status: 'pending' }
  ]);

  const [newAlertSettings, setNewAlertSettings] = useState({
    sku: '',
    reorderLevel: '',
    notificationEmail: ''
  });

  const handleProcessAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'processed' } : alert
    ));
  };

  const handleAddAlertSetting = (e) => {
    e.preventDefault();
    // In a real app, this would save to your backend
    const newAlert = {
      id: Math.max(...alerts.map(a => a.id)) + 1,
      sku: newAlertSettings.sku,
      name: `Product for ${newAlertSettings.sku}`, // This would come from your database
      currentStock: 0, // This would come from your database
      reorderLevel: parseInt(newAlertSettings.reorderLevel),
      status: 'pending'
    };
    setAlerts([...alerts, newAlert]);
    setNewAlertSettings({
      sku: '',
      reorderLevel: '',
      notificationEmail: ''
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reorder Alert</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Current Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{alert.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alert.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alert.currentStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alert.reorderLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {alert.status === 'pending' ? 'Pending' : 'Processed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alert.status === 'pending' && (
                      <button
                        onClick={() => handleProcessAlert(alert.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Mark as Processed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Reorder Alert</h3>
        <form onSubmit={handleAddAlertSetting} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
              <input
                type="text"
                value={newAlertSettings.sku}
                onChange={(e) => setNewAlertSettings({...newAlertSettings, sku: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
              <input
                type="number"
                value={newAlertSettings.reorderLevel}
                onChange={(e) => setNewAlertSettings({...newAlertSettings, reorderLevel: e.target.value})}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
              <input
                type="email"
                value={newAlertSettings.notificationEmail}
                onChange={(e) => setNewAlertSettings({...newAlertSettings, notificationEmail: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save Alert Settings
          </button>
        </form>
      </div>
    </div>
  );
}