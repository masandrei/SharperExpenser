import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

import "./Popup.css";
import { popupContext } from "../../storage/ContextStorage";
import CurrencyService from "../../lib/CurrencyService";

const defaultFormData = {
  id: 0,
  transactionDate: "",
  amount: 0,
  category: "",
  currency: "",
};

function Popup() {
  const [formData, setFormData] = useState(defaultFormData);
  const { isOpen, setOpen } = useContext(popupContext);
  const { chosenTransaction, setChosenTransaction } = useContext(popupContext);
  const { currentGoal, setCurrentGoal } = useContext(popupContext);
  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...chosenTransaction,
    });
  }, [chosenTransaction]);

  async function submitData(e) {
    e.preventDefault();
    let newExchangeRate = 1;
    let oldExchangeRate = 1;
    console.log(currentGoal, formData?.currency);
    if (currentGoal !== null) {
      newExchangeRate = await CurrencyService.getExchangeRateRequest(
        new Date(formData.transactionDate),
        formData.currency,
        currentGoal.currency
      );
      if (
        chosenTransaction !== null &&
        chosenTransaction.transactionDate !== formData.transactionDate
      ) {
        oldExchangeRate = await CurrencyService.getExchangeRateRequest(
          new Date(chosenTransaction.transactionDate),
          chosenTransaction.currency,
          currentGoal.currency
        );
      } else {
        oldExchangeRate = newExchangeRate;
      }
    }
    if (chosenTransaction === null) {
      axios
        .post(
          "http://localhost:5266/transaction",
          { ...formData, exchangeRate: newExchangeRate },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
              "Content-Type": "application/json"
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setOpen(false);
          setChosenTransaction(null);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log(formData);
      axios
        .put(
          "http://localhost:5266/transaction",
          { ...formData, newExchangeRate, oldExchangeRate },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
              accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          console.log("transaction has been sent");
          setOpen(false);
          setChosenTransaction(null);
        })
        .catch((err) => console.log(err.response));
    }
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
              {chosenTransaction?.currency ? (
                chosenTransaction.currency
              ) : (
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
              )}
            </div>

            <div>
              <label htmlFor="transaction-category">
                Transaction Category:
              </label>
              <input
                type="text"
                minLength="1"
                maxLength="50"
                value={formData.category}
                onChange={handleInputChange}
                name="category"
                required
              />
            </div>

            <button type="submit" onClick={submitData}>
              Submit
            </button>
          </form>
          <button onClick={() => {
            setOpen(false);
            setChosenTransaction(null);
          }}>close</button>
        </div>
      </div>
    );
  } else {
    return "";
  }
}

export default Popup;
