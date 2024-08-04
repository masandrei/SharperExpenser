import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import DateHelper from '../../lib/DataHelper';
import './Popup.css';
import { popUpOpenClose } from '../../storage/dataSlices/popupSlice';

const defaultFormData = {
    TransactionId: 0,
    TransactionDate: "",
    TransactionAmount: "",
    TransactionCurrency: "USD",
    TransactionCategory: "groceries"
};

function Popup()
{
    const [formData, setFormData] = useState(defaultFormData); 
    const isOpen = useSelector(state => state.isPopupOpen);
    const chosenElement = useSelector(state => state.chosenTransaction);
    const setOpen = useDispatch();
    
    function submitData()
    {
        axios.put('http://localhost:5266/transaction', formData,{
            headers:
            {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMDAzIiwibmJmIjoxNzIxNDIxMTA0LCJleHAiOjE3MjE0MjIwMDQsImlhdCI6MTcyMTQyMTEwNH0.UzAGxaVDftDDpA0NrqqwHVpJg18HIheu2DgzAf2S8TQ',
                accept: "*/*", "Content-Type": "application/json"
            }
        }).then(response => console.log(response))
        .catch(err => console.log(err))
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    if(isOpen)
    {
        return (
            <div className="Popup">
            <div className="popup-inner">
                <form>
                <div>
                    <label htmlFor="transaction-date">Transaction Date:</label>
                    <input type="datetime-local" id="transaction-date" name="TransactionDate" value={chosenElement?.transactionDate} onChange={handleInputChange} required />
                </div>
                
                <div>
                    <label htmlFor="transaction-amount">Transaction Amount:</label>
                    <input type="number" id="transaction-amount" name="TransactionAmount" step="0.01" max="99999999.99" value={chosenElement?.amount} onChange={handleInputChange} required />
                </div>
                
                <div>
                    <label htmlFor="transaction-currency">Transaction Currency:</label>
                    <select id="transaction-currency" name="TransactionCurrency" onChange={handleInputChange} required>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="transaction-category">Transaction Category:</label>
                    <select id="transaction-category" name="TransactionCategory" onChange={handleInputChange} required>
                        <option value="groceries">Groceries</option>
                        <option value="utilities">Utilities</option>
                        <option value="entertainment">Entertainment</option>
                    </select>
                </div>
                
                <button type="submit" onClick={submitData}>Submit</button>
                </form>
                <button onClick={() => setOpen(popUpOpenClose())}>close</button>
            </div>
        </div>
        );
    }
    else
    {
        return("");
    }
}

export default Popup;