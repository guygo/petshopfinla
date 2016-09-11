<%@ WebService Language="C#" CodeBehind="~/App_Code/AddStore.cs" Class=" UserStore" %>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Web.Configuration;
/// <summary>
/// Summary description for AddStore
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class UserStore : System.Web.Services.WebService
{
    private string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
    public UserStore()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string AddStores(string name, string phone, string address, string pic,string userid)
    {
        try
        {
           
            SqlConnection con = new SqlConnection(conStr);
            con.Open();

            SqlCommand com = new SqlCommand("INSERT INTO Shops (ShopName, Address,PhoneNumber, picture) VALUES(@shopname,@address,@phone,@pic)", con);
            com.Parameters.AddWithValue("@shopname", name);
            com.Parameters.AddWithValue("@phone", phone);
            com.Parameters.AddWithValue("@address", address);
            com.Parameters.AddWithValue("@pic", pic);



             var reader = com.ExecuteNonQuery();
            con.Close();

            string id = getShopId();

            if (userid != "")
            {
                con.Open();
                com = new SqlCommand("INSERT INTO ShopsUsers VALUES('" + id + "','" + userid + "') ", con);
                 reader = com.ExecuteNonQuery();
                con.Close();
            }
            return id;
        }
        catch (Exception ex) { return "none"; }

    }

    [WebMethod]
    public List<Usershop> GetUserStore(string userid)
    {
        List<Usershop> shops = new List<Usershop>();

        String command = " SELECT ShopsUsers.shopid, Shops.ShopName,Shops.id FROM ShopsUsers LEFT JOIN Shops ON ShopsUsers.shopid=shops.id WHERE ShopsUsers.userid="+userid;
        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand(command, con);
        var reader = com.ExecuteReader();
        while (reader.Read())
        {
            shops.Add(new Usershop { shopname=reader["ShopName"].ToString(),shopid=reader["id"].ToString()});
        }
        con.Close();

        return shops;
    }

    public class Usershop
    {
        public string shopname { get; set; }
        public string shopid { get; set; }


        public  Usershop()
        {
            //
            // TODO: Add constructor logic here
            //
        }
    }

    private string getShopId()
    {
        string str = "";
        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand("SELECT top 1 *  FROM Shops Order by id Desc;", con);
        var reader = com.ExecuteReader();
        while (reader.Read())
        {
            str = reader["id"].ToString();
        }
        con.Close();



        return str;
    }

}


