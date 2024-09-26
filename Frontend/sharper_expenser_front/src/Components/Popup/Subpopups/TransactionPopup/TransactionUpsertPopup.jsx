import { useContext, useState, useEffect, useCallback } from "react";
import { popupContext } from "../../../../storage/ContextStorage";
import CurrencyService from "../../../../lib/CurrencyService";
import transactionCalls from "../../../../lib/apiCalls/transactionCalls";

import "./TransactionPopup.css";
import { POPUP_STATES } from "../../Popup";
const defaultFormData = {
  id: 0,
  transactionDate: "",
  amount: 0,
  category: "",
  currency: "",
};

const TransactionUpsertPopup = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const { params, togglePopup, setOpen, currentGoal } = useContext(popupContext);

  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...params.chosenTransaction,
    });
  }, [params.chosenTransaction]);

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
        params.chosenTransaction !== null &&
        params.chosenTransaction.transactionDate !== formData.transactionDate
      ) {
        oldExchangeRate = await CurrencyService.getExchangeRateRequest(
          new Date(params.chosenTransaction.transactionDate),
          params.chosenTransaction.currency,
          currentGoal.currency
        );
      } else {
        oldExchangeRate = newExchangeRate;
      }
    }
    if (params.chosenTransaction === null) {
      transactionCalls
        .createTransaction({ ...formData, exchangeRate: newExchangeRate })
        .then((response) => {
          togglePopup({});
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      transactionCalls
        .updateTransaction({ ...formData, newExchangeRate, oldExchangeRate })
        .then(() => {
          togglePopup({});
          setOpen(false);
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
            {params.action === POPUP_STATES.TRANSACTION.UPDATE ? (
              params.chosenTransaction.currency
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
              togglePopup({});
              setOpen(false);
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
