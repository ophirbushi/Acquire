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
            _xmlSerializer.Serialize(new StreamWriter(Environment.CurrentDirectory + "/gamestate.xml"), gameState);
        }
    }
}
