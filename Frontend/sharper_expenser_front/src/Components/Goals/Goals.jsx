import axios from "axios";

import React, { useCallback, useEffect, useState, useContext } from "react";
import "./Goals.css";
import ProgressLine from "../ProgressLine/ProgressLine";
import { popupContext } from "../../storage/ContextStorage";

function Goals() {
  const [goalsList, setGoalsList] = useState([]);
  const [finishedGoalsList, setFinishedGoalsList] = useState([]);
  const [isFinishedSection, setIsFinishedSection] = useState(false);
  const {currentGoal, setCurrentGoal} = useContext(popupContext)
  const increasePriority = useCallback(
    (event) => {
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
            ExchangeRate: 1,
          },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
            },
          }
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
    (event) => {
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
            ExchangeRate: 1,
          },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
            },
          }
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

  const generatePercentages = useCallback((goal) => {
    return [
      {
        percentage: `${
          ((goal.amountAtTheStartOfMonth + Math.min(0, goal.additionalAmount)) /
            goal.moneyToGather) *
          100
        }%`,
        backgroundColor: "#4C9900",
      },
      {
        percentage: `${
          ((goal.additionalAmount > 0
            ? Math.min(
                goal.additionalAmount,
                goal.moneyToGather - goal.amountAtTheStartOfMonth
              )
            : Math.min(
                Math.abs(goal.additionalAmount),
                goal.amountAtTheStartOfMonth
              )) /
            goal.moneyToGather) *
          100
        }%`,
        backgroundColor: goal.additionalAmount > 0 ? "#66FF66" : "#990000",
      },
    ];
  });

  useEffect(() => {
    axios
      .get("http://localhost:5266/goals", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
        },
      })
      .then((response) => {
        const newGoals = response.data.filter((goal) => !goal.isFinished);
        const newFinishedGoals = response.data.filter(
          (finishedGoal) => finishedGoal.isFinished
        );
        console.log(response.data);
        setGoalsList([...goalsList, ...newGoals]);
        setFinishedGoalsList([...finishedGoalsList, ...newFinishedGoals]);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="goals-component">
      <div className="category-selector">
        <label onClick={() => setIsFinishedSection(false)}>Arranged</label>
        <label onClick={() => setIsFinishedSection(true)}>Finished</label>
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
                      goal.moneyToGather && <button>{"\u2713"}</button>}
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

                  <button>{isFinishedSection ? "\u232B" : "\u270E"}</button>
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
                    {goal.additionalAmount}
                  </div>
                )}
                /{goal.moneyToGather} {goal.currency}
              </div>
              <div>
                <ProgressLine
                  backgroundColor="lightgrey"
                  visualParts={generatePercentages(goal)}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Goals;
