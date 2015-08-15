using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace Acquire
{
    /// <summary>
    /// The super class that controls the game flow.
    /// </summary>
    public static class GameManager
    {
        /// <summary>
        /// The input source from which it receives the players' decisions.
        /// </summary>
        public static IInput Input;

        /// <summary>
        /// This event is raised when a player finishes his turn.
        /// </summary>
        public static event EventHandler CurrentPlayerChanged;

        /// <summary>
        /// The list of the players in the game.
        /// </summary>
        public static List<Player> Players;

        /// <summary>
        /// The numbers of players.
        /// </summary>
        public static int NumberOfPlayers { get { return Players.Count; } }

        /// <summary>
        /// The player whose turn it is at the moment.
        /// </summary>
        private static Player _currentPlayer;

        /// <summary>
        /// The player whose turn it is at the moment.
        /// </summary>
        public static Player CurrentPlayer
        {
            get { return _currentPlayer; }
            private set
            {
                _currentPlayer = value;
                NotifyCurrentPlayerChanged();
            }
        }

        /// <summary>
        /// Signifies whether or not to end the game after the current player's turn.
        /// </summary>
        private static bool _gameEnding = false;


        #region Super Methods

        /// <summary>
        /// Initializes all the game aspects, and starts the game.
        /// </summary>
        /// <param name="input">The input source from which it receives the players' decisions.</param>
        public static void NewGame(IInput input)
        {
            Input = input;
            Hotel.Initialize();
            Board.Initialize();
            HotelsManager.Initialize();
            BoardManager.Initialize();
            InitPlayers();
            CurrentPlayer = DetermineStartingPlayer();
            Players.ForEach(p => BoardManager.GiveCards(p, 6));

            while (_gameEnding == false)
            {
                MakeMove();
            }

            EndGame();
        }

        private static void MakeMove()
        {
            bool cardWasPut = PutCardStage();
            BuyStocksStage();
            if (cardWasPut)
                TakeCardStage();
            if (IsGameEnd())
                _gameEnding = true;
            else
                CurrentPlayer = NextPlayer();
        }

        private static void EndGame()
        {
            Players.ForEach(p => p.StockBank.AllStocks.ForEach(stock => 
                HotelsManager.BuyStocksFromPlayer(p, 
                HotelsManager.HotelNameHotelDictionary[stock.HotelName], stock.Quantity)));
            Input.ShowWinner();
        }

        private static void InitPlayers()
        {
            Players = new List<Player> { new Player(), new Player(), new Player(), new Player() };            
        }

        private static bool IsGameEnd()
        {
            return BoardManager.PossibleEndGame() && CurrentPlayer.EndGame();
        }

        #endregion

        #region Main Stages

        private static bool PutCardStage()
        {
            TileCardEffect effect;
            bool replaceAble;
            if (CurrentPlayer.TileCardBank.TrueForAll(c =>
                BoardManager.GetEffect(c) == TileCardEffect.SetUp && 
                !IsCardLegal(c, out effect, out replaceAble)))
            {
                Announce("No legal cards");
                return false;
            }
            TileCard card = CurrentPlayer.SelectCard();
            while (!IsCardLegal(card, out effect, out replaceAble))
            {
                if (replaceAble)
                    BoardManager.ReplaceCard(CurrentPlayer, card);
                card = CurrentPlayer.SelectCard();
            }
            PutCardOnBoard(CurrentPlayer, card, effect, PrePuttingProcess(card, effect)); // BoardManager.HandleEffect(card, effect, PrePuttingProcess(card, effect));
            return true;
        }

        private static void BuyStocksStage()
        {
            if (PlayerCanBuyStocks())// && PlayerWantsToBuyStocks())
                PlayerBuyStocks();
        }

        private static bool PlayerCanBuyStocks()
        {
            bool canBuy = HotelsManager.ActiveHotels.Any(hotel => CurrentPlayer.Cash >= hotel.CurrentStockValue);
            if (!canBuy)
                GameManager.Announce("Not enough money to buy stocks.");
            return canBuy;
        }

        private static void TakeCardStage()
        {
            BoardManager.GiveCards(CurrentPlayer, 1);
        }

        #endregion

        #region Sub-Methods

        private static Player DetermineStartingPlayer()
        {
            foreach (Player p in Players)
                BoardManager.GiveCards(p, 1);

            // All players are supposed to have one card now.
            Debug.Assert(!Players.Any(p => p.TileCardBank.Count != 1));

            Player startingPlayer = ClosestToA1();

            foreach (Player p in Players)
                PutCardOnBoard(p, p.TileCardBank.First(), TileCardEffect.None, Hotel.Neutral); //BoardManager.HandleEffect(p.TileCardBank.First(), TileCardEffect.None, Hotel.Neutral);

            return startingPlayer;
        }

        private static void PutCardOnBoard(Player player, TileCard card, TileCardEffect effect, Hotel involvedHotel)
        {
            player.TileCardBank.Remove(card);
            BoardManager.HandleEffect(card, effect, involvedHotel);
        }

        private static Player ClosestToA1()
        {
            var playersAndDistances = Players.Select(player =>
                new
                {
                    P = player,
                    Distance = (float)((player.TileCardBank[0].X * player.TileCardBank[0].X) +
                    (player.TileCardBank[0].Y * player.TileCardBank[0].Y))
                });
            playersAndDistances = playersAndDistances.OrderBy(p => p.Distance).ToList();
            return playersAndDistances.First().P;
        }

        private static bool IsCardLegal(TileCard card, out TileCardEffect effect, out bool replaceAble)
        {
            effect = BoardManager.GetEffect(card);
            replaceAble = false;
            if (effect == TileCardEffect.Enlarge || effect == TileCardEffect.None)
                return true;
            else if (effect == TileCardEffect.SetUp)
                return HotelsManager.GetAvailableHotels().Count > 0; //.HotelsList.Any(hotel => hotel.CurrentSize == 0);
            else
            {
                replaceAble = !BoardManager.IsMergeLegal(card);
                return !replaceAble;
            }
        }

        private static Hotel PrePuttingProcess(TileCard card, TileCardEffect effect)
        {
            switch (effect)
            {
                case TileCardEffect.None:
                    return Hotel.Neutral;
                case TileCardEffect.Enlarge:
                    return BoardManager.GetEnlargedHotel(card);
                case TileCardEffect.SetUp:
                    Hotel selectedHotel = CurrentPlayer.SelectSetUpHotel();
                    if (HotelsManager.StockBank.GetNumberOfStocks(selectedHotel.Name) > 0)
                        HotelsManager.GiveStocksToPlayer(CurrentPlayer, selectedHotel.Name, 1);
                    return selectedHotel;
                case TileCardEffect.Merge:
                    return Merge(card);
                default:
                    Debug.Fail("Unknown effect.");
                    return null;
            }
        }

        private static Hotel Merge(TileCard card)
        {
            List<Hotel> mergingHotels = BoardManager.GetMergingHotels(card);
            Hotel mergerHotel = DetermineMerger(mergingHotels);
            if (mergerHotel == null)
                mergerHotel = CurrentPlayer.SelectMergerHotel(mergingHotels);
            mergingHotels.Remove(mergerHotel);
            HotelsManager.Merge(mergerHotel, mergingHotels);
            return mergerHotel;
        }

        private static Hotel DetermineMerger(List<Hotel> mergingHotels)
        {
            mergingHotels = mergingHotels.OrderByDescending(hotel => hotel.CurrentSize).ToList();
            return mergingHotels[0].CurrentSize != mergingHotels[1].CurrentSize ? mergingHotels[0] : null;
        }

        private static void PlayerBuyStocks()
        {
            HotelsManager.SellStocksToPlayer(CurrentPlayer, CurrentPlayer.SelectStocks());
        }

        private static Player NextPlayer()
        {
            int index = Players.IndexOf(CurrentPlayer);
            CurrentPlayer = CurrentPlayer != Players.Last() ? Players[index + 1] : Players[0];
            return CurrentPlayer;
        }

        public static void Announce(string Message)
        {
            // Temporary.
            Console.WriteLine(Message);
        }

        #endregion

        #region Events

        private static void NotifyCurrentPlayerChanged()
        {
            if (CurrentPlayerChanged != null)
                CurrentPlayerChanged(CurrentPlayer, new EventArgs());
        }

        #endregion

    }
}
