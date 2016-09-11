<%@ WebService Language="C#" CodeBehind="~/App_Code/UserWS.cs" Class="UserWS" %>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.IO;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Security.Cryptography;
using System.Web.Configuration;
/// <summary>
/// Summary description for UserWS
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class UserWS : System.Web.Services.WebService
{
    string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
    public UserWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }



    private bool checkifexist(string name) {

        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        bool val = false;
        SqlCommand com = new SqlCommand("SELECT * FROM Sellers", con);
        var reader = com.ExecuteReader();
        while (reader.Read())
        {
            if (reader["UserName"].ToString() == name.ToLower())
            {
                val=true;
                break;
            }

        }

        con.Close();
        return val;
    }
    [WebMethod]
    public string Login(string name, string password)
    {
        try
        {

            SqlConnection con = new SqlConnection(conStr);

            con.Open();
            string x= "name does not exist";


            SqlCommand com = new SqlCommand("SELECT * FROM Sellers", con);
            var reader = com.ExecuteReader();
            while (reader.Read())
            {
                if (reader["UserName"].ToString() == name.ToLower())
                {
                    x= password == Decrypt(reader["Password"].ToString())? reader["id"].ToString() : "Wrong password";
                }


            }

            con.Close();


            return x;
        }
        catch (Exception ex) { return "failed to login"; }
    }

    [WebMethod]
    public string Register(string name,string password)
    {
        try
        {

            if (checkifexist(name))
                return "already exist";
            SqlConnection con = new SqlConnection(conStr);
            con.Open();

            SqlCommand com = new SqlCommand("INSERT INTO Sellers (UserName, Password) VALUES(@name,'" + Encrypt(password) + "')", con);
            com.Parameters.AddWithValue("@name", name);
            
            com.ExecuteNonQuery();
            con.Close();

            string id = getlastId();
            return id.ToString();
        }
        catch (Exception ex) { return "failed to register"; }



    }
    private string getlastId()
    {
        string str = "";
        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand("SELECT TOP 1  *  FROM Sellers Order by id Desc;", con);
        var reader = com.ExecuteReader();
        while (reader.Read())
        {
            str = reader["id"].ToString();
        }
        con.Close();



        return str;
    }

    private string Encrypt(string clearText)
    {
        string EncryptionKey = "MAKV2SPBNI99212";
        byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
        using (Aes encryptor = Aes.Create())
        {
            Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
            encryptor.Key = pdb.GetBytes(32);
            encryptor.IV = pdb.GetBytes(16);
            using (MemoryStream ms = new MemoryStream())
            {
                using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(clearBytes, 0, clearBytes.Length);
                    cs.Close();
                }
                clearText = Convert.ToBase64String(ms.ToArray());
            }
        }
        return clearText;
    }

    private string Decrypt(string cipherText)
    {
        string EncryptionKey = "MAKV2SPBNI99212";
        byte[] cipherBytes = Convert.FromBase64String(cipherText);
        using (Aes encryptor = Aes.Create())
        {
            Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
            encryptor.Key = pdb.GetBytes(32);
            encryptor.IV = pdb.GetBytes(16);
            using (MemoryStream ms = new MemoryStream())
            {
                using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(cipherBytes, 0, cipherBytes.Length);
                    cs.Close();
                }
                cipherText = Encoding.Unicode.GetString(ms.ToArray());
            }
        }
        return cipherText;
    }

}
