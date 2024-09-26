import axios from "axios";
import { useContext, useEffect } from "react";
import { popupContext } from "../../../storage/ContextStorage";
import ProgressLine from "../../ProgressLine/ProgressLine";
import "./CurrentGoalOverview.css";

function CurrentGoalOverview() {
  const { currentGoal, setCurrentGoal } = useContext(popupContext);
  useEffect(() => {
    axios
      .get("http://localhost:5266/goals/active", {
        withCredentials: true,
      })
      .then((response) => {
        setCurrentGoal(response.data);
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className="goal-overview">
      <div>Goal progress overview</div>
      {currentGoal && (
        <div className="goal-item-active">
          <div className="goal-name">{currentGoal?.goalName}</div>
          <div className="progress-label">
            {currentGoal?.amountAtTheStartOfMonth}
            {currentGoal?.additionalAmount != 0 && (
              <div
                className="goal-change-this-month"
                style={{
                  color:
                    currentGoal?.additionalAmount > 0 ? "#66FF66" : "#990000",
                }}
              >
                ({currentGoal?.additionalAmount})
              </div>
            )}
            /{currentGoal?.moneyToGather} {currentGoal?.currency}
          </div>
          <div>
            <ProgressLine backgroundColor="lightgrey" data={currentGoal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentGoalOverview;
