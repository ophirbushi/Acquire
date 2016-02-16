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
        public int X;
        [XmlAttribute]
        public int Y;

        [XmlIgnore]
        public BoardPoint Point { get { return new BoardPoint(X, Y); } }

        [XmlIgnore]
        public Tile Tile {
            get { return Board.PointTileDictionary[Point]; }
        }

        public TileCard()
        {

        }

        public TileCard(BoardPoint point)
        {
            X = point.X;
            Y = point.Y;
        }

        public override string ToString()
        {
            return String.Format("{0},{1}", X, Y);
        }
    }
}
