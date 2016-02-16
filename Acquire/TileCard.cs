using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Acquire
{
    public class TileCard
    {
        public BoardPoint Point;

        public int X { get { return Point.X; } }
        public int Y { get { return Point.Y; } }

        public readonly Tile Tile;

        public TileCard(BoardPoint point)
        {
            Point = point;
        }

        public override string ToString()
        {
            return String.Format("{0},{1}", Point.X, Point.Y);
        }
    }
}
