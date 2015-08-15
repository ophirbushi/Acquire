using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;

namespace Acquire
{
    public struct BoardPoint
    {
        public int X, Y;
        public List<BoardPoint> Neighbors { get { return new List<BoardPoint> { Above(), Below(), Right(), Left() }; } }
        public BoardPoint(int x, int y)
        {
            X = x;
            Y = y;
        }

        public BoardPoint Above()
        {
            return new BoardPoint(X, Y - 1);
        }

        public BoardPoint Below()
        {
            return new BoardPoint(X, Y + 1);
        }

        public BoardPoint Right()
        {
            return new BoardPoint(X + 1, Y);
        }

        public BoardPoint Left()
        {
            return new BoardPoint(X - 1, Y);
        }


        public override string ToString()
        {
            return String.Format("({0}, {1})", X, Y);
        }
    }
}
