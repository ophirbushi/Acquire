using System.Collections.Generic;
using System.Diagnostics;
using System.Xml.Serialization;

namespace Acquire
{
    /// <summary>
    /// A hotel is a tile or a chain of connected tiles, which has a name, size, prestige & stock value.
    /// </summary>
    public class Hotel
    {
        #region static properties

        /// <summary>
        /// The default hotel - if a tile is put on board, and isn't connected to any hotel, then its hotel is neutral.
        /// </summary> 
        public static Hotel Neutral;// = new Hotel(HOTEL_NAME_NEUTRAL); 

        public const string HOTEL_NAME_NEUTRAL = "Neutral";
        public const string HOTEL_NAME_EUROPLAZA = "Europlaza";
        public const string HOTEL_NAME_CONTINENTAL = "Continental";
        public const string HOTEL_NAME_OLYMPIA = "Olympia";
        public const string HOTEL_NAME_PARK = "Park";
        public const string HOTEL_NAME_LASVEGAS = "Las Vegas";
        public const string HOTEL_NAME_REVIERA = "Reviera";
        public const string HOTEL_NAME_HOLIDAY = "Holiday";

        public static List<string> HOTEL_NAMES;/* = new List<string>{
            HOTEL_NAME_EUROPLAZA,
            HOTEL_NAME_CONTINENTAL,
            HOTEL_NAME_OLYMPIA,
            HOTEL_NAME_PARK,
            HOTEL_NAME_LASVEGAS,
            HOTEL_NAME_REVIERA,
            HOTEL_NAME_HOLIDAY
        };*/

        /// <summary>
        /// The prestige level of the hotel - affects its stock price.
        /// </summary>
        public enum HotelPrestige { None = 0, Cheap = 1, Medium = 2, Expensive = 3 };

        private static readonly List<string> CHEAP_HOTEL_NAMES = new List<string> { HOTEL_NAME_REVIERA, HOTEL_NAME_HOLIDAY };
        private static readonly List<string> MEDIUM_HOTEL_NAMES = new List<string> { HOTEL_NAME_OLYMPIA, HOTEL_NAME_PARK, HOTEL_NAME_LASVEGAS };
        private static readonly List<string> EXPENSIVE_HOTEL_NAMES = new List<string> { HOTEL_NAME_EUROPLAZA, HOTEL_NAME_CONTINENTAL };

        #endregion

        /// <summary>
        /// The name of the hotel.
        /// </summary>
        [XmlAttribute]
        public string Name;

        /// <summary>
        /// The prestige level of the hotel.
        /// </summary>
        [XmlAttribute]
        public HotelPrestige Prestige;

        /// <summary>
        /// The hotel's current size (The number of tiles it is consisted of).
        /// </summary>
        public int CurrentSize { get { return BoardManager.GetHotelSize(this); } }

        /// <summary>
        /// The current price of a stock of the hotel.
        /// </summary>
        public int CurrentStockValue { get { return CalculateStockValue(); } }

        public Hotel()
        {

        }

        /// <summary>
        /// Creates a new hotel, specifying its name.
        /// </summary>
        /// <param name="name">The name of the hotel to be created. Has to be from the list of predefined hotel names.</param>
        public Hotel(string name)
        {
            Name = name;
            if (CHEAP_HOTEL_NAMES.Contains(name))
                Prestige = HotelPrestige.Cheap;
            else if (MEDIUM_HOTEL_NAMES.Contains(name))
                Prestige = HotelPrestige.Medium;
            else if (EXPENSIVE_HOTEL_NAMES.Contains(name))
                Prestige = HotelPrestige.Expensive;
            else if (name == HOTEL_NAME_NEUTRAL)
                Prestige = HotelPrestige.None;
            else
                Debug.Fail("Hotel's name does not appear in any prestige list");
        }

        /// <summary>
        /// Initialization of some static fields.
        /// </summary>
        public static void Initialize()
        {
            Neutral = new Hotel(HOTEL_NAME_NEUTRAL);
            HOTEL_NAMES = new List<string>{
            HOTEL_NAME_EUROPLAZA,
            HOTEL_NAME_CONTINENTAL,
            HOTEL_NAME_OLYMPIA,
            HOTEL_NAME_PARK,
            HOTEL_NAME_LASVEGAS,
            HOTEL_NAME_REVIERA,
            HOTEL_NAME_HOLIDAY  };
        }

        /// <summary>
        /// Calculates the hotels current stock value.
        /// </summary>
        /// <returns>The hotels current stock value.</returns>
        private int CalculateStockValue()
        {
            var numTiles = CurrentSize;
            var n = numTiles < 41 ? numTiles : 41;
            return ((n < 6) ? n : (6 + (n - 1) / 10)) * 100 + (int)(Prestige - 1) * 100;
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
