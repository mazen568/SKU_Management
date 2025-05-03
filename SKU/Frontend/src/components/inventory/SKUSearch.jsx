import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function SKUSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [allItems, setAllItems] = useState([]); // Define allItems as a state variable
  const storeSKUs = useSelector((state) => state.sku.skus) ;
  useEffect(() => {
    console.log("storeSKUs from Redux:", storeSKUs);

   setAllItems(storeSKUs)
  }, [storeSKUs]);

  useEffect(() => {
    const filtered = allItems?.filter((item) => {
      const matchesSearch =
        item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku_code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === '' || item.subcategory === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });

    setFilteredResults(filtered);
  }, [searchTerm, allItems, selectedCategory, selectedSubcategory]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">SKU Search</h2>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU, name"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {[...new Set(allItems.map(item => item.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Subcategories</option>
              {[...new Set(allItems.map(item => item.subcategory))].map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
            setSelectedSubcategory('');
          }}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.sku_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.item_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.subcategory}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${item.active ? "text-green-400" : "text-red-600"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))
              ) : (
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

export default SKUSearch;
