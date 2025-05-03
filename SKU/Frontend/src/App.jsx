/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import Dashboard from "./components/Dashboard"
import InventoryBranchSetup from './components/inventory/InventoryBranchSetup';
import SKUCreation from './components/inventory/SKUCreation'; // SKU Creation component
import SKUSearch from './components/inventory/SKUSearch'; // SKU Search component
import SKUDeactivation from './components/inventory/SKUDeactivation'; // SKU Deactivation component
import BarcodeIntegration from './components/inventory/BarcodeIntegration'; // Barcode Integration component
import StockTracking from './components/stock/StockTracking'; // Stock Tracking component
import StockAdjustment from './components/stock/StockAdjustment'; // Stock Adjustment componentr
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import { ToastContainer } from "react-toastify";



// Main App component
export default function App() {

  const router = createBrowserRouter([
    {
      path: '/', element: <RootLayout  />,
      children: [
        { path: "", element: <Dashboard /> },/* Dashboard component */
        { path: "dashboard", element: <Dashboard /> },/* Dashboard component */
        { path: "branchSetup", element: <InventoryBranchSetup /> },/* Branch Setup component */
        { path: "skuCreation", element: <SKUCreation /> },/* SKU Creation component */
        { path: "skuSearch", element: <SKUSearch /> },/* SKU Search component */
        { path: "skuDeactivation", element: <SKUDeactivation /> },/* SKU Deactivation component */
        { path: "barcodeIntegration", element: <BarcodeIntegration /> },/* Barcode Integration component */
        { path: "stockTracking", element: <StockTracking /> },/* Stock Tracking component */
        { path: "stockAdjustment", element: <StockAdjustment /> },/* Stock Adjustment component */
      ]
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />

    </>
  );
}