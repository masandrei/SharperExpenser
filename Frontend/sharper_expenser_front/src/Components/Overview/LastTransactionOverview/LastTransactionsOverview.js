import React, { useState, useEffect, useCallback, useContext } from "react";
import { popupContext } from "../../../storage/ContextStorage";
import axios from "axios";

import DataHelper from "../../../lib/DataHelper";
import "./LastTransactionsOverview.css";

const dateOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

function LastTransactionsOverview() {
  const [lastTransactions, setLastTransactions] = useState([]);
  const { isOpen, setOpen } = useContext(popupContext);
  const { chosenTransaction, setChosenTransaction } = useContext(popupContext);

  const openPopup = useCallback(e => {
    setOpen(true);
    const [type, dateGroupLocation, transactionGroupLocation] =
      e.target.id.split("-");
    
    if(dateGroupLocation && transactionGroupLocation){
      setChosenTransaction(
        lastTransactions[dateGroupLocation][transactionGroupLocation]
      );
    }
    
  }, [lastTransactions]);
  useEffect(() => {
    axios
      .get("http://localhost:5266/transaction", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang"
        },
        params:{
          pageCursorDate: new Date().toISOString(),
          pageCursorId: 0,
          pageSize: 10
        }
      })
      .then((response) => {
        const page = response.data.transactionPage;
        setLastTransactions(page);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="transactions-overview">
      <div id="transactions-top-menu">
        <span>Last Transactions</span>
        <label onClick={openPopup}>Add</label>
      </div>
      <div id="transactionList">
        {lastTransactions.map((dateGroup, dateIndex) => (
          <div>
            <span>
              {new Date(dateGroup[0].transactionDate).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </span>
            {dateGroup.map((transaction, transactionIndex) => (
              <div
                key={transaction.id}
                id={`${dateIndex}-${transactionIndex}`}
                className="transaction-list-element"
              >
                <div className="category">{transaction.category}</div>
                <div className="transaction-money-content">
                  <label
                    id={`edit-${dateIndex}-${transactionIndex}`}
                    onClick={openPopup}
                  >
                    edit
                  </label>
                  <div
                    style={{ color: transaction.amount > 0 ? "green" : "red" }}
                  >
                    {transaction.amount + " " + transaction.currency}
                  </div>
                  {DataHelper.formatTimeString(
                    new Date(transaction.transactionDate)
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastTransactionsOverview;
