import React, {useState, useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import DataHelper from '../../../lib/DataHelper';
import { popUpOpenClose } from '../../../storage/dataSlices/popupSlice';
import './LastTransactionsOverview.css';
import { setChosenItem } from '../../../storage/dataSlices/transactionSlice';

const dateOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
};


function LastTransactionsOverview()
{
    const [lastTransactions, setLastTransactions] = useSelector(state => state.transactions);
    const dispatcher = useDispatch();

    const changeEditVisible = function(e){
        e.preventDefault();
        const editLabel = document.getElementById(`edit-${e.target.id}`);
        if(!editLabel)
            return;
        if(editLabel.style.visibility === "visible"){
            editLabel.style.visibility = "hidden";
        }else{
            editLabel.style.visibility = "visible";
        }
    }
    const openPopup = useCallback((e) => {
        dispatcher(popUpOpenClose());
        const [type, dateGroupLocation, transactionGroupLocation] = e.target.id.split('-');
        dispatcher(setChosenItem(lastTransactions[dateGroupLocation][transactionGroupLocation]));
    },[]);
    useEffect(() => {
        
    }, []);
    
    
    return(
        <div className="transactions-overview">
            <span>
                Last Transactions
            </span>
            <div id="transactionList">
                {lastTransactions.map((dateGroup, dateIndex) => 
                    <div>
                        <span>{new Date(dateGroup[0].transactionDate).toLocaleDateString('en-US', dateOptions)}</span>
                        {dateGroup.map((transaction, transactionIndex) => 
                            <div key={transaction.id} id={`${dateIndex}-${transactionIndex}`} className="transaction-list-element" onMouseEnter={changeEditVisible} onMouseLeave={changeEditVisible}>
                                <div className="category">
                                    {transaction.category}
                                </div>
                                <div className="transaction-money-content">
                                    <label id={`edit-${dateIndex}-${transactionIndex}`} onClick={openPopup}>edit</label>
                                    <div style={{color:transaction.amount > 0 ? 'green':'red'}}>
                                        {transaction.amount + " " + transaction.currency}
                                    </div>
                                    {DataHelper.formatTimeString(new Date(transaction.transactionDate))}
                                </div>
                        </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LastTransactionsOverview;