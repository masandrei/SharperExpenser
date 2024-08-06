import { createContext, useState } from "react";

const popupContext = createContext({
  isOpen: false,
  setOpen: () => {},
  chosenItem: {},
  setChosenItem: () => {},
});

const PopupProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [chosenItem, setChosenItem] = useState({});

  return (
    <popupContext.Provider
      value={{ isOpen, setOpen, chosenItem, setChosenItem }}
    >
      {children}
    </popupContext.Provider>
  );
};

export { PopupProvider, popupContext };
