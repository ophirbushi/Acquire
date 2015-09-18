using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Acquire
{
    /// <summary>
    /// The board manager handles the board, tile cards and interactions between them.
    /// </summary>
    public static class BoardManager
    {
        /// <summary>
        /// The bank of tile cards from which the players receive their cards.
        /// </summary>
        public static List<TileCard> TileCardBank;

        /// <summary>
        /// Notifies whenever a hotel group has changed.
        /// </summary>
        public static event EventHandler GroupChanged;

        /// <summary>
        /// Gets the board manager ready for action.
        /// </summary>
        public static void Initialize()
        {
            InitializeTileBank();
        }

        /// <summary>
        /// Replaces an illegal tile card given by a player with a card from the TileCardBank, if there are still cards left.
        /// This method assumes that the tile card it receives is indeed illegal. 
        /// </summary>
        /// <param name="player">The player who wants to replace his illegal card.</param>
        /// <param name="card">The illegal card to replace.</param>
        public static void ReplaceCard(Player player, TileCard card)
        {
            GameManager.Output.ReplaceCard(player, card);
            player.TileCardBank.Remove(card);
            GiveCards(player, 1);
        }

        /// <summary>
        /// Gives certain amount of tile cards to a player, if there are still cards left in TileCardBank.
        /// </summary>
        /// <param name="player">The player to give the tile cards to.</param>
        /// <param name="quantity">How many tile cards to give to the player (If the amount exists in the TileCardBank).</param>
        public static void GiveCards(Player player, int quantity)
        {
            for (var i = 0; i < quantity; i++)
            {
                TileCard card;
                if (TileCardBank.Count > 0)
                {
                    card = TileCardBank.First();
                    TileCardBank.Remove(card);
                    player.TileCardBank.Add(card);
                    GameManager.Output.PlayerReceivedCard(player, card);
                }
                else
                {
                    GameManager.Output.PlayerReceivedCard(player, null);
                    return;
                }
            }
        }

        /// <summary>
        /// Handles the effect of a newly put tile card on the board.
        /// This method happens after all the prerequisites for putting the new card are met. 
        /// </summary>
        /// <param name="card">The newly put tile card.</param>
        /// <param name="effect">The effect this tile card has on the board, which was calculated earlier.</param>
        /// <param name="involvedHotel">The main hotel that is being affected by putting the tile card:
        /// In case of enlarging an hotel, the involved hotel is the hotel being enlarged. In case of setting up a new hotel, the involved hotel
        /// is the hotel the player decided to setup. In case of a merge effect, the involved hotel is the main hotel that swallows all his neighbor hotels.</param>
        public static void HandleEffect(TileCard card, TileCardEffect effect, Hotel involvedHotel)
        {
            switch (effect)
            {
                case TileCardEffect.None:
                    PutTile(card);
                    break;
                case TileCardEffect.Enlarge:
                    EnlageHotel(card, involvedHotel);
                    break;
                case TileCardEffect.SetUp:
                    SetUp(card, involvedHotel);
                    break;
                case TileCardEffect.Merge:
                    Merge(card, involvedHotel);
                    break;
                default:
                    Debug.Fail("Unknown effect");
                    break;
            }
            Debug.Assert(card.Tile.Occupied == true, "Tile is not occupied as it should be.");
        }      

        /// <summary>
        /// Gets the current size of a hotel on board.
        /// </summary>
        /// <param name="hotel">The hotel to be checked.</param>
        /// <returns>The size of the selected hotel.</returns>
        public static int GetHotelSize(Hotel hotel)
        {
            // Maybe need to add hotel-group dictionary to the board.
            TileGroup group = Board.TileGroups.FirstOrDefault(tg => tg.Hotel == hotel);
            return group != null ? group.Size : 0;
        }

        /// <summary>
        /// Checks if the circumstances allow a player to end the game (If any hotel reaches the size of 41, or there is no more room for hotels to be setup).
        /// </summary>
        /// <returns>Whether the situation is a possible end game.</returns>
        public static bool PossibleEndGame()
        {
            return Board.TileGroups.Any(group => group.Size >= 41) || !IsSetUpPossible();
        }

        /// <summary>
        /// Checks to see if a tile card whose effect on board is merge is legel (Not merging 2 or more immune hotels).
        /// </summary>
        /// <param name="card">The tile card whose effect on board is merge.</param>
        /// <returns>Whether or not the merge effect of the card, if put on board, is legal.</returns>
        public static bool IsMergeLegal(TileCard card)
        {
            Debug.Assert(GetEffect(card) == TileCardEffect.Merge);
            var neighbors = GetNeighbors(card);
            var immuneHotels = neighbors.Where(group => group.Hotel != Hotel.Neutral && group.Hotel.CurrentSize > 10).ToList();
            return immuneHotels.Count < 2;
        }

        /// <summary>
        /// Gets the hotel being enlarged by a certain tile card.
        /// </summary>
        /// <param name="card">The tile card whose effect on board is enlarge.</param>
        /// <returns>The hotel to be enlarged by the tile card.</returns>
        public static Hotel GetEnlargedHotel(TileCard card)
        {
            Debug.Assert(GetEffect(card) == TileCardEffect.Enlarge, "wrong effect");
            return GetNeighbors(card).First(group => group.Hotel != Hotel.Neutral).Hotel;
        }

        /// <summary>
        /// Gets the hotels involved in a merge caused by a tile card.
        /// </summary>
        /// <param name="card">The merging tile card.</param>
        /// <returns>The hotels involved in a merge caused by a tile card.</returns>
        public static List<Hotel> GetMergingHotels(TileCard card)
        {
            return GetNeighbors(card).Where(group => group.Hotel != Hotel.Neutral).Select(g => g.Hotel).ToList();
        }

        /// <summary>
        /// Gets the effect a specific tile card will cause, if the card is to be put on board.
        /// </summary>
        /// <param name="card">The card whose effect is checked.</param>
        /// <returns>The effect the card is to cause, if is to be put on board.</returns>
        public static TileCardEffect GetEffect(TileCard card)
        {
            List<TileGroup> neighbors = GetNeighbors(card);
            if (neighbors.Count == 0)
                return TileCardEffect.None;
            else if (!neighbors.Any(group => group.Hotel != Hotel.Neutral))
                return TileCardEffect.SetUp;
            else if (neighbors.Any(group => group.Hotel != Hotel.Neutral &&
                group.Hotel != neighbors.First(g => g.Hotel != Hotel.Neutral).Hotel))
                return TileCardEffect.Merge;
            else
                return TileCardEffect.Enlarge;
        }

        #region Private Methods

        /// <summary>
        /// Generates tile cards in the TileCardBank for each tile in the board, and then shuffles the cards.
        /// </summary>
        private static void InitializeTileBank()
        {
            TileCardBank = new List<TileCard>();
            foreach (Tile tile in Board.Tiles)
                TileCardBank.Add(new TileCard(tile));
            ShuffleTileCards();
        }

        /// <summary>
        /// Shuffles the TileCardBank cards.
        /// </summary>
        private static void ShuffleTileCards()
        {
            Random rnd = new Random();
            var cardsAndIndexList =
                from tc in TileCardBank
                select new { Card = tc, Index = rnd.Next(1000) };
            cardsAndIndexList = cardsAndIndexList.OrderBy(item => item.Index);
            TileCardBank = cardsAndIndexList.Select(item => item.Card).ToList();
        }

        /// <summary>
        /// Checks if it is yet possible to setup a new hotel in the board.
        /// </summary>
        /// <returns>Whether or not it is yet possible to setup a new hotel in the board.</returns>
        private static bool IsSetUpPossible()
        {
            var remainingCards = new List<TileCard>(TileCardBank);
            foreach (var p in GameManager.Players)
                remainingCards.AddRange(p.TileCardBank);
            var cardsAndEffects = remainingCards.Select(card => new
            {
                Card = card,
                Effect = GetEffect(card)
            });
            if (cardsAndEffects.Any(card => card.Effect == TileCardEffect.SetUp))
                return true;
            else
            {
                var noneEffectCards = cardsAndEffects.Where(card =>
                    card.Effect == TileCardEffect.None).Select(c => c.Card).ToList();
                foreach (var card in noneEffectCards)
                    if (noneEffectCards.Any(c => AreNeighbors(c, card)))
                        return true;

                return false;
            }
        }

        /// <summary>
        /// Checks if two tile cards are neighbors.
        /// </summary>
        /// <param name="card1">The first card.</param>
        /// <param name="card2">The second card.</param>
        /// <returns>Whether or not the tile cards are neighbors.</returns>
        private static bool AreNeighbors(TileCard card1, TileCard card2)
        {
            return card1.Point.Neighbors.Contains(card2.Point);
            //return (card1.X == card2.X && Math.Abs(card1.Y - card2.Y) == 1) ||
            //    (Math.Abs(card1.X - card2.X) == 1 && card1.Y == card2.Y);
        }

        /// <summary>
        /// Gets all the tile groups who are neighbors of a specific tile card.
        /// </summary>
        /// <param name="card">The tile card whose neighbors are sought.</param>
        /// <returns>All the tile groups who are neighbors of a specific tile card.</returns>
        private static List<TileGroup> GetNeighbors(TileCard card)
        {
            var neighbors = new List<TileGroup>();
            foreach (BoardPoint p in card.Point.Neighbors.Where(p => 
                Board.PointGroupDictionary.ContainsKey(p) &&
                !neighbors.Contains(Board.PointGroupDictionary[p])))
            {
                neighbors.Add(Board.PointGroupDictionary[p]);
            }
            return neighbors;
        }

        /// <summary>
        /// Setup a new hotel on board.
        /// </summary>
        /// <param name="card">The card who caused the setup.</param>
        /// <param name="involvedHotel">The hotel chosen to be setup.</param>
        private static void SetUp(TileCard card, Hotel involvedHotel)
        {
            card.Tile.Occupied = true;
            var group = new TileGroup(card.Tile) { Hotel = involvedHotel };
            SwallowGroups(card, group);
        }

        /// <summary>
        /// Merge hotels to one big hotel on board.
        /// </summary>
        /// <param name="card">The tile card which caused the merge.</param>
        /// <param name="involvedHotel">The hotel which swallowes all his neighbor hotels.</param>
        private static void Merge(TileCard card, Hotel involvedHotel)
        {
            card.Tile.Occupied = true;
            TileGroup group = Board.TileGroups.FirstOrDefault(tg => tg.Hotel == involvedHotel);
            group.AddTiles(card.Tile);
            SwallowGroups(card, group);
        }

        /// <summary>
        /// Enlarge a hotel on board.
        /// </summary>
        /// <param name="card">The tile card whose effect is enlarge.</param>
        /// <param name="involvedHotel"></param>
        private static void EnlageHotel(TileCard card, Hotel involvedHotel)
        {
            // Maybe need to add hotel-group dictionary to the board.
            card.Tile.Occupied = true;
            TileGroup group = Board.TileGroups.FirstOrDefault(tg => tg.Hotel == involvedHotel);
            group.AddTiles(card.Tile);
            SwallowGroups(card, group);
        }
        
        /// <summary>
        /// Puts a new tile on board.
        /// </summary>
        /// <param name="card">The tile card representing the tile to be put.</param>
        private static void PutTile(TileCard card)
        {
            card.Tile.Occupied = true;
            var group = new TileGroup(card.Tile);

            // Only for the pre-game putting of tiles where neighboring tiles do not set-up a new hotel.
            SwallowGroups(card, group);
        }

        /// <summary>
        /// Make a specific tile group swallow all its neighboring groups.
        /// </summary>
        /// <param name="swallowingCard">The tile card which causes the swallowing of the other groups.</param>
        /// <param name="swallowingGroup">The group which swallows all its neighboring groups.</param>
        private static void SwallowGroups(TileCard swallowingCard, TileGroup swallowingGroup)
        {
            swallowingCard.Tile.Hotel = swallowingGroup.Hotel;
            var neighboringGroups = new List<TileGroup>();
            foreach (var neighbor in swallowingCard.Point.Neighbors)
            {
                if (Board.PointGroupDictionary.ContainsKey(neighbor) &&
                    !neighboringGroups.Contains(Board.PointGroupDictionary[neighbor]) &&
                    Board.PointGroupDictionary[neighbor] != swallowingGroup)
                {
                    neighboringGroups.Add(Board.PointGroupDictionary[neighbor]);
                }
            }
            foreach (var group in neighboringGroups)
            {
                group.Tiles.ForEach(tile => Board.PointGroupDictionary.Remove(tile.Point));
                group.Tiles.ForEach(tile => tile.Hotel = swallowingGroup.Hotel);
                group.Tiles.ForEach(tile => Board.PointGroupDictionary.Add(tile.Point, swallowingGroup));
                swallowingGroup.AddTiles(group.Tiles);
                Board.TileGroups.Remove(group);
            }
            NotifyGroupChanged(swallowingGroup);
        }

        /// <summary>
        /// Raises an event notifying a tile group has changed, so the game logic will be updated.
        /// </summary>
        /// <param name="changedGroup">The tile group which have been changed.</param>
        private static void NotifyGroupChanged(TileGroup changedGroup)
        {
            if (GroupChanged != null)
                GroupChanged(changedGroup, new EventArgs());
        }

        #endregion
    }
}
