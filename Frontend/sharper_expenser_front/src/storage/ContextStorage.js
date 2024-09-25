import { createContext, useState } from "react";

const popupContext = createContext({
  popupState: {},
  setPopupState: () => {},
  chosenTransaction: {},
  setChosenTransaction: () => {},
  currentGoal: {},
  setCurrentGoal: () => {},
  chosenGoal: {},
  setChosenGoal: () => {}
});

const PopupProvider = ({ children }) => {
  const [popupState, setPopupState] = useState({action: "closed", entity: null});
  const [chosenTransaction, setChosenTransaction] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [chosenGoal, setChosenGoal] = useState(null);

  return (
    <popupContext.Provider
      value={{ popupState, setPopupState, chosenTransaction, setChosenTransaction, currentGoal, setCurrentGoal, chosenGoal, setChosenGoal }}
    >
      {children}
    </popupContext.Provider>
  );
};

export { PopupProvider, popupContext };
