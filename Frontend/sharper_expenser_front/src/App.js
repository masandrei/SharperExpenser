import "./App.css";
import { Route, Routes } from "react-router-dom";
import Overview from "./Components/Overview/Overview.js";
import Navbar from "./Components/Navbar/Navbar.jsx";
import TransactionList from "./Components/TransactionList/TransactionList.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import Goals from "./Components/Goals/Goals.jsx";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Overview/>} />
        <Route path="/transactions" element={<TransactionList/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/goals" element={<Goals/>}/>
      </Routes>
    </div>
  );
}

export default App;
