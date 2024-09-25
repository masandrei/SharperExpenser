import React, { useState, useEffect, useCallback, useContext } from "react";
import { popupContext } from "../../storage/ContextStorage";
import axios from "axios";

import DataHelper from "../../lib/DataHelper";
import Filter from "../Filter/Filter";
import "./TransactionList.css";

const dateOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const unixEpoch = new Date(0);

function TransactionList() {
  const [lastTransactions, setLastTransactions] = useState([]);
  const [cursorDate, setCursorDate] = useState(new Date());
  const [cursorId, setCursorId] = useState(0);
  const [pageNumber, setPageNumber] = useState({ value: 1 });
  const [query, setQuery] = useState({});
  const { popupState, setPopupState, chosenTransaction, setChosenTransaction } =
    useContext(popupContext);

  const openPopup = useCallback(
    (e) => {
      const [action, dateGroupLocation, transactionGroupLocation] =
        e.target.id.split("-");

      if (dateGroupLocation && transactionGroupLocation) {
        setChosenTransaction(
          lastTransactions[dateGroupLocation][transactionGroupLocation]
        );
      }
      setPopupState({action: action, entity: "transaction"});
    },
    [lastTransactions]
  );

  useEffect(() => {
    setLastTransactions([]);
    setPageNumber({ value: 1 });
    setCursorId(0);
    setCursorDate(new Date());
  }, [query]);

  useEffect(() => {
    axios
      .get("http://localhost:5266/transaction", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
        },
        params: {
          PageCursorDate: cursorDate,
          PageCursorId: cursorId,
          PageSize: 10,
          ...query,
        },
      })
      .then((response) => {
        const page = response.data.transactionPage;
        setCursorDate(new Date(response.data.nextPageCursorDate));
        setCursorId(response.data.nextPageCursorId);
        if (page.length == 0) {
          return;
        }
        if (lastTransactions.length == 0) {
          setLastTransactions(page);
        }
        const [firstGroup, ...others] = page;
        const prevLastDate = lastTransactions
          .at(-1)
          ?.at(0)
          .transactionDate.split("T") || [null];
        const nextFirstDate = firstGroup[0]?.transactionDate.split("T") || [
          null,
        ];
        if (prevLastDate[0] === nextFirstDate[0]) {
          lastTransactions.at(-1).push(...firstGroup);
          setLastTransactions((prev) => [...prev, ...others]);
        } else {
          setLastTransactions((prev) => [...prev, firstGroup, ...others]);
        }
      })
      .catch((err) => console.error(err));
  }, [pageNumber]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      cursorDate > unixEpoch
    ) {
      setPageNumber((pageNumber) => {
        return { value: pageNumber.value + 1 };
      });
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="transactions-overview">
      <Filter setQuery={setQuery} />
      <div id="transactions-top-menu">
        <span>Last Transactions</span>
        <label onClick={() => setPopupState({action: "create", entity: "transaction"})}>Add</label>
      </div>
      <div id="transactionList">
        {lastTransactions.map((dateGroup, dateIndex) => (
          <div key={dateGroup[0].transactionDate + dateIndex}>
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
                  <div className="transaction-edit-delete-block">
                    <label
                      id={`update-${dateIndex}-${transactionIndex}`}
                      onClick={openPopup}
                    >
                      edit
                    </label>
                    <label
                      id={`delete-${dateIndex}-${transaction}`}
                      onClick={openPopup}
                    >
                      delete
                    </label>
                  </div>

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

export default TransactionList;
