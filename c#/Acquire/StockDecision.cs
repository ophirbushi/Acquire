using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;


namespace Acquire
{
    public struct StockDecision
    {
        public Player Player;

        public Hotel MergingHotel;
        public Hotel MergerHotel;

        public readonly int TotalStocks;

        public int Keeping;
        public int Exchanging;
        public int Selling;

        public bool Correct()
        {
            return Keeping + Exchanging + Selling == TotalStocks;
        }

        public StockDecision(Player player, Hotel mergingHotel, Hotel mergerHotel, int keeping, int exchanging, int selling)
        {
            Player = player;
            MergingHotel = mergingHotel;
            MergerHotel = mergerHotel;
            TotalStocks = player.StockBank.NameStocksDictionary[mergingHotel.Name].Quantity;
            Keeping = keeping;
            Exchanging = exchanging;
            Selling = selling;
            Debug.Assert(this.Correct());
        }
    }
}
