import { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { popupContext } from "../../../../storage/ContextStorage";

import "./GoalPopup.css";
const defaultFormData = {
  id: 0,
  goalName: "",
  moneyToGather: 0,
  currency: ""
};

const GoalUpsertPopup = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const {
    popupState,
    setPopupState,
    currentGoal,
    setCurrentGoal,
    chosenGoal,
    setChosenGoal,
  } = useContext(popupContext);
  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...chosenGoal,
    });
  }, [chosenGoal]);

  async function submitData(e) {
    e.preventDefault();
    if (chosenGoal === null) {
      axios
        .post(
          "http://localhost:5266/goals",
          { ...formData },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setPopupState({action: "closed", entity: null});
          setChosenGoal(null);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios
        .put(
          "http://localhost:5266/goals",
          { ...formData },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
              accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setPopupState({action: "closed", entity: null});
          setChosenGoal(null);
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
            {popupState === "update" ? (
              chosenGoal.currency
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
              setPopupState({action:"closed", entity:null});
              setChosenGoal(null);
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
