import { useEffect, useState, useMemo } from "react";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import "./ExpensesOverview.css";

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6347",
  "#7CFC00",
  "#FFD700",
  "#DC143C",
  "#00BFFF",
  "#8A2BE2",
  "#FF4500",
  "#2E8B57",
  "#8B4513",
  "#1E90FF",
  "#FF1493",
  "#00CED1",
  "#FF69B4",
  "#ADFF2F",
  "#FFA07A",
  "#20B2AA",
  "#778899",
  "#FFB6C1",
  "#4682B4",
];
Chart.register(ArcElement, Tooltip);
function formatToDataObject(data) {
  const dataLabels = [...Object.keys(data)];
  const dataSums = [...Object.values(data)];
  return {
    labels: dataLabels,
    datasets: [
      {
        data: dataSums,
        backgroundColor: colors.slice(0, dataSums.length),
        total: data.total || 0,
      },
    ],
  };
}
function ExpensesOverview() {
  const [expensesThisMonth, setExpensesThisMonth] = useState({});
  const [incomeThisMonth, setIncomeThisMonth] = useState({});
  const [currencies, setCurrencies] = useState(new Set());
  const [chosenCurrency, setChosenCurrency] = useState(null);

  const expenseData = useMemo(() => {
    Object.defineProperty(expensesThisMonth, "total", { enumerable: false });
    return formatToDataObject(expensesThisMonth);
  }, [expensesThisMonth, chosenCurrency]);
  const incomeData = useMemo(() => {
    Object.defineProperty(incomeThisMonth, "total", { enumerable: false });
    return formatToDataObject(incomeThisMonth);
  }, [incomeThisMonth, chosenCurrency]);

  useEffect(() => {
    const currentDate = new Date();
    axios
      .get("http://localhost:5266/transaction/currencies", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
        },
        params: {
          DateFrom: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`
        }
      })
      .then((response) => {
        setCurrencies(response.data);
      });
  }, []);

  useEffect(() => {
    if (chosenCurrency == "default-currency-value") return;
    const currentDate = new Date();
    axios
      .get(
        `http://localhost:5266/transaction/report?Currency=${chosenCurrency}&DateFrom=${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzI2NzU4MDA2LCJleHAiOjE3MjgwNTQwMDYsImlhdCI6MTcyNjc1ODAwNn0.9gxCKhgM1tucAm1eQr9ANMIOnM8ReXy-6rBqx_-vang",
          },
        }
      )
      .then((response) => {
        setExpensesThisMonth(response.data.expenses);
        setIncomeThisMonth(response.data.incomes);
        const expenseChart = Chart.getChart("expense-chart");
        if (expenseChart) {
          expenseChart.config._config.data = expenseData;
          expenseChart.update();
        }
        const incomesChart = Chart.getChart("incomes-chart");
        if (incomesChart) {
          incomesChart.config._config.data = incomeData;
          incomesChart.update();
        }
      });
  }, [chosenCurrency]);

  return (
    <div className="expense-overview">
      <div className="centered-flex-container">
        {expensesThisMonth?.total < 0 && (
          <div className="chart-container">
            <Doughnut id="expense-chart" data={expenseData} options={{}} />
            <label className="expense-label">Expenses</label>
          </div>
        )}

        {incomeThisMonth?.total > 0 && (
          <div className="chart-container">
            <Doughnut id="income-chart" data={incomeData} options={{}} />
            <label className="income-label">Incomes</label>
          </div>
        )}
      </div>

      <div className="currency-selector">
        <select
          id="select-currency"
          onChange={(e) => {
            setChosenCurrency(e.target.value);
          }}
        >
          <option key="choose-currency" value="">
            Choose currency
          </option>
          {[...currencies].map((elem, index) => (
            <option key={index} value={elem}>
              {elem}
            </option>
          ))}
        </select>
        <div className="data-box">
          <div className="data-row">
            <div className="bold-text">Expenses:</div>
            <div className="expense-value">
              {expensesThisMonth.total || "-"}
            </div>
          </div>
          <hr />
          <div className="data-row">
            <div className="bold-text">Income:</div>
            <div className="income-value">{incomeThisMonth.total || "-"}</div>
          </div>
          <hr />
          <div className="total-row">
            <div className="total-label">Total:</div>
            <div className="total-value">
              {(incomeThisMonth.total || 0) + (expensesThisMonth.total || 0)}{" "}
              {chosenCurrency || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesOverview;
