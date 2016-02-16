using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;


namespace Acquire
{
    /// <summary>
    /// The board of the game.
    /// </summary>
    public static class Board
    {
        /// <summary>
        /// The number of tiles in every row of the board.
        /// </summary>
        public const int WIDTH = 12;

        /// <summary>
        /// The number of tiles in every column of the board.
        /// </summary>
        public const int HEIGHT = 9;

        /// <summary>
        /// The tiles of the board.
        /// </summary>
        public static readonly Tile[,] Tiles = new Tile[WIDTH, HEIGHT];

        /// <summary>
        /// The current tile groups on board.
        /// </summary>
        public static List<TileGroup> TileGroups = new List<TileGroup>();

        /// <summary>
        /// A dictionary which receives a point on board as a key, and returns to which tile group does the point belong.
        /// </summary>
        public static Dictionary<BoardPoint, TileGroup> PointGroupDictionary = new Dictionary<BoardPoint, TileGroup>();

        /// <summary>
        /// Generates the board's tiles according to its width and height.
        /// </summary>
        public static void Initialize()
        {
            Tile tile;
            for (var x = 0; x < WIDTH; x++)
            {
                for (var y = 0; y < HEIGHT; y++)
                {
                    tile = new Tile(new BoardPoint(x, y));
                    Tiles[x, y] = tile;
                }
            }
        }
    }
}
