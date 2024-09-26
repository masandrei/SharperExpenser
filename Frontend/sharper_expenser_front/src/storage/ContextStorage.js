import { createContext, useState } from "react";

const popupContext = createContext({
  isOpen: {},
  setOpen: () => {},
  params: {},
  togglePopup: () => {},
  currentGoal: {},
  setCurrentGoal: () => {}
});

const PopupProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [params, togglePopup] = useState({});
  const [currentGoal, setCurrentGoal] = useState(null);

  return (
    <popupContext.Provider
      value={{ isOpen, setOpen, params, togglePopup, currentGoal, setCurrentGoal }}
    >
      {children}
    </popupContext.Provider>
  );
};

export { PopupProvider, popupContext };
