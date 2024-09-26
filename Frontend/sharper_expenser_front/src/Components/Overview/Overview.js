import ExpensesOverview from "./ExpensesOverView/ExpensesOverview";
import CurrentGoalOverview from "./CurrentGoalOverview/CurrentGoalOverview";

import "./Overview.css";
import TransactionList from "../TransactionList/TransactionList";

function Overview() {

  return (
    <div className="flex-container">
      <div className="column" style={{ width: "60%" }}>
        <ExpensesOverview />
        <CurrentGoalOverview />
      </div>
      <div className="column" style={{ width: "30%" }}>
        <TransactionList isShorten={true}/>
      </div>
    </div>
  );
}

export default Overview;
