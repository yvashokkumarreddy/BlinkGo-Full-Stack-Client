import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    ordersList : []
}

const adminOrdersSlice = createSlice({
    name : 'AdminOrders',
    initialState : initialValue,
    reducers : {
        handleAllOrders : (state,action)=>{
            state.ordersList = [...action.payload]
        }
    }
})

export const {handleAllOrders  } = adminOrdersSlice.Slice.actions

export default adminOrdersSlice.reducer