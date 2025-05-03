/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { skuActions,branchActions } from "../../store/index";
import { fetchBranches, fetchSKUs } from "../../services/api";

function SKUCreation() {
  const [skus, setSKUs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    item_name: "",
    sku_code: "",
    autoGenerate: true,
    category: "",
    subcategory: "",
    brand: "",
  });
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skusResponse, branchesResponse] = await Promise.all([
          axios.get("http://localhost:3000/skus"),
          axios.get("http://localhost:3000/branches")
        ]);

        setSKUs(skusResponse.data);
        setBranches(branchesResponse.data);
        console.log(skusResponse.data.length);


        // Extract unique categories and subcategories
        const categoriesSet = new Set();
        const subcategoriesSet = new Set();

        skusResponse.data.forEach((sku) => {
          if (sku.category) categoriesSet.add(sku.category);
          if (sku.subcategory) subcategoriesSet.add(sku.subcategory);
        });

        setCategories(Array.from(categoriesSet));
        setSubcategories(Array.from(subcategoriesSet));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data from server.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    const item_name = formData.item_name?.trim().toLowerCase() || "";
    const sku_code = formData.sku_code?.trim().toLowerCase() || "";

    // Required field validations
    if (!item_name) errors.item_name = "Item name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.subcategory) errors.subcategory = "Subcategory is required";
    if (!formData.brand) errors.brand = "Brand is required";

    if (!formData.autoGenerate && !sku_code) {
      errors.sku_code = "SKU Code is required";
    }

    // Duplicate checks
    if (skus.some((sku) => sku.item_name?.toLowerCase() === item_name)) {
      errors.item_name = "This item name is already used";
    }

    if (!formData.autoGenerate && skus.some((sku) => sku.sku_code?.toLowerCase() === sku_code)) {
      errors.sku_code = "This SKU Code is already used";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getRandomBranchId = () => {
    if (branches.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * branches.length);
    return branches[randomIndex].id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Generate a unique ID based on the highest existing ID
      const maxId = skus.length > 0 ? Math.max(...skus.map(sku => parseInt(sku.id))) : 0;
      const newId = maxId + 1;

      // Get a random branch ID
      const branchId = getRandomBranchId();

      const newSKU = {
        id: newId.toString(),
        item_name: formData.item_name,
        sku_code: formData.autoGenerate ? `SKU-${newId}` : formData.sku_code,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        active: true, // Always set to true
        branch_id: branchId, // Random branch ID
        quantity: 50,
        reserved: 0,
        reorder_threshold: 15
      };

      const response = await axios.post("http://localhost:3000/skus", newSKU);
      const updatedSKUs = await fetchSKUs()
      const updatedBranches=await fetchBranches()
      dispatch(skuActions.setSKUs(updatedSKUs)); // Update Redux store with new SKUs
      dispatch(branchActions.setBranches(updatedBranches))
      setSKUs([...skus, newSKU]);
      setFormData({
        item_name: "",
        sku_code: "",
        autoGenerate: true,
        category: "",
        subcategory: "",
        brand: "",
      });
      setValidationErrors({});
      toast.success(`SKU created successfully! Assigned to branch ID: ${branchId}`);
    } catch (error) {
      console.error("Error adding SKU:", error);
      toast.error("Failed to create SKU.");
    }
  };

  const inputStyle = (field) =>
    `w-full p-2 border rounded-md ${validationErrors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">SKU Creation</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              placeholder="Enter item name..."
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className={inputStyle("item_name")}
            />
            {validationErrors.item_name && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.item_name}</p>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="autoGenerate"
              name="autoGenerate"
              checked={formData.autoGenerate}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="autoGenerate" className="text-sm font-medium text-gray-700">
              Auto-generate SKU code
            </label>
          </div>

          {!formData.autoGenerate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
              <input
                type="text"
                name="sku_code"
                value={formData.sku_code}
                onChange={handleChange}
                className={inputStyle("sku_code")}
              />
              {validationErrors.sku_code && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.sku_code}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputStyle("category")}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className={inputStyle("subcategory")}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
              {validationErrors.subcategory && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.subcategory}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputStyle("brand")}
              />
              {validationErrors.brand && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.brand}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create SKU
          </button>
        </form>
      </div>
    </div>
  );
}

export default SKUCreation;