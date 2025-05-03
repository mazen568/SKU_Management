import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
export default function StockTracking() {
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skus, setSKUs] = useState([]); // Define allItems as a state variable
  const storeSKUs=useSelector((state)=>state.sku.skus)

  useEffect(() => {
    setSKUs(storeSKUs)
  }, [storeSKUs]);


  useEffect(() => {
    const filtered = skus.filter((sku) => (sku.sku_code.toLowerCase().includes(searchTerm.toLowerCase())));
    setFilteredResults(filtered);
    console.log(skus);

  }, [searchTerm, skus]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Stock Level Tracking</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU code"
            className="p-2 border border-gray-300 rounded-md md:w-96"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length>0?filteredResults.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.sku_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.item_name}</td> 
                  <td className="px-16 py-4 whitespace-nowrap">{item.quantity - item.reserved}</td>
                  <td className="px-12 py-4 whitespace-nowrap">{item.reserved}</td>
                  <td className="px-16 py-4 whitespace-nowrap">{item.reorder_threshold}</td>

                </tr>
              )): (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No SKUs match your search.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}