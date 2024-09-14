using Coravel.Invocable;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.CompilerServices;

namespace SharperExpenser.Services.Misc;
public class CurrencyService : ICurrencyService
{
    private readonly HttpClient _httpClient = new HttpClient();
    private readonly Dictionary<string, decimal> UsdExchangeRatesForToday;
    private const string ApiKey = "SOMETHING";
    public CurrencyService(IWebHostEnvironment env)
    {
        string _path = Path.Combine(env.ContentRootPath, "Data", "Currencies.json");
        string json = File.ReadAllText(_path);
        IEnumerable<string> CurrencyCodes = JsonSerializer.Deserialize<IEnumerable<string>>(json);
        UsdExchangeRatesForToday = CurrencyCodes.ToDictionary(key => key, key => -1M);
        var task = new GetExchangeRatesTask(_httpClient, this);
    }
    public async Task<decimal> GetExchangeRate(DateTime ConvertDate, string CurrencyFrom, string CurrencyTo = "USD")
    {
        if (CurrencyFrom == CurrencyTo)
        {
            return 1;
        }
        if(ConvertDate.Date == DateTime.Today)
        {
            return 1M / UsdExchangeRatesForToday[$"CurrencyFrom"]
                * (CurrencyTo == "USD" ? 1M : UsdExchangeRatesForToday[$"{CurrencyTo}"]);
        }
        string url = $"http://api.currencylayer.com/historical?access_key={ApiKey}&date={ConvertDate:yyyy-MM-dd}&source={CurrencyFrom},{CurrencyTo}&format=1";

        var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                return -1;
            }
            var responseData = response.Content.ReadAsStringAsync().Result;
            JObject json = JObject.Parse(responseData);

            var rates = json["quotes"];
            decimal usdRate = 1M / rates[$"{CurrencyFrom}"].ToObject<decimal>();
            if (CurrencyTo != "USD")
            {
                return usdRate * rates[$"{CurrencyTo}"].ToObject<decimal>();
            }
            return usdRate;
    }

    public void UpdateExchangeRates(Dictionary<string, decimal> newExchangeRates)
    {
        foreach(var (key, value) in UsdExchangeRatesForToday)
        {
            if(newExchangeRates.ContainsKey(key))
            {
                UsdExchangeRatesForToday[key] = newExchangeRates[key];
            }
            else
            {
                UsdExchangeRatesForToday[key] = -1;
            }
        }
    }
}

public class GetExchangeRatesTask : IInvocable
{
    private readonly HttpClient _httpClient;
    private readonly ICurrencyService _currencyService;
    private const string ApiKey = "SOMETHING";
    public GetExchangeRatesTask(HttpClient httpClient, ICurrencyService currencyService)
    {
        _httpClient = httpClient;
        _currencyService = currencyService;
    }

    public async Task Invoke()
    {
        Console.WriteLine("Invoke started");
        string url = $"http://api.currencylayer.com?access_key={ApiKey}";

        var response = _httpClient.GetAsync(url).Result;
        if (response.IsSuccessStatusCode)
        {
            return;
        }
        var responseData = await response.Content.ReadAsStringAsync();
        JObject json = JObject.Parse(responseData);
        if (json == null || json["quotes"] == null)
        {
            return;
        }
        var dict = json["quotes"].ToObject<Dictionary<string, decimal>>();
        _currencyService.UpdateExchangeRates(dict);
    }
}
