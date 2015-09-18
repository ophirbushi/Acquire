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
        /// The destination to send game data information when it happens.
        /// </summary>
        public static IOutput Output;

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
        public static void NewGame(IInput input, IOutput output)
        {
            Input = input;
            Output = output;
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

        /// <summary>
        /// Represents a player's turn.
        /// </summary>
        private static void MakeMove()
        {
            bool cardWasPut = PutCardStage();
            BuyStocksStage();
            if (cardWasPut)
            {
                TakeCardStage();
            }
            if (IsGameEnd())
            {
                _gameEnding = true;
            }
            else
            {
                CurrentPlayer = NextPlayer();
            }
        }

        /// <summary>
        /// Ends the game, selling all the stocks, and showing the winner.
        /// </summary>
        private static void EndGame()
        {
            Players.ForEach(p => p.StockBank.AllStocks.ForEach(stock =>
                HotelsManager.BuyStocksFromPlayer(p,
                HotelsManager.HotelNameHotelDictionary[stock.HotelName], stock.Quantity)));
            Input.ShowWinner();
        }

        /// <summary>
        /// Creates players. Temporary.
        /// </summary>
        private static void InitPlayers()
        {
            Players = new List<Player> { new Player(), new Player(), new Player(), new Player() };
            Output.PlayerList(Players);
        }

        /// <summary>
        /// Checks to see if the conditions are met to end the game, and if so whether the current player decides to end the game.
        /// </summary>
        /// <returns>Whether or not the game ends this turn.</returns>
        private static bool IsGameEnd()
        {
            return BoardManager.PossibleEndGame() && CurrentPlayer.EndGame();
        }

        #endregion

        #region Main Stages

        /// <summary>
        /// The stage in a player's turn where the player puts a tile card on board, and the card's effect on the board is being processed.
        /// </summary>
        /// <returns>Whether a card was put on board. Returns false if there were no legal cards to be put.</returns>
        private static bool PutCardStage()
        {
            TileCardEffect effect;
            bool replaceAble;
            if (CurrentPlayer.TileCardBank.TrueForAll(c =>
                BoardManager.GetEffect(c) == TileCardEffect.SetUp &&
                !IsCardLegal(c, out effect, out replaceAble)))
            {
                Output.PlayerPutsCard(CurrentPlayer, null, TileCardEffect.None, null);
                return false;
            }
            TileCard card = CurrentPlayer.SelectCard();
            while (!IsCardLegal(card, out effect, out replaceAble))
            {
                if (replaceAble)
                {
                    BoardManager.ReplaceCard(CurrentPlayer, card);
                }
                card = CurrentPlayer.SelectCard();
            }
            var involvedHotel = PrePuttingProcess(card, effect);
            PutCardOnBoard(CurrentPlayer, card, effect, involvedHotel); // BoardManager.HandleEffect(card, effect, PrePuttingProcess(card, effect));
            return true;
        }

        /// <summary>
        /// The stage in a player's turn where the player buys stocks.
        /// </summary>
        private static void BuyStocksStage()
        {
            if (CanPlayerBuyStocks())
            {
                PlayerBuyStocks();
            }           
        }

        /// <summary>
        /// The last stage in a player's turn, where the player takes a card from the tile card bank (If there are any cards left).
        /// </summary>
        private static void TakeCardStage()
        {
            BoardManager.GiveCards(CurrentPlayer, 1);
        }

        #endregion

        #region Sub-Methods

        /// <summary>
        /// Determining who starts the game by giving each player a tile card from the bank, putting it on board, 
        /// and the player whose card is the closest card to A1 starts the game.
        /// </summary>
        /// <returns>The starting player.</returns>
        private static Player DetermineStartingPlayer()
        {
            foreach (Player p in Players)
            {
                BoardManager.GiveCards(p, 1);
            }

            // All players are supposed to have one card now.
            Debug.Assert(!Players.Any(p => p.TileCardBank.Count != 1));

            Player startingPlayer = ClosestToA1();

            foreach (Player p in Players)
            {
                PutCardOnBoard(p, p.TileCardBank.First(), TileCardEffect.None, Hotel.Neutral);
            }

            return startingPlayer;
        }

        /// <summary>
        /// Putting a tile card on board, by removing the card from the player's bank, 
        /// and calling the BoardManager to handle the effect the card has on the board.  
        /// </summary>
        /// <param name="player">The player who puts the tile card.</param>
        /// <param name="card">The tile card being put.</param>
        /// <param name="effect">Which effect the tile card has on the board.</param>
        /// <param name="involvedHotel">The main hotel that is being affected by putting the tile card:
        /// In case of enlarging an hotel, the involved hotel is the hotel being enlarged. In case of setting up a new hotel, the involved hotel
        /// is the hotel the player decided to setup. In case of a merge effect, the involved hotel is the main hotel that swallows all his neighbor hotels.</param>
        private static void PutCardOnBoard(Player player, TileCard card, TileCardEffect effect, Hotel involvedHotel)
        {
            player.TileCardBank.Remove(card);
            Output.PlayerPutsCard(player, card, effect, involvedHotel);
            BoardManager.HandleEffect(card, effect, involvedHotel);
        }

        /// <summary>
        /// Determining which player has the tile card which is the closest to A1.
        /// </summary>
        /// <returns>The player who has the tile card which is the closest to A1.</returns>
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
            Player closestToA1 = playersAndDistances.First().P;
            Output.ClosestToA1(closestToA1);
            return closestToA1;
        }

        /// <summary>
        /// Determining whether or not a tile card is legal at the moment.(Can be put on board), 
        /// and also whether the card's illegal status is permanent, which makes it replaceable.
        /// </summary>
        /// <param name="card">The tile card being tested.</param>
        /// <param name="effect">The effect which the tile card has on the board.</param>
        /// <param name="replaceAble">Whether or not the card is eligible for replacement since it is permanently illegal.</param>
        /// <returns>Whether or not the tile card is legal at the moment.</returns>
        private static bool IsCardLegal(TileCard card, out TileCardEffect effect, out bool replaceAble)
        {
            effect = BoardManager.GetEffect(card);
            replaceAble = false;
            if (effect == TileCardEffect.Enlarge || effect == TileCardEffect.None)
                return true;
            else if (effect == TileCardEffect.SetUp)
                return HotelsManager.GetAvailableHotels().Count > 0;
            else
            {
                replaceAble = !BoardManager.IsMergeLegal(card);
                return !replaceAble;
            }
        }

        /// <summary>
        /// Determening whether or not a player can buy stocks at the moment.
        /// </summary>
        /// <returns>Whether or not a player can buy stocks at the moment.</returns>
        private static bool CanPlayerBuyStocks()
        {
            bool areStocksAvailable = HotelsManager.ActiveHotels.Count > 0 && HotelsManager.ActiveHotels.Any(hotel => HotelsManager.StockBank.GetNumberOfStocks(hotel.Name) > 0);
            bool isEnoughMoney = false;
            if (!areStocksAvailable)
            {
                Output.CanPlayerBuyStocks(IsPlayerAbleToBuyStocks.NoAvailableStocks);
                return false;
            }
            else
            {
                isEnoughMoney = HotelsManager.ActiveHotels.Any(hotel => CurrentPlayer.Cash >= hotel.CurrentStockValue);
                if (!isEnoughMoney)
                {
                    Output.CanPlayerBuyStocks(IsPlayerAbleToBuyStocks.NotEnoughMoney);
                    return false;
                }
            }
            Output.CanPlayerBuyStocks(IsPlayerAbleToBuyStocks.CanBuy);
            return true;
        }

        /// <summary>
        /// Determining which is the mainly involved hotel in putting a specific tile card on board -
        /// by completing a specific process, which varies by the effect the tile card has on the board.
        /// </summary>
        /// <param name="card">The tile card to be put on board.</param>
        /// <param name="effect">The effect the tile card has on the board.</param>
        /// <returns>The mainly involved hotel in putting the tile card on board.</returns>
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
                    {
                        HotelsManager.GiveStocksToPlayer(CurrentPlayer, selectedHotel.Name, 1);
                    }
                    return selectedHotel;
                case TileCardEffect.Merge:
                    return Merge(card);
                default:
                    Debug.Fail("Unknown effect.");
                    return null;
            }
        }

        /// <summary>
        /// Performing a merge of hotels.
        /// </summary>
        /// <param name="card">The tile card which caused the merge.</param>
        /// <returns>The hotel which swallowed the other hotels.</returns>
        private static Hotel Merge(TileCard card)
        {
            List<Hotel> mergingHotels = BoardManager.GetMergingHotels(card);
            Hotel mergerHotel = HotelsManager.DetermineMerger(mergingHotels);
            if (mergerHotel == null)
            {
                mergerHotel = CurrentPlayer.SelectMergerHotel(mergingHotels);
            }
            mergingHotels.Remove(mergerHotel);
            HotelsManager.Merge(mergerHotel, mergingHotels);
            return mergerHotel;
        }

        /// <summary>
        /// Selling stocks to the current player.
        /// </summary>
        private static void PlayerBuyStocks()
        {
            HotelsManager.SellStocksToPlayer(CurrentPlayer, CurrentPlayer.SelectStocks());
        }

        /// <summary>
        /// Gets the player whose turn it is now.
        /// </summary>
        /// <returns></returns>
        private static Player NextPlayer()
        {
            int index = Players.IndexOf(CurrentPlayer);
            CurrentPlayer = CurrentPlayer != Players.Last() ? Players[index + 1] : Players[0];
            return CurrentPlayer;
        }

        /// <summary>
        /// Announcing a message to all players.
        /// </summary>
        /// <param name="Message">The message to announce.</param>
        public static void Announce(string Message)
        {
            // Temporary.
            Console.WriteLine(Message);
        }


        #endregion

        #region Events

        /// <summary>
        /// Notifies to all listeners that the current player has changed.
        /// </summary>
        private static void NotifyCurrentPlayerChanged()
        {
            if (CurrentPlayerChanged != null)
                CurrentPlayerChanged(CurrentPlayer, new EventArgs());
        }

        #endregion

    }
}
