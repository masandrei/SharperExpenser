namespace SharperExpenser.Services.Misc;

public interface ICurrencyService
{
    Task<decimal> GetExchangeRate(DateTime ConvertDate, string CurrencyFrom, string CurrencyTo);
    void UpdateExchangeRates(Dictionary<string, decimal> ExchangeRates);
}
