<%@ WebService Language="C#" CodeBehind="~/App_Code/ShowOrdersAndMeetingWS.cs" Class="ShowOrdersAndMeetingWS" %>
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Services;

/// <summary>
/// Summary description for ShowOrdersAndMeetingWS
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class ShowOrdersAndMeetingWS : System.Web.Services.WebService
{

    public ShowOrdersAndMeetingWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public List<orders> GetOrders(string shopid)
    {
        List<orders> orders = new List<orders>();

        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
        SqlConnection con = new SqlConnection(conStr);

        string command = "SELECT * FROM Orders WHERE shopid=" + shopid;
        SqlCommand com = new SqlCommand(command, con);
        con.Open();

        var reader = com.ExecuteReader();



        while (reader.Read())
        {

            orders.Add(new orders
            {
                item = reader["ProductName"].ToString(),
                mail = reader["CustomerMail"].ToString(),
                phone = reader["CustmerPhone"].ToString()
            });

        }
        con.Close();



        return orders;
    }
    [WebMethod]
    public List<meetings> GetMeetings(string shopname)
    {
        try
        {
            List<meetings> meets = new List<meetings>();
            string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;
            SqlConnection con = new SqlConnection(conStr);

            string command = "SELECT * FROM meetings WHERE shopname=@shopname";
            
            SqlCommand com = new SqlCommand(command, con);
            com.Parameters.AddWithValue("@shopname", shopname);
            con.Open();

            var reader = com.ExecuteReader();



            while (reader.Read())
            {

                meets.Add(new meetings
                {
                    date = reader["date"].ToString(),
                    time = reader["time"].ToString(),
                    name = reader["name"].ToString(),
                    phone = reader["phone"].ToString()
                });

            }
            con.Close();
            return meets;
        }
        catch (Exception e) { return new List<meetings>();  }
        
        }


    public class orders {
       public string item { get; set; }
        public string phone { get; set; }
        public string mail { get; set; }
       

        public orders() { }
    }
    public class meetings
    {
        public string date { get; set; }
        public string  time{ get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public meetings() { }
   
    }


}
