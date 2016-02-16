using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace Acquire
{
    public class Tile : INotifyPropertyChanged
    {
        public const string PROPERTY_NAME_Hotel = "Hotel";

        public event PropertyChangedEventHandler PropertyChanged;

        public BoardPoint Point;
        public int X { get { return Point.X; } }
        public int Y { get { return Point.Y; } }

        private bool _occupied = false;
        public bool Occupied
        {
            get { return _occupied; }
            set
            {
                _occupied = value;
                if (value == false)
                    Hotel = Hotel.Neutral;
            }
        }
        private Hotel _hotel = Hotel.Neutral;
        public Hotel Hotel
        {
            get { return _hotel; }
            set
            {
                _hotel = value;
                NotifyPropertyChanged(PROPERTY_NAME_Hotel);
            }
        }

        public Tile(BoardPoint point)
        {
            Point = point;
        }

        private void NotifyPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }

        public override string ToString()
        {
            return String.Format("{0},{1}", X, Y);
        }

    }
}
