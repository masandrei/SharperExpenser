import { useContext } from "react";

import "./Popup.css";
import { popupContext } from "../../storage/ContextStorage";
import TransactionUpsertPopup from "./Subpopups/TransactionPopup/TransactionUpsertPopup";
import DeleteTransactionPopup from "./Subpopups/TransactionPopup/DeleteTransactionPopup";
import GoalUpsertPopup from "./Subpopups/GoalPopups/GoalUpsertPopup";
import DeleteGoalPopup from "./Subpopups/GoalPopups/GoalDeletePopup";
import LoginUserPopup from "./Subpopups/UserPopups/LoginUserPopup.jsx";

function Popup() {
  const { isOpen, params } = useContext(popupContext);
  if (!isOpen) {
    return null;
  }
  return (
    <div className="Popup">
      <div className="popup-inner">
        {params.entity === POPUP_STATES.USER.TITLE && (
          <>{params.action === POPUP_STATES.USER.LOGIN && <LoginUserPopup />}</>
        )}
        {params.entity === POPUP_STATES.TRANSACTION.TITLE && (
          <>
            {(params.action === POPUP_STATES.TRANSACTION.CREATE || params.action === POPUP_STATES.TRANSACTION.UPDATE) && (
              <TransactionUpsertPopup />
            )}
            {params.action === POPUP_STATES.TRANSACTION.DELETE && <DeleteTransactionPopup />}
          </>
        )}
        {params.entity === POPUP_STATES.GOAL.TITLE && (
          <>
            {(params.action === POPUP_STATES.GOAL.CREATE || params.action === POPUP_STATES.GOAL.UPDATE) && (
              <GoalUpsertPopup />
            )}
            {params.action === POPUP_STATES.GOAL.DELETE && <DeleteGoalPopup />}
          </>
        )}
      </div>
    </div>
  );
}

export default Popup;
export const POPUP_STATES = {
  USER: {
    TITLE: "user",
    LOGIN: "login",
    REGISTER: "register",
  },
  GOAL: {
    TITLE: "goal",
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
  },
  TRANSACTION: {
    TITLE: "transaction",
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete"
  },
};
