using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Acquire
{
    public interface IOutput
    {
        void PlayerList(List<Player> players);
        void PlayerReceivedCard(Player player, TileCard card, DidPlayerReceiveCard didPlayerReceiveCard);
        void ClosestToA1(Player closestToA1);
        void PlayerPutsCard(Player player, TileCard card, TileCardEffect effect, Hotel involvedHotel);
        void ReplaceCard(Player player, TileCard card);
        void CanPlayerBuyStocks(IsPlayerAbleToBuyStocks isPlayerAbleToBuyStocks);
        void PlayerBuysStocks(List<StockPurchase> playerStockDecisions);
        void ShowWinner(List<Player> players);
        void PlayerStockDecision(StockDecision decision);
    }

    public enum IsPlayerAbleToBuyStocks
    {
        CanBuy,
        NoAvailableStocks,
        NotEnoughMoney
    }

    public enum DidPlayerReceiveCard
    {
        Received,
        BankIsEmpty,
        PlayerDidNotPutCardThisTurn
    }
}
