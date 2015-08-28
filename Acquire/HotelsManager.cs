using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;


namespace Acquire
{
    public static class HotelsManager
    {
        public static List<Hotel> HotelsList;
        public static List<Hotel> ActiveHotels { get { return HotelsList.Where(h => h.CurrentSize > 0).ToList(); } }
        public static StockBank StockBank;       
        public static Dictionary<string, Hotel> HotelNameHotelDictionary;

        public static void Initialize()
        {
            HotelsList = new List<Hotel>();
            HotelNameHotelDictionary = new Dictionary<string, Hotel>();
            foreach (string hotelName in Hotel.HOTEL_NAMES)
            {
                var hotel = new Hotel(hotelName);
                HotelsList.Add(hotel);
                HotelNameHotelDictionary.Add(hotelName, hotel);
            }
            StockBank = new StockBank();
            StockBank.Fill();
        }

        public static void GiveStocksToPlayer(Player player, string stockName, int quantity)
        {
            HotelsManager.StockBank.Remove(stockName, quantity);
            player.StockBank.Add(stockName, quantity);
        }

        public static void TakeStocksFromPlayer(Player player, string stockName, int quantity)
        {
            player.StockBank.Remove(stockName, quantity);
            HotelsManager.StockBank.Add(stockName, quantity);
        }

        public static void Merge(Hotel mergerHotel, List<Hotel> mergingHotels)
        {
            foreach (var hotel in mergingHotels)
            {
                DividePrizes(hotel);
                DecideStocks(hotel, mergerHotel);
            }
        }

        public static Hotel DetermineMerger(List<Hotel> mergingHotels)
        {
            mergingHotels = mergingHotels.OrderByDescending(hotel => hotel.CurrentSize).ToList();
            return mergingHotels[0].CurrentSize != mergingHotels[1].CurrentSize ? mergingHotels[0] : null;
        }

        private static void DividePrizes(Hotel hotel)
        {
            int firstPrize = hotel.CurrentStockValue * 10;
            int secondPrize = firstPrize / 2;

            List<Player> firstPrizeReceivers = new List<Player>();
            List<Player> secondPrizeReceivers = new List<Player>();
            var stocksHolders = GameManager.Players.Where(p =>
                p.StockBank.NameStocksDictionary[hotel.Name].Quantity > 0).OrderByDescending(p =>
                p.StockBank.NameStocksDictionary[hotel.Name].Quantity).Select(p =>
                    new { Player = p, Quantity = p.StockBank.NameStocksDictionary[hotel.Name].Quantity }).ToList();
            foreach (var p in stocksHolders.Where(p => p.Quantity == stocksHolders.First().Quantity))
            {
                firstPrizeReceivers.Add(p.Player);
            }
            if (stocksHolders.Any(p => p.Quantity != stocksHolders.First().Quantity))
            {
                foreach (var pl in stocksHolders.Where(pl => pl.Quantity == stocksHolders.First(p =>
                    p.Quantity != stocksHolders.First().Quantity).Quantity))
                {
                    secondPrizeReceivers.Add(pl.Player);
                }
            }
            else
                secondPrizeReceivers.AddRange(firstPrizeReceivers);


            foreach (var p in firstPrizeReceivers)
                GivePrize(p, firstPrize, true);
            foreach (var p in secondPrizeReceivers)
                GivePrize(p, secondPrize, false);
        }

        private static void GivePrize(Player player, int prize, bool firstPrize)
        {
            player.Cash += prize;
        }

        private static void DecideStocks(Hotel mergingHotel, Hotel mergerHotel)
        {
            Player decider = GameManager.CurrentPlayer;
            StockDecision decision;
            for (var i = 0; i < GameManager.NumberOfPlayers; i++)
            {
                decision = decider.DecideStocks(mergingHotel, mergerHotel);
                ProcessDecision(decision);
            }
        }

        private static void ProcessDecision(StockDecision decision)
        {
            BuyStocksFromPlayer(decision.Player, decision.MergingHotel, decision.Selling);
            ExchangeStocks(decision.Player, decision.MergingHotel, decision.MergerHotel, decision.Exchanging);
        }

        private static void ExchangeStocks(Player player, Hotel mergingHotel, Hotel mergerHotel, int mergingHotelStocksExchangedNumber)
        {
            Debug.Assert(mergingHotelStocksExchangedNumber % 2 == 0);
            TakeStocksFromPlayer(player, mergingHotel.Name, mergingHotelStocksExchangedNumber);
            GiveStocksToPlayer(player, mergerHotel.Name, mergingHotelStocksExchangedNumber / 2);
        }

        public static void BuyStocksFromPlayer(Player player, Hotel hotel, int quantity)
        {
            TakeStocksFromPlayer(player, hotel.Name, quantity);
            player.Cash += hotel.CurrentStockValue * quantity;
        }

        public static List<Hotel> GetAvailableHotels()
        {
            return HotelsList.Where(hotel => hotel.CurrentSize == 0).ToList();
        }

        public static void SellStocksToPlayer(Player player, List<StockPurchase> list)
        {
            foreach (var p in list)
            {
                player.Cash -= p.Quantity * p.Hotel.CurrentStockValue;
                GiveStocksToPlayer(player, p.Hotel.Name, p.Quantity);
            }
        }
    }
}
