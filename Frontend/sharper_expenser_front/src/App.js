import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthRoute } from "./Components/Authentication/Auth.jsx";
import Overview from "./Components/Overview/Overview.js";
import Navbar from "./Components/Navbar/Navbar.jsx";
import TransactionList from "./Components/TransactionList/TransactionList.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import Goals from "./Components/Goals/Goals.jsx";
import Popup from "./Components/Popup/Popup.jsx";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Popup />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <Overview />
            </AuthRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <AuthRoute>
              <TransactionList />
            </AuthRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <AuthRoute>
              <Categories />
            </AuthRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <AuthRoute>
              <Goals />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
