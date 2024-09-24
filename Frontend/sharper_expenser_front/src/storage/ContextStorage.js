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
  const [chosenTransaction, setChosenTransaction] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);

  return (
    <popupContext.Provider
      value={{ isOpen, setOpen, chosenTransaction, setChosenTransaction, currentGoal, setCurrentGoal }}
    >
      {children}
    </popupContext.Provider>
  );
};

export { PopupProvider, popupContext };
