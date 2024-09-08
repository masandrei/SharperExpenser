import { useState, useEffect } from "react";
import axios from "axios";

import ExpensesOverview from "./ExpensesOverView/ExpensesOverview";
import LastTransactionsOverview from "./LastTransactionOverview/LastTransactionsOverview";
import CurrentGoalOverview from "./CurrentGoalOverview/CurrentGoalOverview";

import "./Overview.css";

function Overview() {

  return (
    <div className="flex-container">
      <div className="column" style={{ width: "60%" }}>
        <ExpensesOverview />
        <CurrentGoalOverview />
      </div>
      <div className="column" style={{ width: "30%" }}>
        <LastTransactionsOverview/>
      </div>
    </div>
  );
}

export default Overview;
