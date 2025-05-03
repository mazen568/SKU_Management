import  { useState } from 'react';

export default function BranchStockTracking() {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const branches = [
    { id: 'BR001', name: 'Main Warehouse' },
    { id: 'BR002', name: 'Downtown Store' },
    { id: 'BR003', name: 'Uptown Store' },
    { id: 'BR004', name: 'Westside Store' }
  ];

  const categories = [
    'Electronics',
    'Clothing',
    'Home Goods',
    'Food & Beverage',
    'Office Supplies'
  ];

  const branchStock = [
    { sku: 'SKU001', name: 'Smartphone X', category: 'Electronics', stock: { BR001: 25, BR002: 10, BR003: 8, BR004: 5 } },
    { sku: 'SKU002', name: 'Laptop Pro', category: 'Electronics', stock: { BR001: 12, BR002: 4, BR003: 3, BR004: 2 } },
    { sku: 'SKU003', name: 'Wireless Earbuds', category: 'Electronics', stock: { BR001: 30, BR002: 15, BR003: 12, BR004: 8 } },
    { sku: 'SKU004', name: 'Cotton T-shirt', category: 'Clothing', stock: { BR001: 50, BR002: 25, BR003: 20, BR004: 15 } },
    { sku: 'SKU005', name: 'Desk Lamp', category: 'Home Goods', stock: { BR001: 18, BR002: 9, BR003: 7, BR004: 4 } }
  ];

  const filteredStock = branchStock.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesCategory;
  });

  const getStockForSelectedBranch = (stockData) => {
    if (!selectedBranch) return 'Select a branch';
    return stockData[selectedBranch] || 0;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Branch-Specific Stock Tracking</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                {!selectedBranch ? (
                  branches.map(branch => (
                    <th key={branch.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {branch.name}
                    </th>
                  ))
                ) : (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredStock.map(item => (
                <tr key={item.sku} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                  {!selectedBranch ? (
                    branches.map(branch => (
                      <td key={branch.id} className="px-6 py-4 whitespace-nowrap">
                        {item.stock[branch.id] || 0}
                      </td>
                    ))
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStockForSelectedBranch(item.stock)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}