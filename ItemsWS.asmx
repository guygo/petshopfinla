<%@ WebService Language="C#" CodeBehind="~/App_Code/ItemsWS.cs" Class="ItemsWS" %>

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Services;

/// <summary>
/// Summary description for Products
/// </summary>
[WebService(Namespace = "http://petsshop.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class ItemsWS : System.Web.Services.WebService
{
    private string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
    public ItemsWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public List<ItemsClass> GetItems(string shopid)
    {
        List<ItemsClass> items = new List<ItemsClass>();
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
        SqlConnection con = new SqlConnection(conStr);

        string command="SELECT  ShopsProducts.Shopid,ShopsProducts.Productid, Products.* FROM ShopsProducts LEFT JOIN Products ON ShopsProducts.ProductId=Products.id WHERE ShopsProducts.shopid="+shopid;
        SqlCommand com = new SqlCommand("SELECT * FROM Products", con);
        con.Open();

        var reader = com.ExecuteReader();



        while (reader.Read())
        {

            items.Add(new ItemsClass
            {
                Title = reader["Title"].ToString(),
                id = reader["id"].ToString(),
                check= false
            });

        }
        con.Close();

        com = new SqlCommand(command, con);
        con.Open();

        reader = com.ExecuteReader();


        int index;
        while (reader.Read())
        {

            index=items.FindIndex(it => it.id == reader["id"].ToString());
            items[index].check = true;

        }
        con.Close();







        return items;
    }

    [WebMethod]
    public bool AddToStore(string name,string description,string pic,string shopid,string []choosenitems)
    {
        try
        { SqlConnection con = new SqlConnection(conStr);
            SqlCommand com;
            if (name != "null" )
            {
                if (description == "null")
                    description = "";
                string lastid = AddItem(name, description, pic);
                con.Open();
                com = new SqlCommand("INSERT INTO ShopsProducts VALUES('" + shopid + "','" + lastid + "')", con);
                com.ExecuteNonQuery();
                con.Close();
            }


            for (int i = 0; i < choosenitems.Length; i++) {
                con.Open();
                com = new SqlCommand("INSERT INTO ShopsProducts VALUES('" + shopid + "','" + choosenitems[i] + "') ", con);
                com.ExecuteNonQuery();
                con.Close();

            }
            return true;
        }
        catch (Exception ex) { return false; }
    }

    private string AddItem(string name,string description,string pic)
    {



        SqlConnection con = new SqlConnection(conStr);
        con.Open();

        SqlCommand com = new SqlCommand("INSERT INTO Products (Title, imgUrl,description) VALUES(@title,@pic,@description) ", con);
        com.Parameters.AddWithValue("@title", name);
        com.Parameters.AddWithValue("@description", description);

        com.Parameters.AddWithValue("@pic", pic);


        var reader = com.ExecuteNonQuery();
        con.Close();
        return getLastItemId();


    }

    private string getLastItemId()
    {
        string str = "";
        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand("SELECT top 1 *  FROM Products Order by id Desc;", con);
        var reader = com.ExecuteReader();
        while (reader.Read())
        {
            str = reader["id"].ToString();
        }
        con.Close();



        return str;
    }



    public class ItemsClass
    {
        public string id { get; set; }
        public string Title { get; set; }
        public bool check { get; set; }

        public ItemsClass()
        {
            //
            // TODO: Add constructor logic here
            //
        }
    }

}





