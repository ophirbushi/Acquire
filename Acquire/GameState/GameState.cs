using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Acquire
{
    public class GameState
    {
        // For the GameManager.
        public StepInPlayerTurn StepInTurn { get; set; }
        public List<Player> Players { get; set; }
        public int CurrentPlayerID { get; set; }

        // For the Board.
        public List<Tile> TileList { get; set; }
        public List<TileGroup> TileGroups { get; set; }
        //public Dictionary<BoardPoint, TileGroup> PointGroupDictionary { get; set; }

        // For the BoardManager.
        public List<TileCard> TileCardBank { get; set; }

        // For the HotelManager.
        public StockBank StockBank { get; set; }
        //public Dictionary<string, Hotel> HotelNameHotelDictionary { get; set; }
    }

    public enum StepInPlayerTurn
    {
        NewTurn,
    }
}
