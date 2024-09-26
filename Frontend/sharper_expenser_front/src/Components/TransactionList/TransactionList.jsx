import React, { useState, useEffect, useCallback, useContext } from "react";
import { popupContext } from "../../storage/ContextStorage";
import dayjs from "dayjs";

import { POPUP_STATES } from "../Popup/Popup";
import Filter from "../Filter/Filter";
import "./TransactionList.css";
import transactionCalls from "../../lib/apiCalls/transactionCalls";

const dateOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const unixEpoch = new Date(0);

function TransactionList({isShorten}) {
  console.log(isShorten);
  const [lastTransactions, setLastTransactions] = useState([]);
  const [cursorDate, setCursorDate] = useState(new Date());
  const [cursorId, setCursorId] = useState(0);
  const [pageNumber, setPageNumber] = useState({ value: 1 });
  const [query, setQuery] = useState({});
  const { setOpen, togglePopup } = useContext(popupContext);

  const openPopup = useCallback(
    (e) => {
      const [action, dateGroupLocation, transactionGroupLocation] =
        e.target.id.split("-");
      let chosenTransaction = null;
      if (dateGroupLocation && transactionGroupLocation) {
        chosenTransaction =
          lastTransactions[dateGroupLocation][transactionGroupLocation];
      }
      togglePopup({
        action: action,
        entity: POPUP_STATES.TRANSACTION.TITLE,
        chosenTransaction,
      });
      setOpen(true);
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
    transactionCalls
      .getTransactionPage({
        PageCursorDate: cursorDate,
        PageCursorId: cursorId,
        PageSize: 10,
        ...query,
      })
      .then((response) => {
        const page = response.data.transactionPage;
        setCursorDate(new Date(response.data.nextPageCursorDate));
        setCursorId(response.data.nextPageCursorId);
        if (page.length === 0) {
          return;
        }
        if (lastTransactions.length === 0) {
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
      cursorDate > unixEpoch &&
      !isShorten
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
    <div className="tranctions">
      {!isShorten && <Filter setQuery={setQuery} />}
      <div className="transactions-overview">
        <div id="transactions-top-menu">
          <span>Last Transactions</span>
          <label
            onClick={() =>
              togglePopup({
                action: POPUP_STATES.TRANSACTION.CREATE,
                entity: POPUP_STATES.TRANSACTION.TITLE,
              })
            }
          >
            Add
          </label>
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
                      style={{
                        color: transaction.amount > 0 ? "green" : "red",
                      }}
                    >
                      {transaction.amount + " " + transaction.currency}
                    </div>
                    {dayjs(transaction.transactionDate).format("HH:MM")}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
