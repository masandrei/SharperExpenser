import Cookies from "js-cookie";
import { useEffect, useContext } from "react";
import { popupContext } from "../../storage/ContextStorage";
import { Route } from "react-router-dom";

export const getAccessToken = () => Cookies.get("access_token");
export const getRefreshToken = () => Cookies.get("refresh_token");
export const isAuthenticated = !!getAccessToken();

export const AuthRoute = ({ children }) => {
  const { popupState, setPopupState } = useContext(popupContext);
  useEffect(() => {
    if (!getAccessToken()) {
      setPopupState({ action: "login", entity: "user" });
    }
  }, []);

  return children;
};
