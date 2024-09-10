using SharperExpenser.Models;

namespace SharperExpenser.Services.Interfaces;
public interface IObserver
{
    void Update(Transaction? oldTransaction, Transaction? newTransaction);
}
