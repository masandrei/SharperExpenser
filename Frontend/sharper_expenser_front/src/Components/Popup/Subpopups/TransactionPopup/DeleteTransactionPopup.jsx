import { useContext } from "react";
import { popupContext } from "../../../../storage/ContextStorage";
import axios from "axios";

import "./TransactionPopup.css"

const DeleteTransactionPopup = () => {
  const { popupState, setPopupState, chosenTransaction, setChosenTransaction } =
    useContext(popupContext);

  const deleteTransaction = () => {
    axios
      .delete("http://localhost:5266/transaction", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
        },
        data: {
          transactionId: chosenTransaction.id,
          exchangeRate: 1,
        },
      })
      .then((response) => {
        setPopupState({action: "closed", entity: null});
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="popup-delete-transaction">
      <div>Are you sure, you want to delete this transaction?</div>
      <div className="buttons">
        <button onClick={deleteTransaction}>Delete</button>
        <button
          onClick={() => {
            setPopupState({action: "closed", entity: null});
            setChosenTransaction(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteTransactionPopup;
