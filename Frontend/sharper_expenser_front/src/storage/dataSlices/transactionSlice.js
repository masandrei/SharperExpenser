import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

export const getNextPageAsync = createAsyncThunk('transactions/getNextPage', (state) =>
    axios.get('http://localhost:5266/transaction',{
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzIyMzYxNDk2LCJleHAiOjE3MjM2NTc0OTYsImlhdCI6MTcyMjM2MTQ5Nn0.9Ak8d2bRtWvtopBmKTISSqP8RBgfsdv2ER5gHbtV6pk',
            cursorDate: Date.now(),
            cursorId : 0,
            pageSize: 10
        }
    }
).then(response => response)
)

export const chosenElementSlice = createSlice({
    name: 'chosenElement',
    initialState: null,
    reducers:{
        setChosenItem: (state, action) => {
            return action.payload;
        }
    }
});

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState: [],
    reducers:{},
    extraReducers:{
        [getNextPageAsync.fulfilled](state, action){
            state.concat(action.payload)
        }
    }
})



export const {setChosenItem} = chosenElementSlice.actions;

export default chosenElementSlice.reducer;