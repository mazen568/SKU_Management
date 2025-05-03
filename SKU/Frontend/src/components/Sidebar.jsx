/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Branch Setup', key: 'branchSetup' },
    { name: 'SKU Creation', key: 'skuCreation' },
    { name: 'SKU Search', key: 'skuSearch' },
    { name: 'SKU Deactivation', key: 'skuDeactivation' },
    { name: 'Barcode Integration', key: 'barcodeIntegration' },
    { name: 'Stock Tracking', key: 'stockTracking' },
    { name: 'Stock Adjustment', key: 'stockAdjustment' },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current route from the URL and strip the leading slash
  const currentPath = location.pathname.replace('/', '') || 'dashboard';  // default to 'dashboard'

  function handleNavigation(path) {
    navigate(path);
  }

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-semibold text-green-700">SKU Manager</span>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key}>
              <button 
                onClick={() => handleNavigation(item.key)}
                className={`w-full text-left p-3 flex items-center ${
                  currentPath === item.key
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
