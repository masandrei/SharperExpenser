import Cookies from "js-cookie";
import { useContext, useState, useCallback } from "react";
import axios from "axios";
import { popupContext } from "../../../../storage/ContextStorage";

const defaultFormData = {
  email: "",
  password: "",
};

const LoginUserPopup = () => {
  const { setPopupState } = useContext(popupContext);
  const [formData, setFormData] = useState(defaultFormData);
  const [isValidData, setIsValidData] = useState(true);

  async function submitData(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5266/user", formData)
      .then((response) => {
        Cookies.set("access_token", response.data.accessToken, {maxAge: 86400});
        setPopupState({action: "closed", entity: null});
      })
      .catch((err) => {
        if(err.response.status === 403){
            setIsValidData(false);
        }
      });
  }

  const handleInputChange = useCallback(
    (e) => {
        setIsValidData(true);
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
            <label htmlFor="user-email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="user-password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        {!isValidData && <label className="invalid-data-message">Wrong email or password</label>}
        <button type="submit" onClick={submitData}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginUserPopup;
