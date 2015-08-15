using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;

namespace Acquire
{
    public class TileCard
    {
        public int X { get { return Tile.X; } }
        public int Y { get { return Tile.Y; } }
        public BoardPoint Point { get { return new BoardPoint(X, Y); } }

        public readonly Tile Tile;

        public TileCard(Tile tile)
        {
            Tile = tile;
        }

        public override string ToString()
        {
            return String.Format("{0},{1}", X, Y);
        }
    }
}
