using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Globalization;

/// <summary>
/// Summary description for OrderWS
/// </summary>
[WebService(Namespace = "http://petshop.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class OrderWS : System.Web.Services.WebService
{

    public OrderWS()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }


    [WebMethod]
    public List<DateTime> InsertOrder(string UserName, string Phone, string date, string time)
    {
        string conStr = WebConfigurationManager.ConnectionStrings["conString"].ConnectionString;

        List<DateTime> meetings = new List<DateTime>();



        SqlConnection con = new SqlConnection(conStr);
        con.Open();
        // modify the format depending upon input required in the column in database 
        SqlCommand checkcom = new SqlCommand("select * from meetings ", con);
        SqlDataReader reader = checkcom.ExecuteReader();


        DateTime myDate;

        string str;
        bool exist = false;
        TimeSpan ts;

        string t;
        string s;
        while (reader.Read())
        {

            t = reader["time"].ToString();
            try
            {
                myDate = DateTime.Parse(reader["date"].ToString());
            }
            catch (Exception e)
            {
                myDate = DateTime.Now;
            }
            s = myDate.ToString("dd/MM/yyyy");
            try
            {
                ts = TimeSpan.Parse(t);
            }
            catch (Exception e)
            {
                ts = DateTime.Now.TimeOfDay;
            }
            myDate = myDate.Add(ts);
            meetings.Add(myDate);
            str = s + " " + t.Substring(0, t.Length - 3);
            if (str.Equals(date + " " + time))
            {
                exist = true;
            }
        }
        con.Close();
        if (!exist)
        {

            con.Open();
            SqlCommand com = new SqlCommand("INSERT INTO meetings VALUES('" + date + "','" + time + "','" + UserName + "','" + Phone + "')", con);

            int rows = com.ExecuteNonQuery();

            con.Close();
            return null;
        }


        return meetings;
    }
}
