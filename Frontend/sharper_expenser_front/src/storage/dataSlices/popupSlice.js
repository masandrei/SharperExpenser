import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: 'popupSlice',
    initialState: false,
    reducers:{
        popUpOpenClose : (state, action) => {
            return !state;
        }
    }
});

export const {popUpOpenClose} = popupSlice.actions;
export default popupSlice.reducer;