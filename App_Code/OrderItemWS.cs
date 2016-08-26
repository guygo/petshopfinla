using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Services;

/// <summary>
/// Summary description for OrderItemWS
/// </summary>
[WebService(Namespace = "http://petshop.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
 [System.Web.Script.Services.ScriptService]
public class OrderItemWS : System.Web.Services.WebService
{

    public OrderItemWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public bool addOrder(string Email, string Phone, string ProductName,int shopid)
    {
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;

        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        SqlCommand com = new SqlCommand("INSERT INTO Orders VALUES('" + ProductName + "','" + Phone + "','" +  Email + "','"+shopid +"')", con);

        int rows = com.ExecuteNonQuery();
        con.Close();
        if (rows==1)
        return true;

        return false;
    }

}
