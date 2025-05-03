/* eslint-disable react-hooks/exhaustive-deps */
 
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


function Dashboard() {
  const storeBranches=useSelector((state)=>state.branch.branches)
  const storeSKUs=useSelector((state)=>state.sku.skus)
  const [stats, setStats] = useState([]);
  const [topSKUs, setTopSKUs] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [skus,setSKUs]=useState(storeSKUs||[]);
  const [branches,setBranches]=useState(storeBranches||[]);
  
  
  useEffect(()=>{
    setBranches(storeBranches);
    setSKUs(storeSKUs)
  },[storeBranches,storeSKUs])

  useEffect(() => {
   
      
    const calculateAvailable = (sku) => (sku.quantity || 0) - (sku.reserved || 0);

        // Filter out SKUs that have stock information (quantity exists)
        const skusWithStock = skus.filter(sku => typeof sku.quantity === 'number');

        // Top 5 Performing SKUs
        const topSkus = [...skusWithStock]
          .sort((a, b) => calculateAvailable(b) - calculateAvailable(a))
          .slice(0, 5)
          .map((sku) => ({
            name: sku.item_name || `SKU-${sku.id}`,
            quantity: calculateAvailable(sku),
          }));
        setTopSKUs(topSkus);

        // Low Stock Items (only for active SKUs with branch_id)
        const lowStock = skusWithStock
          .filter(sku => 
            sku.active && 
            sku.branch_id && 
            calculateAvailable(sku) <= (sku.reorder_threshold || 0)
          )
          .map((sku) => {
            const branch = branches.find((branch) => branch.id == sku.branch_id);
            return {
              name: sku.item_name || `SKU-${sku.id}`,
              quantity: calculateAvailable(sku),
              branchName: branch?.name || "Unknown Branch",
            };
          });
        setLowStockItems(lowStock);

        // Stats
        setStats([
          { title: "Total Branches", value: branches.length },
          { title: "Active SKUs", value: skus.filter((sku) => sku.active).length },
          { title: "Low Stock Items", value: lowStock.length },
          { title: "Total SKUs", value: skus.length }
        ]);
    


  }, [skus,branches]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing SKUs</h3>
        <ul className="space-y-2">
          {topSKUs.map((sku, index) => (
            <li key={index} className="p-2 hover:bg-gray-50 rounded flex justify-between">
              <span>{sku.name}</span>
              <span className="font-bold">{sku.quantity} units</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Low Stock Items</h3>
        <ul className="space-y-2">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item, index) => (
              <li key={index} className="p-2 hover:bg-gray-50 rounded flex justify-between">
                <div>
                  <span>{item.name}</span>
                  <span className="block text-sm text-gray-500">Branch: {item.branchName}</span>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center text-gray-500 bg-gray-100 p-4 rounded">
              <span>No Low Stock Items</span>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;