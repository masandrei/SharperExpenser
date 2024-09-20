import axios from "axios";

const apiKey = "c8979cbd190a6362aa4e8a2f04afcd52";

class CurrencyService{
    static async GetExchangeRate(convertDate, currencyFrom, currencyTo){
        if(currencyFrom == currencyTo){
            return 1;
        }
        return await axios.get("http://api.currencylayer.com/historical",{
            params:{
                access_key: apiKey,
                date: convertDate,
                currencies: `${currencyFrom}, ${currencyTo}`
            }
        })
        .then(response => {

        })
        .catch(err => console.error(err));
    }
}