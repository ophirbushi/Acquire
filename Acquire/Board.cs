using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;


namespace Acquire
{
    public static class Board
    {
        public const int WIDTH = 12;
        public const int HEIGHT = 9;

        public static readonly Tile[,] Tiles = new Tile[WIDTH, HEIGHT];
        public static List<TileGroup> TileGroups = new List<TileGroup>();

        public static Dictionary<BoardPoint, TileGroup> PointGroupDictionary = new Dictionary<BoardPoint, TileGroup>();

        public static void Initialize()
        {
            Tile tile;
            for (var x = 0; x < WIDTH; x++)
                for (var y = 0; y < HEIGHT; y++)
                {
                    tile = new Tile(x, y);
                    Tiles[x, y] = tile;
                }
        }
    }
}
