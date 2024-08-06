import { useState, useEffect } from "react";
import axios from "axios";

import ExpensesOverview from "./ExpensesOverView/ExpensesOverview";
import LastTransactionsOverview from "./LastTransactionOverview/LastTransactionsOverview";
import CurrentGoalOverview from "./CurrentGoalOverview/CurrentGoalOverview";

import "./Overview.css";
import Popup from "../Popup/Popup";

function Overview() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  return (
    <div className="flex-container">
      <Popup isOpen={isPopupOpen} setOpen={setPopupOpen} />
      <div className="column" style={{ width: "60%" }}>
        <ExpensesOverview />
        <CurrentGoalOverview />
      </div>
      <div className="column" style={{ width: "30%" }}>
        <LastTransactionsOverview isOpen={isPopupOpen} setOpen={setPopupOpen} />
      </div>
    </div>
  );
}

export default Overview;
