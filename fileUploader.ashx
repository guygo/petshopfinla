<%@ WebHandler Language="C#" Class="fileUploader" %>


using System;
using System.Web;

public class fileUploader : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string savedFileName = "";
        string length = "0";
        string rfile="";
        foreach (string file in context.Request.Files)
        {
            HttpPostedFile hpf = context.Request.Files[file] as HttpPostedFile;
            length = hpf.ContentLength.ToString();
            if (hpf.ContentLength == 0)
                continue;
            try
            {
                savedFileName = context.Server.MapPath(".") + "\\pics\\" + hpf.FileName ;
                rfile = hpf.FileName.ToString();
            }
            catch (Exception ex)
            {
                context.Response.Write("there was an error: " + ex.Message);
                return;
            }

            hpf.SaveAs(savedFileName);
        }
        context.Response.Write(rfile);

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}