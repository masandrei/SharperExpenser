import axios from "axios";

import React, { useCallback, useEffect, useState, useContext } from "react";
import "./Goals.css";
import ProgressLine from "../ProgressLine/ProgressLine";
import { popupContext } from "../../storage/ContextStorage";
import CurrencyService from "../../lib/CurrencyService.js";

function Goals() {
  const [goalsList, setGoalsList] = useState([]);
  const [finishedGoalsList, setFinishedGoalsList] = useState([]);
  const [isFinishedSection, setIsFinishedSection] = useState(false);
  const {
    currentGoal,
    setCurrentGoal,
    popupState,
    setPopupState,
    setChosenGoal,
  } = useContext(popupContext);
  const addGoal = () => {
    if (goalsList.length === 5) {
      return;
    }
    setPopupState({ action: "create", entity: "goal" });
  };

  const openPopup = useCallback(
    (event) => {
      const [action, id, type] = event.target.id.split("-");
      setChosenGoal(
        type === "finished" ? goalsList[id] : finishedGoalsList[id]
      );
      setPopupState({ action, entity: "goal" });
    },
    [goalsList, finishedGoalsList]
  );
  const finishGoal = async (event) => {
    axios
      .put(
        "http://localhost:5266/goals/finish",
        {
          Id: currentGoal.id,
          ExchangeRate:
            goalsList.length > 1
              ? await CurrencyService.getExchangeRateRequest(
                  new Date(),
                  currentGoal.currency,
                  goalsList[1].currency
                )
              : 1,
        },
        { withCredentials: true }
      )
      .then((response) => {
        const updatedGoals = [...goalsList];
        updatedGoals.shift();
        setGoalsList(updatedGoals);
      })
      .catch((err) => console.error(err));
  };
  // const deleteGoal = useCallback(
  //   async (event) => {
  //     const listItemIndex = Number.parseInt(event.target.value);
  //     const updatedList = isFinishedSection
  //       ? [...finishedGoalsList]
  //       : [...goalsList];
  //   },
  //   [goalsList]
  // );
  const increasePriority = useCallback(
    async (event) => {
      const listItemIndex = Number.parseInt(event.target.value);

      const updatedGoalsList = [...goalsList];
      const goalToUpdate = updatedGoalsList[listItemIndex];
      const goalAbove = updatedGoalsList[listItemIndex - 1];

      axios
        .put(
          "http://localhost:5266/goals",
          {
            Id: goalToUpdate.id,
            UpdatePriority: goalAbove.priority,
            ExchangeRate:
              goalToUpdate === goalsList[1]
                ? await CurrencyService.getExchangeRateRequest(
                    new Date(),
                    currentGoal.currency,
                    goalsList[1].currency
                  )
                : 1,
          },
          { withCredentials: true }
        )
        .then((response) => {
          [
            updatedGoalsList[listItemIndex - 1],
            updatedGoalsList[listItemIndex],
          ] = [goalToUpdate, goalAbove];
          setGoalsList(updatedGoalsList);
          setCurrentGoal(goalsList[0]);
        });
    },
    [goalsList]
  );

  const decreasePriority = useCallback(
    async (event) => {
      const listItemIndex = Number.parseInt(event.target.value);
      const updatedGoals = [...goalsList];
      const goalToUpdate = updatedGoals[listItemIndex];
      const goalBelow = updatedGoals[listItemIndex + 1];
      axios
        .put(
          "http://localhost:5266/goals",
          {
            Id: goalToUpdate.id,
            UpdatePriority: goalBelow.priority,
            ExchangeRate:
              goalToUpdate === currentGoal
                ? await CurrencyService.getExchangeRateRequest(
                    new Date(),
                    currentGoal.currency,
                    goalsList[1].currency
                  )
                : 1,
          },
          { withCredentials: true }
        )
        .then((response) => {
          [updatedGoals[listItemIndex + 1], updatedGoals[listItemIndex]] = [
            updatedGoals[listItemIndex],
            updatedGoals[listItemIndex + 1],
          ];
          setGoalsList(updatedGoals);
          setCurrentGoal(goalsList[0]);
        });
    },
    [goalsList]
  );

  useEffect(() => {
    axios
      .get("http://localhost:5266/goals", { withCredentials: true })
      .then((response) => {
        const newGoals = response.data.filter((goal) => !goal.isFinished);
        const newFinishedGoals = response.data.filter(
          (finishedGoal) => finishedGoal.isFinished
        );
        console.log(response.data);
        setGoalsList([...goalsList, ...newGoals]);
        setFinishedGoalsList([...finishedGoalsList, ...newFinishedGoals]);
        setCurrentGoal(goalsList[0] || newGoals[0] || null);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="goals-component">
      <div className="goals-list-control-block">
        <div className="category-selector">
          <label onClick={() => setIsFinishedSection(false)}>Arranged</label>
          <label onClick={() => setIsFinishedSection(true)}>Finished</label>
        </div>
        <label onClick={addGoal}>Add</label>
      </div>
      <div className={isFinishedSection ? "goals-list-finished" : "goals-list"}>
        {(isFinishedSection ? finishedGoalsList : goalsList).map(
          (goal, index, array) => (
            <div
              className={index === 0 ? "goal-item-active" : "goal-item"}
              key={index}
            >
              <div className="goal-name-actions">
                <div className="goal-name">{goal.goalName}</div>
                <div className="actions">
                  {!isFinishedSection &&
                    goal.additionalAmount + goal.amountAtTheStartOfMonth >=
                      goal.moneyToGather && (
                      <button onClick={finishGoal}>{"\u2713"}</button>
                    )}
                  {!isFinishedSection && (
                    <div className="set-priority-block">
                      {index !== 0 && (
                        <button value={index} onClick={increasePriority}>
                          {"\u2191"}
                        </button>
                      )}
                      {index !== array.length - 1 && (
                        <button value={index} onClick={decreasePriority}>
                          {"\u2193"}
                        </button>
                      )}
                    </div>
                  )}
                  <label
                    id={`delete-${index}-${
                      isFinishedSection ? "finished" : ""
                    }`}
                    onClick={openPopup}
                  >
                    {"\u232B"}
                  </label>
                  {!isFinishedSection && (
                    <label id={`update-${index}`} onClick={openPopup}>
                      {"\u270E"}
                    </label>
                  )}
                </div>
              </div>
              <div className="progress-label">
                {goal.amountAtTheStartOfMonth}
                {goal.additionalAmount != 0 && (
                  <div
                    className="goal-change-this-month"
                    style={{
                      color: goal.additionalAmount > 0 ? "#66FF66" : "#990000",
                    }}
                  >
                    ({goal.additionalAmount})
                  </div>
                )}
                /{goal.moneyToGather} {goal.currency}
              </div>
              <div>
                <ProgressLine backgroundColor="lightgrey" data={goal} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Goals;
