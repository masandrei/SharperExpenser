import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

import "./Popup.css";
import { popupContext } from "../../storage/ContextStorage";

const defaultFormData = {
  id: 0,
  transactionDate: "",
  amount: 0,
  currency: "",
  category: "",
};

function Popup() {
  const [formData, setFormData] = useState(defaultFormData);
  const { isOpen, setOpen } = useContext(popupContext);
  const { chosenTransaction, setChosenTransaction } = useContext(popupContext);
  useEffect(() => {
    setFormData({
      ...formData,
      ...chosenTransaction,
    });
  }, [chosenTransaction]);

  function submitData() {
    axios
      .put("http://localhost:5266/transaction", formData, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI1MDI1Nzc0LCJleHAiOjE3MjYzMjE3NzQsImlhdCI6MTcyNTAyNTc3NH0.pq-RozU4vPZcXX0MnIp-8LkEGoOzh9Dl30wYjRsWcPY",
          accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then(() => setOpen(false))
      .catch((err) => console.log(err));
  }

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData]
  );
  if (isOpen) {
    return (
      <div className="Popup">
        <div className="popup-inner">
          <form>
            <div>
              <label htmlFor="transaction-date">Transaction Date:</label>
              <input
                type="datetime-local"
                id="transaction-date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="transaction-amount">Transaction Amount:</label>
              <input
                type="number"
                id="transaction-amount"
                name="amount"
                step="0.01"
                max="99999999.99"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="transaction-currency">
                Transaction Currency:
              </label>
              <select
                id="transaction-currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label htmlFor="transaction-category">
                Transaction Category:
              </label>
              <select
                id="transaction-category"
                name="category"
                onChange={handleInputChange}
                value={formData.category}
                required
              >
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <button type="submit" onClick={submitData}>
              Submit
            </button>
          </form>
          <button onClick={() => setOpen(false)}>close</button>
        </div>
      </div>
    );
  } else {
    return "";
  }
}

export default Popup;
