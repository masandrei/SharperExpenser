import axios from "axios";

class goalCalls {
  static deleteGoal(data) {
    return axios.delete("http://localhost:5266/goals", {
      withCredentials: true,
      data,
    });
  }

  static createGoal(data) {
    return axios.post("http://localhost:5266/goals", data, {
      withCredentials: true,
    });
  }

  static updateGoal(data) {
    return axios.put("http://localhost:5266/goals", data, {
      withCredentials: true,
    });
  }
}

export default goalCalls;
