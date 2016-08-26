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
public class Products : System.Web.Services.WebService
{

    public Products()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public List<ProductClass> GetProducts(string id)
    {
        List<ProductClass> items = new List<ProductClass>();
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
        SqlConnection con = new SqlConnection(conStr);

       
        SqlCommand comshopsandproducts = new SqlCommand("SELECT ProductId FROM ShopsProducts where ShopId= "+id, con);
        con.Open();
        SqlDataReader reader = comshopsandproducts.ExecuteReader();
        List<string> Ids = new List<string>();
        while (reader.Read())
        {

            Ids.Add(reader["ProductId"].ToString());

        }


        con.Close();
        string str = "";
        foreach (var item in Ids)
        {
            str += "'" + item + "',";
        }
        str = str.Remove(str.Length-1);

        SqlCommand com = new SqlCommand("SELECT * FROM Products where id in("+str+")", con);
        con.Open();



        reader = com.ExecuteReader();



        while (reader.Read())
        {

            items.Add(new ProductClass
            {
                Title = reader["Title"].ToString(),
                imgUrl = reader["imgUrl"].ToString(),
                description = reader["description"].ToString()


            });

        }
        con.Close();

        return items;
    }

}
