using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Acquire
{
    public class StockBank
    {
        public const int MAX_CAPACITY = 24;

        public StockSlot Europlaza = new StockSlot(Hotel.HOTEL_NAME_EUROPLAZA);
        public StockSlot Continental = new StockSlot(Hotel.HOTEL_NAME_CONTINENTAL);
        public StockSlot Olympia = new StockSlot(Hotel.HOTEL_NAME_OLYMPIA);
        public StockSlot Park = new StockSlot(Hotel.HOTEL_NAME_PARK);
        public StockSlot LasVegas = new StockSlot(Hotel.HOTEL_NAME_LASVEGAS);
        public StockSlot Reviera = new StockSlot(Hotel.HOTEL_NAME_REVIERA);
        public StockSlot Holiday = new StockSlot(Hotel.HOTEL_NAME_HOLIDAY);

        public readonly List<StockSlot> AllStocks;
        public readonly Dictionary<string, StockSlot> NameStocksDictionary;

        public StockBank()
        {
            AllStocks = new List<StockSlot> { Europlaza, Continental, Olympia, Park, LasVegas, Reviera, Holiday };
            NameStocksDictionary = new Dictionary<string, StockSlot> {
                {Hotel.HOTEL_NAME_EUROPLAZA, Europlaza}, 
                {Hotel.HOTEL_NAME_CONTINENTAL, Continental}, 
                {Hotel.HOTEL_NAME_OLYMPIA, Olympia}, 
                {Hotel.HOTEL_NAME_PARK, Park}, 
                {Hotel.HOTEL_NAME_LASVEGAS, LasVegas},
                {Hotel.HOTEL_NAME_REVIERA, Reviera},
                {Hotel.HOTEL_NAME_HOLIDAY, Holiday}
            };
        }    

        public void Add(string stockName, int quantity)
        {
            NameStocksDictionary[stockName].Quantity += quantity;
            Debug.Assert(NameStocksDictionary[stockName].Quantity <= MAX_CAPACITY);
        }

        public void Remove(string stockName, int quantity)
        {
            NameStocksDictionary[stockName].Quantity -= quantity;
            Debug.Assert(NameStocksDictionary[stockName].Quantity >= 0);
        }

        public int GetNumberOfStocks(string stockName)
        {
            return NameStocksDictionary[stockName].Quantity;
        }

        public void Fill()
        {
            for (var i = 0; i < AllStocks.Count; i++)
                AllStocks[i].Quantity = MAX_CAPACITY;
        }

        public class StockSlot
        {
            public int Quantity { get; set; }
            public readonly string HotelName;
            public StockSlot(string hotelName)
            {
                HotelName = hotelName;
                Quantity = 0;
            }        
        }

    }
}
