import { useContext, useState, useEffect, useCallback } from "react";
import { popupContext } from "../../../../storage/ContextStorage";

import "./GoalPopup.css";
import goalCalls from "../../../../lib/apiCalls/goalCalls";
import { POPUP_STATES } from "../../Popup";
const defaultFormData = {
  id: 0,
  goalName: "",
  moneyToGather: 0,
  currency: "",
};

const GoalUpsertPopup = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const { setOpen, params, togglePopup } = useContext(popupContext);
  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...params.chosenGoal,
    });
  }, [params.chosenGoal]);

  async function submitData(e) {
    e.preventDefault();
    if (params.chosenGoal === null) {
      goalCalls
        .createGoal({ ...formData })
        .then((response) => {
          togglePopup({});
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      goalCalls
        .updateGoal({ ...formData })
        .then(() => {
          togglePopup({});
          setOpen(false);
        })
        .catch((err) => console.log(err.response));
    }
  }

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData]
  );
  return (
    <div>
      <form>
        <div className="input">
          <div className="input-block">
            <label htmlFor="goal-name">Name: </label>
            <input
              type="text"
              minLength="1"
              maxLength="50"
              value={formData.goalName}
              onChange={handleInputChange}
              name="goalName"
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="transaction-amount">Money to gather:</label>
            <input
              type="number"
              name="moneyToGather"
              step="0.01"
              max="99999999.99"
              value={formData.moneyToGather}
              onChange={handleInputChange}
              required
            />
            {params.action === POPUP_STATES.GOAL.UPDATE ? (
              params.chosenGoal.currency
            ) : (
              <select
                id="goal-currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            )}
          </div>
        </div>
        <div className="buttons">
          <button type="submit" onClick={submitData}>
            Submit
          </button>
          <button
            onClick={() => {
              togglePopup({});
              setOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalUpsertPopup;
