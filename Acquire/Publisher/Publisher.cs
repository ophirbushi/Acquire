using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Acquire
{
    public class Publisher : IOutput
    {

        StringBuilder _sb = new StringBuilder();
        string _filePath = @"c:\users\ophir\desktop\gamelog.txt";

        public Publisher()
        {
            File.Create(_filePath).Close();
        }

        private void Log(string message)
        {
            using (var sw = new StreamWriter(_filePath, true))
            {
                sw.WriteLine(message);
            }
        }

        private GameState SaveState(StepInPlayerTurn stepInPlayerTurn)
        {
            var gameState = new GameState
            {
                StepInTurn = stepInPlayerTurn,
                Players = GameManager.Players,
                CurrentPlayer = GameManager.CurrentPlayer,
                TileList = Board.TileList,
                TileGroups = Board.TileGroups,
                //PointGroupDictionary = Board.PointGroupDictionary,
                TileCardBank = BoardManager.TileCardBank,
                HotelsList = HotelsManager.HotelsList,
               // HotelNameHotelDictionary = HotelsManager.HotelNameHotelDictionary,
                StockBank = HotelsManager.StockBank,
            };
            XmlHandler.SerializeGameState(gameState);
            return gameState;
        }

        public void NewTurn(Player currentPlayer)
        {
            Log(string.Format("{0}: It is {1}'s turn", nameof(NewTurn), currentPlayer));
            SaveState(StepInPlayerTurn.NewTurn);
        }

        public void CanPlayerBuyStocks(Player player, IsPlayerAbleToBuyStocks isPlayerAbleToBuyStocks)
        {
            Log(string.Format("{0}: {1} - {2}", nameof(CanPlayerBuyStocks), player, isPlayerAbleToBuyStocks));
        }

        public void ClosestToA1(Player closestToA1)
        {
            Log(string.Format("{0}: {1}", nameof(ClosestToA1), closestToA1));
        }

        public void PlayerBuysStocks(List<StockPurchase> playerStockDecisions)
        {

        }

        public void PlayerList(List<Player> players)
        {
            _sb.AppendFormat("{0}: ", nameof(PlayerList));
            foreach (var p in players)
            {
                _sb.AppendFormat("{0}, ", p);
            }
            _sb.Remove(_sb.Length - 2, 2);
            Log(_sb.ToString());
            _sb.Clear();
        }

        public void PlayerPutsCard(Player player, TileCard card, TileCardEffect effect, Hotel involvedHotel)
        {
            Log(string.Format("{0}: {1} puts {2}", nameof(PlayerPutsCard), player, card));
        }

        public void PlayerReceivedCard(Player player, TileCard card, DidPlayerReceiveCard didPlayerReceiveCard)
        {
            if (didPlayerReceiveCard == DidPlayerReceiveCard.Received && card != null)
            {
                Log(string.Format("{0}: {1} received {2}", nameof(PlayerReceivedCard), player, card));
            }
            else
            {
                Log(string.Format("{0}: {1} did not take a card, reason - {2}", nameof(PlayerReceivedCard), player, didPlayerReceiveCard));
            }
        }

        public void ReplaceCard(Player player, TileCard card)
        {

        }

        public void ShowWinner(List<Player> players)
        {

        }

        public void PlayerStockDecision(Player player, StockDecision decision)
        {

        }

        public void PlayerSetsUpHotel(Player player, Hotel setUpHotel)
        {
            Log(string.Format("{0}: {1} sets up {2}", nameof(PlayerSetsUpHotel), player, setUpHotel));
        }
    }
}
