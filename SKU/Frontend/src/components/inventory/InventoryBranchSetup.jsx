/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { branchActions } from "../../store";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchBranches } from "../../services/api";
function InventoryBranchSetup() {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const dispatch=useDispatch();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:3000/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Trimmed inputs
    const name = formData.name.trim().toLowerCase();
    const location = formData.location.trim().toLowerCase();
    const contact = formData.contact.trim();

    if (!name) errors.name = "Branch name is required";
    if (!location) errors.location = "Location is required";
    if (!contact) errors.contact = "Contact is required";

    if (
      branches.some((b) => b.name.toLowerCase() === name)
    ) {
      errors.name = "This branch name is already used";
    }

    if (
      branches.some((b) => b.location.toLowerCase() === location)
    ) {
      errors.location = "This location is already used";
    }

    if (
      branches.some((b) => b.contact === contact)
    ) {
      errors.contact = "This contact is already used";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const newBranch = {
        id: branches.length + 1,
        ...formData,
      };

      const response = await axios.post("http://localhost:3000/branches", newBranch);
      const newBranches=await fetchBranches()
      console.log(newBranches);
      
      setBranches([...branches, newBranch]);
      setFormData({ name: "", location: "", contact: "" });
      dispatch(branchActions.setBranches(newBranches))
      toast.success("Branch created successfully")
      setValidationErrors({});
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const inputStyle = (field) =>
    `w-full p-2 border rounded-md ${validationErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Inventory Branch Setup</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Branch</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
            <input
              placeholder="Enter branch name..."
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle("name")}
            />
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              placeholder="Enter location..."
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputStyle("location")}
            />
            {validationErrors.location && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
            <input
              placeholder="Enter contact details..."
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={inputStyle("contact")}
            />
            {validationErrors.contact && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.contact}</p>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Branch
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Existing Branches</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{branch.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{branch.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{branch.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{branch.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryBranchSetup;
