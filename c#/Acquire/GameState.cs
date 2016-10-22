using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Acquire
{
    public class GameState
    {
        public List<Player> Players;
        public Player CurrentPlayer;
        public Dictionary<BoardPoint, TileGroup> PointGroupDictionary;
    }
}
