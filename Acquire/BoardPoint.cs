using System;
using System.Collections.Generic;

namespace Acquire
{
    /// <summary>
    /// A point in the board. 
    /// </summary>
    public struct BoardPoint
    {
        /// <summary>
        /// The X coordinate of the point.
        /// </summary>
        public int X;

        /// <summary>
        /// The Y coordinate of the point.
        /// </summary>
        public int Y;

        /// <summary>
        /// The list of the point's neighboring points (Also includes points that are beyond the board's borders).
        /// </summary>
        public List<BoardPoint> Neighbors { get { return new List<BoardPoint> { Above(), Below(), Right(), Left() }; } }

        /// <summary>
        /// Create a new board point by specifying its X and Y coordinates.
        /// </summary>
        /// <param name="x">The X coordinate of the point.</param>
        /// <param name="y">The Y coordinate of the point.</param>
        public BoardPoint(int x, int y)
        {
            X = x;
            Y = y;
        }

        /// <summary>
        /// Gets the point's neighboring board point from above.
        /// </summary>
        /// <returns>The point's neighboring board point from above.</returns>
        public BoardPoint Above()
        {
            return new BoardPoint(X, Y - 1);
        }

        /// <summary>
        /// Gets the point's neighboring board point from below.
        /// </summary>
        /// <returns>The point's neighboring board point from below.</returns>
        public BoardPoint Below()
        {
            return new BoardPoint(X, Y + 1);
        }

        /// <summary>
        /// Gets the point's neighboring board point to the right.
        /// </summary>
        /// <returns>The point's neighboring board point to the right.</returns>
        public BoardPoint Right()
        {
            return new BoardPoint(X + 1, Y);
        }

        /// <summary>
        /// Gets the point's neighboring board point to the left.
        /// </summary>
        /// <returns>The point's neighboring board point to the left.</returns>
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
