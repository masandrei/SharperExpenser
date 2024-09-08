import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./Filter.css";

export default function Filter({ setQuery }) {
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [dateTo, setDateTo] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [amountFrom, setAmountFrom] = useState(null);
  const [amountTo, setAmountTo] = useState(null);
  const [chosenCurrencies, setChosenCurrencies] = useState(new Set());
  const [chosenCategories, setChosenCategories] = useState(new Set());

  const changeCurrency = useCallback((e) => {
    if (e.target.checked) {
      chosenCurrencies.add(e.target.value);
    } else {
      chosenCurrencies.delete(e.target.value);
    }
  }, []);
  const changeCategory = useCallback((e) => {
    if (e.target.checked) {
      chosenCategories.add(e.target.value);
    } else {
      chosenCategories.delete(e.target.value);
    }
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const tempQuery = {};
    if (dateTo) {
      tempQuery.DateTo = dateTo;
    }
    if (dateFrom) {
      tempQuery.DateFrom = dateFrom;
    }
    if (amountFrom) {
      tempQuery.AmountFrom = amountFrom;
    }
    if (amountTo) {
      tempQuery.AmountTo = amountTo;
    }
    if (chosenCategories.size != 0) {
      tempQuery.Category = [...chosenCategories].join(",");
    }
    if (chosenCurrencies.size != 0) {
      tempQuery.Currency = [...chosenCurrencies].join(",");
    }
    if (Object.keys(tempQuery).length > 0) {
      console.log(tempQuery);
      setQuery(tempQuery);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5266/transaction/currencies", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI1MDI1Nzc0LCJleHAiOjE3MjYzMjE3NzQsImlhdCI6MTcyNTAyNTc3NH0.pq-RozU4vPZcXX0MnIp-8LkEGoOzh9Dl30wYjRsWcPY",
        },
      })
      .then((response) => {
        setCurrencies(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5266/transaction/categories", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI1MDI1Nzc0LCJleHAiOjE3MjYzMjE3NzQsImlhdCI6MTcyNTAyNTc3NH0.pq-RozU4vPZcXX0MnIp-8LkEGoOzh9Dl30wYjRsWcPY",
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <form onSubmit={submitForm}>
      <div className="input-box">
        <label>Date from:</label>
        <input
          name="dateFrom"
          type="date"
          onChange={(event) => setDateFrom(event.target.value)}
        />
      </div>
      <div className="input-box">
        <label>Date to:</label>
        <input
          name="dateTo"
          type="date"
          onChange={(event) => setDateTo(event.target.value)}
        />
      </div>
      <div className="input-box">
        <label>Amount from:</label>
        <input
          name="amountFrom"
          type="number"
          step="0.01"
          max="99999999.99"
          min="0.01"
          onChange={(event) => setAmountFrom(event.target.value)}
        />
      </div>
      <div className="input-box">
        <label>Amount to:</label>
        <input
          name="amountTo"
          type="number"
          step="0.01"
          max="99999999.99"
          min="0.01"
          onChange={(event) => setAmountTo(event.target.value)}
        />
      </div>
      <div className="dropdown">
        <label>Categories:</label>
        <div className="select-item">
          {categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                name={category}
                onChange={changeCategory}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
      <div className="dropdown">
        <label>Currencies:</label>
        <div className="select-item">
          {currencies.map((currency) => (
            <label key={currency}>
              <input
                type="checkbox"
                value={currency}
                name={currency}
                onChange={changeCurrency}
              />
              {currency}
            </label>
          ))}
        </div>
      </div>
      <button type="submit">Filter out</button>
    </form>
  );
}
