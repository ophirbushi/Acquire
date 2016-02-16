using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Acquire
{
    public static class XmlHandler
    {
        private static XmlSerializer _xmlSerializer = new XmlSerializer(typeof(GameState));

        public static void SerializeGameState(GameState gameState)
        {
            var path = Environment.CurrentDirectory + "/gamestate.xml";
            using (var sw = new StreamWriter(path))
            {
                _xmlSerializer.Serialize(sw, gameState);
            }
        }

        public static GameState DeserializeGameState()
        {
            var path = Environment.CurrentDirectory + "/gamestate.xml";
            GameState gameState;
            using (var sr = new StreamReader(path))
            {
                gameState = _xmlSerializer.Deserialize(sr) as GameState;
            }
            return gameState;
        }
    }
}
