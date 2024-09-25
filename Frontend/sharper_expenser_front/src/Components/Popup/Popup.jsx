import React, { useState, useContext, useEffect, useCallback } from "react";

import "./Popup.css";
import { popupContext } from "../../storage/ContextStorage";
import TransactionUpsertPopup from "./Subpopups/TransactionPopup/TransactionUpsertPopup";
import DeleteTransactionPopup from "./Subpopups/TransactionPopup/DeleteTransactionPopup";
import GoalUpsertPopup from "./Subpopups/GoalPopups/GoalUpsertPopup";
import DeleteGoalPopup from "./Subpopups/GoalPopups/GoalDeletePopup";
import LoginUserPopup from "./Subpopups/UserPopups/LoginUserPopup.jsx";

function Popup() {
  const { popupState } = useContext(popupContext);
  return (
    popupState.action !== "closed" && (
      <div className="Popup">
        <div className="popup-inner">
          {popupState.entity === "user" && (
            <>
              {popupState.action === "login" && <LoginUserPopup/>}
            </>
          )}
          {popupState.entity === "transaction" && (
            <>
              {(popupState.action === "create" ||
                popupState.action === "update") && <TransactionUpsertPopup />}
              {popupState.action === "delete" && <DeleteTransactionPopup />}
            </>
          )}
          {popupState.entity === "goal" && (
            <>
              {(popupState.action === "create" ||
                popupState.action === "update") && <GoalUpsertPopup />}
              {popupState.action === "delete" && <DeleteGoalPopup />}
            </>
          )}
        </div>
      </div>
    )
  );
}

export default Popup;
