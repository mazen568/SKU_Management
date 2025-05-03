// RootLayout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { branchActions,skuActions} from "../store/index";
import { fetchSKUs,fetchBranches } from '../services/api'; 
const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch SKUs and Branches in parallel
        const skus = await fetchSKUs();
        const branches = await fetchBranches();
        
        
        // Dispatch actions to store the data in Redux
        dispatch(branchActions.setBranches(branches));  // Dispatch branch data
        dispatch(skuActions.setSKUs(skus));  // Dispatch SKU data
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data from server.");
      }
    };

    fetchData();
  }, [dispatch]);


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-700">SKU Management System</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
