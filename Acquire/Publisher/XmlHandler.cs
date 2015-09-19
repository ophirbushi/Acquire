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
            using (var sw = new StreamWriter(Environment.CurrentDirectory + "/gamestate.xml"))
            {
                _xmlSerializer.Serialize(sw, gameState);
            }
        }
    }
}
