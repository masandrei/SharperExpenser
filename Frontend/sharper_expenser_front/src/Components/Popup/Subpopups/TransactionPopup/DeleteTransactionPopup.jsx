import { useContext } from "react";
import { popupContext } from "../../../../storage/ContextStorage";
import transactionCalls from "../../../../lib/apiCalls/transactionCalls";

import "./TransactionPopup.css";
import CurrencyService from "../../../../lib/CurrencyService";

const DeleteTransactionPopup = () => {
  const { setOpen, currentGoal, params, togglePopup } =
    useContext(popupContext);

  const deleteTransaction = async () => {
    const exchangeRate = await CurrencyService.getExchangeRateRequest(params.chosenTransaction.transactionDate, params.chosenTransaction.currency, currentGoal.currency)
    transactionCalls
      .deleteTransaction({
        transactionId: params.chosenTransaction.id,
        exchangeRate
      })
      .then((response) => {
        togglePopup({});
        setOpen(false);
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
            togglePopup({});
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteTransactionPopup;
