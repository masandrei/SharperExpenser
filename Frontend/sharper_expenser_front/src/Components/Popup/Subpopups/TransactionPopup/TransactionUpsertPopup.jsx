import { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { popupContext } from "../../../../storage/ContextStorage";
import CurrencyService from "../../../../lib/CurrencyService";

import "./TransactionPopup.css";
const defaultFormData = {
  id: 0,
  transactionDate: "",
  amount: 0,
  category: "",
  currency: "",
};

const TransactionUpsertPopup = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const {
    popupState,
    setPopupState,
    currentGoal,
    setCurrentGoal,
    chosenTransaction,
    setChosenTransaction,
  } = useContext(popupContext);
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
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setPopupState({action: "closed", entity: null});
          setChosenTransaction(null);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
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
          setPopupState({action: "closed", entity: null});
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
  return (
    <div>
      <form>
        <div className="input">
          <div className="input-block">
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

          <div className="input-block">
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
            {popupState === "update" ? (
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

          <div className="input-block">
            <label htmlFor="transaction-category">Transaction Category:</label>
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
        </div>
        <div className="buttons">
          <button type="submit" onClick={submitData}>
            Submit
          </button>
          <button
            onClick={() => {
              setPopupState("closed");
              setChosenTransaction(null);
            }}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionUpsertPopup;
