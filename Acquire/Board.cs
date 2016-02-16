using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

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
        [XmlIgnore]
        public static Tile[,] Tiles = new Tile[WIDTH, HEIGHT];

        /// <summary>
        /// For xml serialization.
        /// </summary>
        public static List<Tile> TileList = new List<Tile>();


        /// <summary>
        /// The current tile groups on board.
        /// </summary>
        public static List<TileGroup> TileGroups = new List<TileGroup>();

        /// <summary>
        /// A dictionary which receives a point on board as a key, and returns to which tile group does the point belong.
        /// </summary>
        public static Dictionary<BoardPoint, TileGroup> PointGroupDictionary = new Dictionary<BoardPoint, TileGroup>();

        public static Dictionary<BoardPoint, Tile> PointTileDictionary = new Dictionary<BoardPoint, Tile>();

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
                    tile = new Tile(x, y);
                    Tiles[x, y] = tile;
                    TileList.Add(tile);
                    PointTileDictionary[tile.Point] = tile;
                }
            }
        }

        public static void Load(List<Tile> tileList, List<TileGroup> tileGroups)
        {
            TileList = new List<Tile>(tileList);
            Tiles = new Tile[WIDTH, HEIGHT];
            TileGroups = new List<TileGroup>(tileGroups);
            PointTileDictionary = new Dictionary<BoardPoint, Tile>();
            PointGroupDictionary = new Dictionary<BoardPoint, TileGroup>();
            foreach (var tile in tileList)
            {
                Tiles[tile.X, tile.Y] = tile;
                PointTileDictionary[tile.Point] = tile;
            }
            foreach (var group in tileGroups)
            {
                foreach(var tile in group.Tiles)
                {
                    PointGroupDictionary[tile.Point] = group;
                }
            }
        }
    }
}
