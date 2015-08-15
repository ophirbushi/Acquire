using Acquire;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AcquireSimulator
{
    public partial class StockSelectionDialog : Form
    {
        public event EventHandler OK_Clicked;

        public Player _player;
        public int _cash;
        public int _selectedStocksNumber = 0;
        public List<NumericUpDown> _numericUpDowns = new List<NumericUpDown>();
        public List<Label> _stocksLeft = new List<Label>();
        public List<StockPurchase> ReturnList = new List<StockPurchase>();

        public StockSelectionDialog()
        {
            InitializeComponent();
        }

        public StockSelectionDialog(Player player)
        {
            InitializeComponent();
            _player = player;
            _cash = player.Cash;
            InitPlayer();
            label1.Text = String.Format("${0}",_cash);
        }

        private void InitPlayer()
        {
            int index = -1;
            foreach (var hotelName in Hotel.HOTEL_NAMES)
            {
                index++;
                Label l = new Label
                {
                    Location = new Point(12 + 70 * index, 190),
                    Size = new Size(70, 15),
                    Text = hotelName,
                    TextAlign = ContentAlignment.MiddleCenter
                };

                NumericUpDown n = new NumericUpDown
                {
                    Location = new Point(12 + 70 * index, 205),
                    Size = new Size(70, 15),
                    Maximum = 3,
                    Enabled = HotelsManager.HotelsList.First(hotel => hotel.Name == hotelName).CurrentSize > 0,
                    Tag = hotelName
                };

                Label l1 = new Label
                {
                    Location = new Point(12 + 70 * index, 225),
                    Size = new Size(70, 15),
                    Text = HotelsManager.StockBank.AllStocks.First(hotel => hotel.HotelName == hotelName).Quantity.ToString(),
                    TextAlign = ContentAlignment.MiddleCenter,
                    Tag = hotelName
                };

                Label l2 = new Label
                {
                    Location = new Point(12 + 70 * index, 245),
                    Size = new Size(70, 15),
                    Text = HotelsManager.HotelsList.First(hotel => hotel.Name == hotelName).CurrentSize > 0 ?
                    "$" + HotelsManager.HotelsList.First(hotel => hotel.Name == hotelName).CurrentStockValue.ToString() : "",
                    TextAlign = ContentAlignment.MiddleCenter,
                    Tag = hotelName
                };


                n.ValueChanged += n_ValueChanged;
                this._numericUpDowns.Add(n);
                this._stocksLeft.Add(l1);
                this.Controls.Add(l);
                this.Controls.Add(n);
                this.Controls.Add(l1);
                this.Controls.Add(l2);
            }
        }

        void n_ValueChanged(object sender, EventArgs e)
        {
            var numericUpDown = sender as NumericUpDown;
            _selectedStocksNumber = 0;
            _numericUpDowns.ForEach(item => _selectedStocksNumber += (int)item.Value);
            _cash = _player.Cash;
            foreach (var numeric in _numericUpDowns.Where(n => n.Value > 0)) 
                _cash -= HotelsManager.HotelsList.First(
                    Hotel => Hotel.Name == (string)numeric.Tag).CurrentStockValue * (int)numeric.Value;

            if (_selectedStocksNumber > 3 || _cash < 0 || HotelsManager.StockBank.AllStocks.Any(hotel=> hotel.Quantity < _numericUpDowns.First(num=> (string)num.Tag == hotel.HotelName).Value))
            {
                numericUpDown.Value -= 1;
                _cash = _player.Cash;
                foreach (var numeric in _numericUpDowns.Where(n => n.Value > 0))
                    _cash -= HotelsManager.HotelsList.First(
                        Hotel => Hotel.Name == (string)numeric.Tag).CurrentStockValue * (int)numeric.Value;          
            }
            _stocksLeft.ForEach(l => l.Text = (HotelsManager.StockBank.AllStocks.First(
                hotel => hotel.HotelName == (string)l.Tag).Quantity - (int)_numericUpDowns.First(n => (string)n.Tag == (string)l.Tag).Value).ToString());
            label1.Text = String.Format("${0}", _cash);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            foreach(var numericUpDown in _numericUpDowns.Where(n=> n.Value > 0))
            {
                ReturnList.Add(new StockPurchase(HotelsManager.HotelsList.First(Hotel => Hotel.Name == (string)numericUpDown.Tag), (int)numericUpDown.Value));
            }
            if (OK_Clicked != null)  
                OK_Clicked(this, new EventArgs());
            
            this.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.Close();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
