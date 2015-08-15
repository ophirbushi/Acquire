using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Acquire
{
    public class TileGroup
    {
        public Hotel Hotel = Hotel.Neutral;
        public List<Tile> Tiles = new List<Tile>();
        public int Size { get { return Tiles.Count; } }

        public TileGroup()
        {
            Board.TileGroups.Add(this);
        }

        public TileGroup(Tile tile)
        {
            Board.TileGroups.Add(this);
            AddTiles(tile);
        }

        public TileGroup(List<Tile> tiles)
        {
            Board.TileGroups.Add(this);
            AddTiles(tiles);
        }

        public void AddTiles(Tile tile)
        {
            Debug.Assert(!Tiles.Contains(tile), "Duplicate Tile in TileGroup");
            tile.Hotel = this.Hotel;
            Tiles.Add(tile);
            if (!Board.PointGroupDictionary.ContainsKey(tile.Point))
                Board.PointGroupDictionary.Add(tile.Point, this);
            else if (Board.PointGroupDictionary[tile.Point] != this)
            {
                Board.PointGroupDictionary.Remove(tile.Point);
                Board.PointGroupDictionary.Add(tile.Point, this);
            }
                Debug.Assert(Board.PointGroupDictionary[tile.Point] == this, 
                    "Board Dictionary has wrong value for this tile.");
            Debug.Assert(tile.Occupied == true, "Unoccupied Tiles in Tile Group");
        }

        public void AddTiles(List<Tile> tileList)
        {
            foreach(Tile tile in tileList)
                AddTiles(tile);     
        }

        public override string ToString()
        {
            return String.Format("Tile-Group : {0}", Hotel.Name);
        }

    }
}
