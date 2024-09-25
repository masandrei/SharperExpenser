import { useContext } from "react";
import { popupContext } from "../../../../storage/ContextStorage";
import axios from "axios";

import "./GoalPopup.css"

const DeleteGoalPopup = () => {
  const { popupState, setPopupState, chosenGoal, setChosenGoal } =
    useContext(popupContext);

  const deleteGoal = () => {
    axios
      .delete("http://localhost:5266/goals", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
        },
        data: {
          id: chosenGoal.id,
          exchangeRate: 1,
        },
      })
      .then((response) => {
        setPopupState({action: "closed", entity: null});
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="popup-delete-goal">
      <div>Are you sure, you want to delete this goal?</div>
      <div className="buttons">
        <button onClick={deleteGoal}>Delete</button>
        <button
          onClick={() => {
            setPopupState({action: "closed", entity: null});
            setChosenGoal(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteGoalPopup;
