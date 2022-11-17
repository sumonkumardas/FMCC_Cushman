using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;

namespace Fmcc.Utility
{
    public class ComplexLetters
    {
        private static byte[] bytes;

        public ComplexLetters()
        {
            // w/WJkhrt is a name that must be 8 characters
            bytes = ASCIIEncoding.ASCII.GetBytes("w/WJkhrt");
        }

        public static string getTangledLetters(string inputLine)
        {
            try
            {
                StreamWriter Writer;
                MemoryStream Mstream;
                CryptoStream Cstream;
                DESCryptoServiceProvider serviceprovider;

                Mstream = new MemoryStream();
                serviceprovider = new DESCryptoServiceProvider();
                Cstream = new CryptoStream(Mstream, serviceprovider.CreateEncryptor(bytes, bytes), CryptoStreamMode.Write);
                Writer = new StreamWriter(Cstream);
                Writer.Write(inputLine);
                Writer.Flush();
                Cstream.FlushFinalBlock();
                Writer.Flush();
                return Convert.ToBase64String(Mstream.GetBuffer(), 0, (int)Mstream.Length);
            }
            catch
            {
                // r is a variable thath is unessential
                return "r";
            }
        }

        public static string getEntangledLetters(string inputline)
        {
            try
            {
                StreamReader Reader;
                MemoryStream DMstream;
                CryptoStream DCstream;
                DESCryptoServiceProvider DserviceProvider;

                DserviceProvider = new DESCryptoServiceProvider();
                DMstream = new MemoryStream(Convert.FromBase64String(inputline));
                DCstream = new CryptoStream(DMstream, DserviceProvider.CreateDecryptor(bytes, bytes), CryptoStreamMode.Read);
                Reader = new StreamReader(DCstream);
                return Reader.ReadToEnd();
            }
            catch
            {
                // r is a variable thath is unessential
                return "r";
            }
        }
    }
}