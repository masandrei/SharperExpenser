import { configureStore } from '@reduxjs/toolkit';
import chosenTransactionReducer from './dataSlices/transactionSlice.js';
import popUpOpenClose from './dataSlices/popupSlice.js';
import { getNextPageAsync } from './dataSlices/transactionSlice.js';

export default configureStore({
    reducer: {
        chosenTransaction: chosenTransactionReducer,
        isPopupOpen: popUpOpenClose
    }
});