using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;


namespace Acquire
{
    public class Hotel
    {
        #region static properties

        public static Hotel Neutral;// = new Hotel(HOTEL_NAME_NEUTRAL); 

        public const string HOTEL_NAME_NEUTRAL = "Neutral";
        public const string HOTEL_NAME_EUROPLAZA = "Europlaza";
        public const string HOTEL_NAME_CONTINENTAL = "Continental";
        public const string HOTEL_NAME_OLYMPIA = "Olympia";
        public const string HOTEL_NAME_PARK = "Park";
        public const string HOTEL_NAME_LASVEGAS = "Las Vegas";
        public const string HOTEL_NAME_REVIERA = "Reviera";
        public const string HOTEL_NAME_HOLIDAY = "Holiday";

        public static List<string> HOTEL_NAMES;// = new List<string>{
        //    HOTEL_NAME_EUROPLAZA,
        //    HOTEL_NAME_CONTINENTAL,
        //    HOTEL_NAME_OLYMPIA,
        //    HOTEL_NAME_PARK,
        //    HOTEL_NAME_LASVEGAS,
        //    HOTEL_NAME_REVIERA,
        //    HOTEL_NAME_HOLIDAY
        //};

        public enum HotelPrestige { None = 0, Cheap = 1, Medium = 2, Expensive = 3 };

        private static readonly List<string> CHEAP_HOTEL_NAMES = new List<string> { HOTEL_NAME_REVIERA, HOTEL_NAME_HOLIDAY };
        private static readonly List<string> MEDIUM_HOTEL_NAMES = new List<string> { HOTEL_NAME_OLYMPIA, HOTEL_NAME_PARK, HOTEL_NAME_LASVEGAS };
        private static readonly List<string> EXPENSIVE_HOTEL_NAMES = new List<string> { HOTEL_NAME_EUROPLAZA, HOTEL_NAME_CONTINENTAL };

        #endregion

        public readonly string Name;
        public readonly HotelPrestige Prestige;
        public int CurrentSize { get { return BoardManager.GetHotelSize(this); } }
        public int CurrentStockValue { get { return CalcValue(); } }

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

        private int CalcValue()
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
