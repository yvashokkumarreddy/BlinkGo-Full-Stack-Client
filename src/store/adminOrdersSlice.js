import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordersList: [] // ✅ always an array
};

const adminOrdersSlice = createSlice({
  name: "AdminOrders",
  initialState,
  reducers: {
    handleAllOrders: (state, action) => {
      // ✅ Defensive check
      state.ordersList = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    clearAllOrders: (state) => {
      state.ordersList = [];
    }
  }
});

// export const {handleAllOrders  } = adminOrdersSlice.actions

// export default adminOrdersSlice.reducer
export const { handleAllOrders, clearAllOrders } = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
