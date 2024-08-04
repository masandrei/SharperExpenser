import {useEffect, useState, useMemo} from 'react';
import {Chart, ArcElement, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import axios from 'axios';
import './ExpensesOverview.css'

const colors = [ "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6347", "#7CFC00", "#FFD700", "#DC143C", "#00BFFF", "#8A2BE2", "#FF4500", "#2E8B57", "#8B4513", "#1E90FF", "#FF1493", "#00CED1", "#FF69B4", "#ADFF2F", "#FFA07A", "#20B2AA", "#778899", "#FFB6C1", "#4682B4"];
Chart.register(ArcElement, Tooltip);
//Chart.register(changeTextOnHoverPlugin);
function formatToDataObject(data){
    const dataLabels = [...Object.keys(data)];
    const dataSums = [...Object.values(data)];
    return {
        labels: dataLabels,
        datasets: [
            {
                data: dataSums,
                backgroundColor: colors.slice(0, dataSums.length),
                total: data.total || 0
            }
        ]
    }
}
function ExpensesOverview()
{
    const [expensesThisMonth, setExpensesThisMonth] = useState({});
    const [incomeThisMonth, setIncomeThisMonth] = useState({});
    const [currencies, setCurrencies] = useState(new Set());
    const [chosenCurrency, setChosenCurrency] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5266/transaction/currencies', {
            headers:{
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzIyMzYxNDk2LCJleHAiOjE3MjM2NTc0OTYsImlhdCI6MTcyMjM2MTQ5Nn0.9Ak8d2bRtWvtopBmKTISSqP8RBgfsdv2ER5gHbtV6pk'
            }
        })
        .then(response => {setCurrencies(response.data)})
    }, []);

    useEffect(() => {
        if(chosenCurrency == 'default-currency-value')
            return;
        axios.get(`http://localhost:5266/transaction/report?Currency=${chosenCurrency}&DateFrom=${new Date().getFullYear()}-${new Date().getMonth()}-01`,{
            headers:{
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibmJmIjoxNzIyMzYxNDk2LCJleHAiOjE3MjM2NTc0OTYsImlhdCI6MTcyMjM2MTQ5Nn0.9Ak8d2bRtWvtopBmKTISSqP8RBgfsdv2ER5gHbtV6pk'
            }
        })
        .then(response => {
            console.log(response);
            setExpensesThisMonth(response.data.expenses);
            setIncomeThisMonth(response.data.incomes);
            const expenseChart = Chart.getChart("expense-chart");
            if (expenseChart) {
                expenseChart.config._config.data = formatToDataObject(response.data.expenses);
                expenseChart.update();
            }
            const incomesChart = Chart.getChart("incomes-chart");
            if (incomesChart) {
                incomesChart.config._config.data = formatToDataObject(response.data.incomes);
                incomesChart.update();
            }
        })
        
    }, [chosenCurrency]);

    const expenseData = useMemo(() => formatToDataObject(expensesThisMonth, chosenCurrency), [expensesThisMonth, chosenCurrency]);
    const incomeData = useMemo(() => formatToDataObject(incomeThisMonth, chosenCurrency), [incomeThisMonth, chosenCurrency]);
    return(
        <div className="expense-overview">
            <div style={{display:'flex', flexDirection:'row', flexGrow:1, justifyContent:'center'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {expensesThisMonth?.total < 0 && <Doughnut id="expense-chart" style={{padding:'20px'}} data={expenseData} options={{}}/>}
                    <span style={{color:'yellow', position:'absolute'}}>Hello</span>
                </div>
                
                {incomeThisMonth?.total > 0 && <Doughnut id="incomes-chart" style={{padding:'20px'}} data={incomeData} options={{}}/>}
            </div>
            
            <div style={{display:'flex', flexDirection:'column', minWidth:'25%'}}>
                <select id="select-currency" onChange={(e) => {setChosenCurrency(e.target.value)}}>
                    <option key='choose-currency' value='default-currency-value'>Choose currency</option>
                    {[...currencies].map((elem, index) => <option key={index} value={elem}>{elem}</option>)}
                </select>
                <div style={{marginTop:'auto'}}>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div style={{font:'bold 20px sans-serif', color:'rgb(255,255,255)'}}>Expenses:</div>
                        <div style={{marginLeft:'auto', color:expensesThisMonth[chosenCurrency]?.total < 0 ? 'rgb(200,0,0)': '', font:'20px sans-serif'}}>{expensesThisMonth[chosenCurrency]?.total || '-'}</div>
                    </div>
                    <hr/>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div style={{font:'bold 20px sans-serif', color:'rgb(255,255,255)'}}>Income:</div>
                        <div style={{marginLeft:'auto', color:incomeThisMonth[chosenCurrency]?.total > 0 ? 'rgb(0,200,0)': '', font:'20px sans-serif'}}>{incomeThisMonth[chosenCurrency]?.total || '-'}</div>
                    </div>
                    <hr style={{height: '5px', backgroundColor:'#FFFFFF'}}/>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div style={{font:'bold 30px sans-serif', color:'rgb(255,255,255)'}}>Total:</div>
                        <div style={{marginLeft:'auto', color:'rgb(255,255,255', margin:'auto', marginRight:'0px', font:'20px sans-serif'}}>{0} {chosenCurrency || ''}</div>
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
}

export default ExpensesOverview;