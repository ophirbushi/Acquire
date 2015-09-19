using System.Collections.Generic;

namespace Acquire
{
    public interface IOutput
    {
        void PlayerList(List<Player> players);
        void PlayerReceivedCard(Player player, TileCard card, DidPlayerReceiveCard didPlayerReceiveCard);
        void ClosestToA1(Player closestToA1);
        void PlayerPutsCard(Player player, TileCard card, TileCardEffect effect, Hotel involvedHotel);
        void ReplaceCard(Player player, TileCard card);
        void CanPlayerBuyStocks(Player player, IsPlayerAbleToBuyStocks isPlayerAbleToBuyStocks);
        void PlayerBuysStocks(List<StockPurchase> playerStockDecisions);
        void ShowWinner(List<Player> players);
        void PlayerStockDecision(Player player, StockDecision decision);
        void PlayerSetsUpHotel(Player player, Hotel setUpHotel);
        void NewTurn(Player currentPlayer);
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
