using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;

namespace Acquire
{
    public interface IInput
    {
        object GetInput(string methodName, List<object> args);

        List<StockPurchase> GetSelectedStocks(Player player);

        StockDecision GetStockDecision(Player player, Hotel mergingHotel, Hotel mergerHotel);

        void ShowWinner();
    }

}
