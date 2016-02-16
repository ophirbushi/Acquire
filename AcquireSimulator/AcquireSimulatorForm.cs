using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Acquire;
using System.Threading;

namespace AcquireSimulator
{
    public partial class AcquireSimulatorForm : Form, IInput
    {
        private delegate void InvokedMethod(object arg);

        private Dictionary<BoardPoint, Button> Point_Button_Dictionary;
        private Dictionary<string, Func<List<object>, object>> MethodName_Action_Dictionary;
        private Thread _gameThread;
        private ManualResetEvent _toggle = new ManualResetEvent(false);
        private string _curMethodName;
        private object _curReturnObject;
        private int _unit = 30;
        private List<Button> _curPlayerTileCardsButtons = new List<Button>();
        private List<Button> _mergingHotelButtons = new List<Button>();
        private List<Button> _yesNoButtons = new List<Button>();
        public AcquireSimulatorForm()
        {
            InitializeComponent();
            InitDictionary();
            InitBoard();

            BoardManager.GroupChanged += BoardManager_GroupChanged;
            // Board.TileChanged += Board_TileChanged;
            GameManager.CurrentPlayerChanged += GameManager_CurrentPlayerChanged;

            _gameThread = new Thread(() => GameManager.LoadGame(XmlHandler.DeserializeGameState(), this, new Publisher()));
            _gameThread.Start();

        }

        void BoardManager_GroupChanged(object sender, EventArgs e)
        {
            TileGroup tg = sender as TileGroup;
            this.BeginInvoke(new InvokedMethod(ChangeButtons), tg);
        }

        void GameManager_CurrentPlayerChanged(object sender, EventArgs e)
        {
            this.BeginInvoke(new Action(PlayerChanged));
        }

        //void Board_TileChanged(object sender, EventArgs e)
        //{
        //    Tile tile = sender as Tile;
        //    Thread.Sleep(1);
        //    this.BeginInvoke(new InvokedMethod(ChangeButton), tile);
        //}

        void PlayerChanged()
        {
            ClearCurPlayer();
            UpdateCurPlayer();
        }

        void UpdateCurPlayer()
        {
            GenerateTileCards();
            UpdateLabels();
        }

        void UpdateLabels()
        {
            nameLabel.Text = GameManager.CurrentPlayer.Name;
            cashLabel.Text = String.Format("{0}$", GameManager.CurrentPlayer.Cash);
        }

        void GenerateTileCards()
        {
            int index = 0;
            foreach (var card in GameManager.CurrentPlayer.TileCardBank)
            {
                index = GameManager.CurrentPlayer.TileCardBank.IndexOf(card);
                Button b = new Button
                {
                    Location = new Point(448 + (_unit * 2 * index), 345),
                    Size = new Size(50, 55),
                    Text = String.Format("{0}, {1}", card.X, card.Y),
                    Tag = card
                };
                _curPlayerTileCardsButtons.Add(b);
                b.Click += TileCardButton_Click;
                this.Controls.Add(b);
            }
        }

        void TileCardButton_Click(object sender, EventArgs e)
        {
            if (_curMethodName == Player.METHOD_NAME_SelectCard)
            {
                var b = (Button)sender;
                _curReturnObject = (TileCard)b.Tag;
                _toggle.Set();
            }
        }


        void ClearCurPlayer()
        {
            foreach (var b in _curPlayerTileCardsButtons)
            {
                this.Controls.Remove(b);
                try
                {
                    b.Dispose();
                }
                catch
                {

                }
            }
        }

        void ChangeButtons(object t)
        {
            var group = t as TileGroup;
            // if (Board.PointGroupDictionary.ContainsKey(tile.Point))
            foreach (Tile tile in group.Tiles)
            {
                Button b = Point_Button_Dictionary[tile.Point];
                b.Text = tile.Hotel.Name;
            }
            // button.Text = tile.Hotel.Name;
        }

        private void InitDictionary()
        {
            MethodName_Action_Dictionary = new Dictionary<string, Func<List<object>, object>> {
            {Player.METHOD_NAME_SelectCard, PlayerSelectCard},
            {Player.METHOD_NAME_SelectMergerHotel, PlayerSelectMergerHotel},
            {Player.METHOD_NAME_SelectSetUpHotel, PlayerSelectSetUpHotel},
            {Player.METHOD_NAME_SelectStocks, PlayerSelectStocks},
            {Player.METHOD_NAME_EndGame, EndGame}
            };
        }

        private void InitBoard()
        {
            Point_Button_Dictionary = new Dictionary<BoardPoint, Button>();
            //GameManager.NewGame();
            for (var i = 0; i < Board.WIDTH; i++)
            {
                Label l = new Label
                {
                    Size = new Size(_unit, _unit),
                    Location = new Point(_unit + _unit * i, 0),
                    Text = String.Format("{0}", i),
                    TextAlign = ContentAlignment.MiddleCenter
                };
                this.Controls.Add(l);
            }
            for (var j = 0; j < Board.HEIGHT; j++)
            {
                Label l = new Label
                {
                    Size = new Size(_unit, _unit),
                    Location = new Point(0, _unit + _unit * j),
                    Text = String.Format("{0}", j),
                    TextAlign = ContentAlignment.MiddleCenter
                };
                this.Controls.Add(l);
            }
            for (int x = 0; x < Board.WIDTH; x++)
                for (int y = 0; y < Board.HEIGHT; y++)
                {
                    Button b = new Button
                    {
                        Size = new Size(_unit, _unit),
                        Location = new Point(_unit + _unit * x, _unit + _unit * y)
                    };
                    Point_Button_Dictionary.Add(new BoardPoint(x, y), b);
                    this.Controls.Add(b);
                }
        }

        //object EndGame(List<object> args)
        //{
        //    for (var i = 0; i < 2; i++)
        //    {
        //        Button b = new Button
        //        {
        //            Location = new Point(448 + (_unit * 2 * i), 245),
        //            Size = new Size(50, 55),
        //            Text = i == 0 ? "Yes" : "No",
        //            Tag = i == 0
        //        };
        //        _yesNoButtons.Add(b);
        //        this.Controls.Add(b);
        //    }
        //}

        object EndGame(List<object> args)
        {
            this.Invoke(new Action(AskEndGame));
            _toggle.WaitOne();
            _toggle.Reset();
            return _curReturnObject;

        }

        void AskEndGame()
        {
            DialogResult result = MessageBox.Show("Do you want to end the game this turn?", "Acquire", MessageBoxButtons.YesNo);
            _toggle.Set();
            _curReturnObject = result == System.Windows.Forms.DialogResult.Yes;
        }


        void SelectHotel(List<Hotel> hotels)
        {
            int index;
            foreach (var hotel in hotels)
            {
                index = hotels.IndexOf(hotel);
                Button b = new Button
                {
                    Location = new Point(448 + (_unit * 2 * index), 245),
                    Size = new Size(50, 55),
                    Text = String.Format("{0}", hotel.Name),
                    Tag = hotel
                };
                _mergingHotelButtons.Add(b);
                b.Click += HotelButton_Click;
                this.Controls.Add(b);
            }
        }

        void HotelButton_Click(object sender, EventArgs e)
        {
            if (_curMethodName == Player.METHOD_NAME_SelectMergerHotel || _curMethodName == Player.METHOD_NAME_SelectSetUpHotel)
            {
                var b = (Button)sender;
                _curReturnObject = (Hotel)b.Tag;
                _toggle.Set();
                foreach (var button in _mergingHotelButtons)
                {
                    button.Dispose();
                }
                _mergingHotelButtons = new List<Button>();
            }
        }

        private object PlayerSelectCard(List<object> args)
        {
            _curMethodName = Player.METHOD_NAME_SelectCard;
            var cards = args.Select(item => item as TileCard).ToList();
            this.Invoke(new Action(PlayerChanged));
            _toggle.WaitOne();
            _toggle.Reset();
            return _curReturnObject;
        }

        private object PlayerSelectMergerHotel(List<object> args)
        {
            _curMethodName = Player.METHOD_NAME_SelectMergerHotel;
            var mergingHotels = args.Select(item => item as Hotel).ToList();
            this.Invoke(new Action<List<Hotel>>(SelectHotel), mergingHotels);
            _toggle.WaitOne();
            _toggle.Reset();
            return _curReturnObject;
        }

        private object PlayerSelectSetUpHotel(List<object> args)
        {
            _curMethodName = Player.METHOD_NAME_SelectSetUpHotel;
            var availableHotels = args.Select(item => item as Hotel).ToList();
            this.Invoke(new Action<List<Hotel>>(SelectHotel), availableHotels);
            _toggle.WaitOne();
            _toggle.Reset();
            return _curReturnObject;
        }

        private object PlayerSelectStocks(List<object> args)
        {
            _curMethodName = Player.METHOD_NAME_SelectStocks;
            _toggle.WaitOne();
            _toggle.Reset();
            return _curReturnObject;
        }


        public object GetInput(string methodName, List<object> args)
        {
            if (MethodName_Action_Dictionary.ContainsKey(methodName))
            {
                Func<List<object>, object> func = MethodName_Action_Dictionary[methodName];
                return func(args);
            }
            else
            {
                throw new Exception("Unknown Method-Name");
            }
        }

        void SelectingStocks(Player player)
        {
            _curReturnObject = new List<StockPurchase>();   
            var stocksDialog = new StockSelectionDialog(player);//.ShowDialog();     
            stocksDialog.OK_Clicked += stocksDialog_OK_Clicked;
            stocksDialog.ShowDialog();
            _toggle.Set();
        }

        void stocksDialog_OK_Clicked(object sender, EventArgs e)
        {
            var dialog = (StockSelectionDialog)sender;
            _curReturnObject = dialog.ReturnList;
        } 

        public List<StockPurchase> GetSelectedStocks(Player player)
        {
            this.BeginInvoke(new Action<Player>(SelectingStocks), player);
            _toggle.WaitOne();
            _toggle.Reset();
            return _curReturnObject as List<StockPurchase>;
        }


        public StockDecision GetStockDecision(Player player, Hotel mergingHotel, Hotel mergerHotel)
        {
            return new StockDecision(player, mergingHotel, mergerHotel, player.StockBank.NameStocksDictionary[mergingHotel.Name].Quantity, 0, 0);
        }


        public void ShowWinner()
        {
            //throw new NotImplementedException();
        }
    }
}
