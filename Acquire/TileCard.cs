using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace Acquire
{
    public class TileCard
    {

        [XmlAttribute]
        public int X { get { return Tile.X; } set {  } }
        [XmlAttribute]
        public int Y { get { return Tile.Y; } set {  } }
        public BoardPoint Point { get { return new BoardPoint(X, Y); } }

        public readonly Tile Tile;

        public TileCard()
        {

        }

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
