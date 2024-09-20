using SharperExpenser.Models;

namespace SharperExpenser.Services.Interfaces;
public interface ISubject
{
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    void Notify(Transaction? oldTransaction, Transaction? newTransaction, decimal newExchangeRate, decimal oldExchangeRate);
}
