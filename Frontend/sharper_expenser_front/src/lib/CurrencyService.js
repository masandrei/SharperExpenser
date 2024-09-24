import axios from "axios";

const apiKey = "c8979cbd190a6362aa4e8a2f04afcd52";

function dateToYMD(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

class CurrencyService {
  static async getExchangeRateRequest(convertDate, currencyFrom, currencyTo) {
    if (currencyFrom === currencyTo) {
      return 1;
    }
    return await axios
      .get("http://api.currencylayer.com/historical", {
        params: {
          access_key: apiKey,
          date: dateToYMD(convertDate),
          currencies: `${currencyFrom}, ${currencyTo}`,
        },
      })
      .then((response) => {
        const responseData = response.data;
        console.log(responseData);
        if(!responseData || !responseData.success){
          return -1;
        }
        const exchangeRates = responseData.quotes;
        const currencyFromConvertToUsdRate = currencyFrom === "USD" ? 1 :
          1 / exchangeRates[`USD${currencyFrom}`];
        const currencyToConvertFromUsdRate = currencyTo === "USD" ? 1 : exchangeRates[`USD${currencyTo}`];
        console.log(currencyFromConvertToUsdRate, currencyToConvertFromUsdRate);
        return currencyFromConvertToUsdRate * currencyToConvertFromUsdRate;
      })
      .catch((err) => {console.error(err); return -1;});
  }
}

export default CurrencyService;
