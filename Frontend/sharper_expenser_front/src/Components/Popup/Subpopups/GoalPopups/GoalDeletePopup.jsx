import { useContext } from "react";
import { popupContext } from "../../../../storage/ContextStorage";

import "./GoalPopup.css";
import goalCalls from "../../../../lib/apiCalls/goalCalls";

const DeleteGoalPopup = async () => {
  const { setOpen, params, togglePopup } = useContext(popupContext);

  const deleteGoal = () => {
    goalCalls
      .deleteGoal({
        id: params.chosenGoal.id,
        exchangeRate: 1,
      })
      .then((response) => {
        togglePopup({});
        setOpen(false);
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

export default DeleteGoalPopup;
