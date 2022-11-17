using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Fmcc.Extension
{
    public class ComplexLetterCollection
    {
        public static byte[] bytes = ASCIIEncoding.ASCII.GetBytes("w/WJkhrt"); // w/WJkhrt is a name that is must be 8 characters
        public static string getTangledLetters(string inputLine)
        {
            try
            {
                DESCryptoServiceProvider serviceprovider = new DESCryptoServiceProvider();
                MemoryStream Mstream = new MemoryStream();
                CryptoStream Cstream = new CryptoStream(Mstream, serviceprovider.CreateEncryptor(bytes, bytes), CryptoStreamMode.Write);

                StreamWriter Writer = new StreamWriter(Cstream);
                Writer.Write(inputLine);
                Writer.Flush();
                Cstream.FlushFinalBlock();
                Writer.Flush();
                return Convert.ToBase64String(Mstream.GetBuffer(), 0, (int)Mstream.Length);



            }

            catch { return "r"; }// r is a variable thath is unessential
        }
        public static string getEntangledLetters(string inputline)
        {
            try
            {
                DESCryptoServiceProvider DserviceProvider = new DESCryptoServiceProvider();
                MemoryStream DMstream = new MemoryStream(Convert.FromBase64String(inputline));
                CryptoStream DCstream = new CryptoStream(DMstream, DserviceProvider.CreateDecryptor(bytes, bytes), CryptoStreamMode.Read);

                StreamReader reader = new StreamReader(DCstream);
                return reader.ReadToEnd();
            }
            catch { return "r"; } // r is a variable thath is unessential

        }
    }
}