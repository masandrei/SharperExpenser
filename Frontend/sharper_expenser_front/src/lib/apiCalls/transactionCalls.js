import axios from "axios";

class transactionCalls {
  static createTransaction(data) {
    return axios.post("http://localhost:5266/transaction", data, {
      withCredentials: true,
    });
  }

  static updateTransaction(data) {
    return axios.put("http://localhost:5266/transaction", data, {
      withCredentials: true,
    });
  }
  static deleteTransaction(data) {
    return axios.delete("http://localhost:5266/transaction", {
      withCredentials: true,
      data,
    });
  }

  static getTransactionPage(data) {
    return axios.get("http://localhost:5266/transaction", {
      withCredentials: true,
      params: data,
    });
  }
}

export default transactionCalls;
