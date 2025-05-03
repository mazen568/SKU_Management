import { createSlice, configureStore } from "@reduxjs/toolkit";

// Initial state for branch
const initialBranchState = {
  branches: [],
};

// Initial state for SKU
const initialSKUState = {
  skus: [],
};

// Initial state for stock levels
const initialStockLevelState = {
  stockLevels: [],
};

// Branch slice
const branchSlice = createSlice({
  name: "branch",
  initialState: initialBranchState,
  reducers: {
    setBranches(state, action) {
      state.branches = action.payload;
    },
  },
});

// SKU slice
const skuSlice = createSlice({
  name: "sku",
  initialState: initialSKUState,
  reducers: {
    setSKUs(state, action) {
      state.skus = action.payload;
    },
  },
});

// Stock level slice
const stockLevelSlice = createSlice({
  name: "stockLevel",
  initialState: initialStockLevelState,
  reducers: {
    setStockLevels(state, action) {
      state.stockLevels = action.payload;
    },
  },
});

// Export actions for use in components
export const branchActions = branchSlice.actions;
export const skuActions = skuSlice.actions;
export const stockLevelActions = stockLevelSlice.actions;

// Create and export the store
const store = configureStore({
  reducer: {
    branch: branchSlice.reducer, // branch reducer
    sku: skuSlice.reducer,       // sku reducer
    stockLevel: stockLevelSlice.reducer, // stock level reducer
  },
});

export default store;
