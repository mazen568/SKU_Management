/* eslint-disable no-unused-vars */
// src/api/skuApi.js
import axios from 'axios';

// Function to fetch SKUs
export const fetchSKUs = async () => {
  try {
    const response = await axios.get("http://localhost:3000/skus");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch SKUs");
  }
};

export const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:3000/branches");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch branches");
    }
  };
  export const fetchStockLevels = async () => {
    try {
      const response = await axios.get("http://localhost:3000/stock_levels");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch branches");
    }
  };