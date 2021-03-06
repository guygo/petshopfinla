﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Services;

/// <summary>
/// Summary description for ShopsWS
/// </summary>
[WebService(Namespace = "http://petshop.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
 [System.Web.Script.Services.ScriptService]

public class ShopsWS : System.Web.Services.WebService
{

    public ShopsWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string[] GetShopsAdress()
    {
        string[] adrress;
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand("SELECT * FROM Shops ", con);

        SqlCommand comm = new SqlCommand("SELECT COUNT(*) FROM Shops", con);
        Int32 count = (Int32)comm.ExecuteScalar();

        adrress = new string[count];
        SqlDataReader reader = com.ExecuteReader();


        int i = 0;
        while (reader.Read())
        {

            adrress[i] = reader["Adress"].ToString();
                i++;
        }
        con.Close();
        return adrress;

    }

    [WebMethod]
    public List<Shop> GetShops()
    {
        List<Shop> items = new List<Shop>();
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand("SELECT * FROM Shops ", con);

       

         
        SqlDataReader reader = com.ExecuteReader();


       
        while (reader.Read())
        {

            items.Add(new Shop {
                Name = reader["ShopName"].ToString(),
                Phone = reader["PhoneNumber"].ToString(),
                Adress = reader["Adress"].ToString(),
                Id =  reader["id"].ToString()

            });
           
        }
        con.Close();

        return items;
    }



}
