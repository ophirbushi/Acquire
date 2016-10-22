using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace Acquire
{
    public class Player
    {
        public static int PLAYERS_COUNT;

        public const string METHOD_NAME_SelectCard = "SelectCard";
        public const string METHOD_NAME_SelectStocks = "SelectStocks";
        public const string METHOD_NAME_SelectSetUpHotel = "SelectSetUpHotel";
        public const string METHOD_NAME_SelectMergerHotel = "SelectMergerHotel";
        public const string METHOD_NAME_EndGame = "EndGame";

        public string Name;
        public int Cash = 5000;
        public StockBank StockBank = new StockBank();
        public List<TileCard> TileCardBank = new List<TileCard>();

        private static Random _rnd;

        public Player()
        {
            PLAYERS_COUNT++;
            Name = "Player" + PLAYERS_COUNT;

            if (_rnd == null)
                _rnd = new Random();
        }

        public TileCard SelectCard()
        {
            var cards = new List<object>();
            foreach (var card in TileCardBank)
            {
                cards.Add(card);
            }
            return (TileCard)GameManager.Input.GetInput(METHOD_NAME_SelectCard, cards);
        }

        public List<StockPurchase> SelectStocks()
        {
            return GameManager.Input.GetSelectedStocks(this);
        }

        public bool EndGame()
        {
            // Temporary.
            return (bool)GameManager.Input.GetInput(METHOD_NAME_EndGame, new List<object>());
        }

        private TileCard SelectRandomCard()
        {
            return TileCardBank[_rnd.Next(TileCardBank.Count)];
        }

        public Hotel SelectSetUpHotel()
        {
            var hotels = new List<object>();
            foreach (var hotel in HotelsManager.GetAvailableHotels())
            {
                hotels.Add(hotel);
            }
            var selectedHotel = (Hotel)GameManager.Input.GetInput(METHOD_NAME_SelectSetUpHotel, hotels);
            GameManager.Output.PlayerSetsUpHotel(this, selectedHotel);
            return selectedHotel;
        }

        public Hotel SelectMergerHotel(List<Hotel> mergingHotels)
        {
            var mergingHotelsList = new List<object>();
            foreach (var hotel in mergingHotels)
            {
                mergingHotelsList.Add(hotel);
            }
            return (Hotel)GameManager.Input.GetInput(METHOD_NAME_SelectMergerHotel, mergingHotelsList);
        }

        public StockDecision DecideStocks(Hotel mergingHotel, Hotel mergerHotel)
        {
            var decision = (StockDecision)GameManager.Input.GetStockDecision(this, mergingHotel, mergerHotel);
            GameManager.Output.PlayerStockDecision(this, decision);
            return decision;
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
