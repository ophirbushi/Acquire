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
            throw new NotImplementedException();
            //return (TileCard)GameManager.Input.GetInput(METHOD_NAME_SelectCard, 
            //    new List<object>(this.TileCardBank));
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
            throw new NotImplementedException();
            //return (Hotel)GameManager.Input.GetInput(METHOD_NAME_SelectSetUpHotel, new List<object>(HotelsManager.GetAvailableHotels()));
            //throw new NotImplementedException();
        }

        public Hotel SelectMergerHotel(List<Hotel> mergingHotels)
        {
            throw new NotImplementedException();
            //return (Hotel)GameManager.Input.GetInput(METHOD_NAME_SelectMergerHotel, 
            //    new List<object>(mergingHotels));
        }

        public StockDecision DecideStocks(Hotel mergingHotel, Hotel mergerHotel)
        {
            return (StockDecision)GameManager.Input.GetStockDecision(this, mergingHotel, mergerHotel);
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
