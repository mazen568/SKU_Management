import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { fetchSKUs } from "../../services/api"; 
import { useDispatch } from 'react-redux';
import { skuActions } from "../../store/index";

export default function SKUDeactivation() {
  const [skuToDeactivate, setSkuToDeactivate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deactivatedSKU, setDeactivatedSKU] = useState(null);
  const dispatch = useDispatch();

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send PATCH request to only update 'active' field to false
      await axios.patch(`http://localhost:3000/skus/${skuToDeactivate}`, {
        active: false
      });

      // Fetch updated SKUs and find the deactivated SKU
      const updatedSKUs = await fetchSKUs();
      dispatch(skuActions.setSKUs(updatedSKUs)); // Update Redux store with new SKUs
      const deactivated = updatedSKUs.find(sku => sku.id === skuToDeactivate);
      setDeactivatedSKU(deactivated);

      toast.success(`SKU ${skuToDeactivate} deactivated successfully!`);
      setSkuToDeactivate('');
    } catch (error) {
      console.error('Error deactivating SKU:', error);
      toast.error('The SKU ID does not exist or Could not be Deactivated.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">SKU Deactivation</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleDeactivate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter SKU ID</label>
            <input
              type="text"
              value={skuToDeactivate}
              onChange={(e) => {
                setSkuToDeactivate(e.target.value);
                setDeactivatedSKU(null); // Clear deactivated SKU details
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter SKU ID to deactivate"
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Deactivate SKU'}
          </button>
        </form>
        {deactivatedSKU && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold">Deactivated SKU Details:</h3>
            <p><strong>SKU Code:</strong> {deactivatedSKU.sku_code}</p>
            <p><strong>Name:</strong> {deactivatedSKU.item_name}</p>
            <p><strong>Category:</strong> {deactivatedSKU.category}</p>
            <p><strong>SubCategory:</strong> {deactivatedSKU.subcategory}</p>
            <p><strong>Brand:</strong> {deactivatedSKU.brand}</p>
            <p><strong>Status:</strong> {deactivatedSKU.active ? 'Active' : 'Inactive'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
