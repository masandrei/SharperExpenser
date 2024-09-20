import { createContext, useState } from "react";

const popupContext = createContext({
  isOpen: false,
  setOpen: () => {},
  chosenTransaction: {},
  setChosenTransaction: () => {},
  currentGoal: {},
  setCurrentGoal: () => {}
});

const PopupProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [chosenTransaction, setChosenTransaction] = useState({});
  const [currentGoal, setCurrentGoal] = useState({});

  return (
    <popupContext.Provider
      value={{ isOpen, setOpen, chosenTransaction, setChosenTransaction, currentGoal, setCurrentGoal }}
    >
      {children}
    </popupContext.Provider>
  );
};

export { PopupProvider, popupContext };
