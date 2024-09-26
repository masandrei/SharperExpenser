import axios from "axios";

class userCalls {
  static loginUser(data) {
    return axios.post("http://localhost:5266/user/login", data);
  }

  static registerUser(data) {
    return axios.post("http://localhost:5266/user/register", data);
  }
}

export default userCalls;
