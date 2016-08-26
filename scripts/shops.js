

       $(document).on("pageinit", "#ShopPage", function (event) {
           wireEventsShopPage();
       });

function wireEventsShopPage() {
    WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "ShopsWS.asmx";
    $.ajax({
        url:   WebServiceURL + "/GetShops",
        dataType: "json",

        type: "POST",
        data: "",
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert('error!');
        },
        success: function (data) {
            if (data.d != undefined) {


                $("#ShopPage").find("[data-role='content']").empty();
                $("#ShopPage").find("[data-role='content']").append('<div id="shop" data-role="controlgroup"></div>');
                        
          

                for (var i = 0; i < data.d.length; i++) {



                    $("#ShopPage").append("<div data-role='panel' id='myPanels" + i + "'>    <h2>" + data.d[i].Name + "</h2>" +
                        " <p>contact us</p><p>Phone: " + data.d[i].Phone + "</p><p>Adress: " + data.d[i].Adress + "</p>" +
                    "<a name='" + data.d[i].Name + "' onclick='myshop(this.name)' href='#OrderPage' data-rel='close' class='ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-arrow-r ui-btn-icon-left'>enter store</a> </div>");

                    $("#shop").append("<a  href='#myPanels" + i + "' class='ui-btn  ui-shadow'>" + data.d[i].Name + "</a>");
                    if (typeof (Storage) !== "undefined") {
                        sessionStorage[data.d[i].Name] = data.d[i].Id;
                    }

                }
                $("[data-role=panel]").panel().enhanceWithin();

            }
        }
    });
   
}



function getshops(callback) {
  
    WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "ShopsWS.asmx";
    $.support.cors = true;
    $.ajax({
        url: WebServiceURL + "/GetShops",
        dataType: "json",
       
        type: "POST",
        data: "",
        contentType: "application/json; charset=utf-8",
        error: function (err) {
           
            alert(JSON.stringify(err));
        },
        success: function (data) {
            
            callback(data);
           }
    });





}
function myshop(name) {

 
    if (typeof (Storage) !== "undefined") {
        sessionStorage.name = name;
    }
    // location.reload();
}