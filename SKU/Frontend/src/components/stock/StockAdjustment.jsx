import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { skuActions } from '../../store';
import { fetchSKUs } from '../../services/api';

export default function StockAdjustment() {
  const [formData, setFormData] = useState({
    skuId: '',
    adjustmentType: 'increase',
    quantity: '',
    reason: ''
  });


  const [errors, setErrors] = useState({
    skuId: false,
    quantity: false,
    reason: false
  });

  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(false);
  const storeSKUs = useSelector((state) => state.sku.skus)
  const dispatch = useDispatch()

  // Fetch all SKUs


  useEffect(() => {
    setSkus(storeSKUs)
  }, [storeSKUs]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false })); // Clear error dynamically
  };

  const validateForm = () => {
    const newErrors = {
      skuId: !formData.skuId,
      quantity: !formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0,
      reason: !formData.reason
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Find SKU by code
      const sku = skus.find(s => s.id === formData.skuId);
      if (!sku) {
        setErrors(prev => ({ ...prev, skuId: true }));
        return;
      }

      // Calculate adjustment
      const adjustment = formData.adjustmentType === 'increase'
        ? parseInt(formData.quantity)
        : -parseInt(formData.quantity);

      // Create adjustment record
      await axios.post('http://localhost:3000/stock_adjustments', {
        sku_id: sku.id,
        adjustment,
        reason: formData.reason,
        date: new Date().toISOString()
      });

      // Update SKU quantity
      const newQuantity = sku.quantity + adjustment;
      await axios.patch(`http://localhost:3000/skus/${sku.id}`, {
        quantity: newQuantity,
        adjustments: [
          ...(sku.adjustments || []),
          {
            id: Date.now().toString(),
            adjustment,
            reason: formData.reason,
            date: new Date().toISOString()
          }
        ]
      });

      toast.success('Stock adjustment recorded successfully!');
      setFormData({
        skuId: '',
        adjustmentType: 'increase',
        quantity: '',
        reason: ''
      });


      const updatedSKUs = await fetchSKUs();
      console.log(updatedSKUs);

      dispatch(skuActions.setSKUs(updatedSKUs)); // Update Redux store with new SKUs
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record adjustment');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Stock Adjustment</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU ID (from database)</label>
            <input
              type="text"
              name="skuId"
              value={formData.skuId}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.skuId ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter SKU ID"
            />
            {errors.skuId && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid SKU code</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
              <select
                name="adjustmentType"
                value={formData.adjustmentType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="increase">Increase Stock</option>
                <option value="decrease">Decrease Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid quantity (minimum 1)</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select Reason</option>
              <option value="damaged">Damaged Goods</option>
              <option value="return">Customer Return</option>
              <option value="found">Found Stock</option>
              <option value="theft">Theft</option>
              <option value="other">Other</option>
            </select>
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">Please select a reason</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Processing...' : 'Record Adjustment'}
          </button>
        </form>
      </div>
    </div>
  );
}