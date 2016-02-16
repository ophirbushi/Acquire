using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace Acquire
{
    public class Tile : INotifyPropertyChanged
    {
        public const string PROPERTY_NAME_Hotel = "Hotel";

        public event PropertyChangedEventHandler PropertyChanged;

        [XmlAttribute]
        public int X, Y;
        public BoardPoint Point {
            get { return new BoardPoint(X, Y); }         
        }

        private bool _occupied = false;
        [XmlAttribute]
        public bool Occupied
        {
            get { return _occupied; }
            set
            {
                _occupied = value;
                if (value == false)
                {
                    Hotel = HotelsManager.HotelNameHotelDictionary[Hotel.HOTEL_NAME_NEUTRAL];
                }
            }
        }
        private Hotel _hotel = HotelsManager.HotelNameHotelDictionary[Hotel.HOTEL_NAME_NEUTRAL];
        public Hotel Hotel
        {
            get { return _hotel; }
            set
            {
                _hotel = value;
                NotifyPropertyChanged(PROPERTY_NAME_Hotel);
            }
        }

        public Tile()
        {

        }
        public Tile(int x, int y)
        {
            X = x;
            Y = y;
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
