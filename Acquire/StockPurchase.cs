﻿
namespace Acquire
{
    public struct StockPurchase
    {
        public readonly Hotel Hotel;
        public readonly int Quantity;

        public StockPurchase(Hotel hotel, int quantity)
        {
            Hotel = hotel;
            Quantity = quantity;
        }
    }
}
