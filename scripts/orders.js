$(document).on("pagebeforeshow", "#OrderPage", function (event) {

    $("#myselect").val("");
    $("#fullname").val("");
    $("#phone").val("");
    $("#date").val("");
    $("#time").val("");
});

$(document).on("pageinit", "#OrderPage", function (event) {
    wireEventsOrderPage();
});
function wireEventsOrderPage() {

    $('#orderbtn').on('click', function () {

        

        if (($("#fullname").val() == "" || $("#fullname").val() == null) || ($("#phone").val() == "" || $("#phone").val() == null)
            || ($("#date").val() == "" || $("#date").val() == null)
            || ($("#time").val() == "" || $("#time").val() == null)) {
            msg('<h2>all field must  be filled out!</h2>', 'info', function () {

            });
            return;
        }


        if (!phonenumber($("#phone").val())) {
            msg('<h2>invalid phone number!</h2>', 'info', function () {

            });
            return;

        }
        str = $("#fullname").val().replace(/("|')/g, "");


        mdata = {
            'UserName': str,
            'Phone': $("#phone").val(),
            'date': $("#date").val(),
            'shopname': sessionStorage.name,
            'time': $("#time").val()
        };

        insertdata(mdata);

    });



}
function msg(_msg, _title, _okCB) {
    try {
        if (_title == null || _title == undefined || _title == '') {
            _title = 'Information';
        }
        if (_msg == null || _msg == undefined || _msg == '') {
            _msg = 'Error found. Please contact your administrator.';
        }
        // Create it in memory
        var dlg = $("<div id=\"dlgAlert\" class=\"ui-corner-all ui-shadow\" data-close-btn=\"right\" />")
            .attr("data-role", "dialog")
            .attr("id", "dialog");

        var header = $("<div />")
            .attr("data-role", "header")
            .attr("role", "banner")
            .html("<h2>" + _title + "</h2>");

        var content = $("<div style=\"padding: 15px;\" />")
            .attr("data-role", "content")
            .append($("<p />").html(_msg));

        content.append("<div ><a class='dlgalert' href='#index' data-rel='back'  data-role=\"button\"    data-theme=\"a\" >Close</a></div>");

        dlg.append(header).trigger('create');
        dlg.append(content).trigger('create');



        dlg.dialog({
            close: function (event, ui) {
                _okCB();  //this line is not called
            }
        }).appendTo($.mobile.pageContainer);

        $.mobile.changePage(dlg, {
            transition: "pop",
            role: "dialog",
            reverse: false

        });



    } catch (e) {
        alert('error!');
    }

}



function insertdata(mdata) {
    WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "OrderWS.asmx";


    $.support.cors = true;
    $.ajax({
        url: WebServiceURL + "/InsertOrder",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(mdata),
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert("error");
        },
        success: function (data) {

            if (data.d == null) {
                msg('<h2>your appointment in  ' + $("#date").val() + '  ' + $("#time").val() + '<br>has been confrimed  !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                });
            }
            if (data.d.indexOf("exist") != -1)
            {
                msg('<h2>you are already made appointment  !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {
                    return;
                });

            }
            else {
                if (data.d.length >= 60) {
                    msg('<h2>All hours in This day has been occupied !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });
                }

                else {
                  
                    buildwindow(data.d, JSON.stringify(mdata));
                    window.location.href = "#DynamicOrderPage";
                    $("#DynamicOrderPage").bind("pagehide", function () {
                      
                        $("#myselect").empty();
                      
                    });
                }

            }
        }
    });


}


function buildwindow(times, data) {

    data = data.replace(/\s/g, '');

    timestopick = [];
    for (var i = 8; i <= 22; i++) {

        timestopick[i] = [i + ":00", i + ":15", i + ":30", i + ":45"];

    }
    var hour;
    var min;
    $("#myselect").empty();
    var timeto = [];
    
    var timetopay={};
    for (var i = 0; i < times.length; i++) {
        debugger;
        hour = times[i].slice(0, 2);
        min = times[i].slice(3, 5);
        if (timetopay[hour] == undefined) {
            timetopay[hour] = {};
        }
        timetopay[hour][min]=true;
    }
    
    for (var j = 8; j < 10; j++)
    {
        if (timetopay["0"+j.toString()] != undefined) {

            if (timetopay["0"+j.toString()]["00"])
                timeto.push("T");
            else {
                timeto.push(j + ":00");
            }

            for (var i = 1; i <= 3; i++) {

                if (timetopay["0" + j.toString()][(i * 15).toString()])
                    timeto.push("T");
                else {
                    timeto.push(j + ":" + (i * 15));
                }

            }
        }
        else {
            timeto.push(j + ":00");
            timeto.push(j + ":15");
            timeto.push(j + ":30");
            timeto.push(j + ":45");
        }
    }

    for (var j = 10; j <= 22; j++) {

        if (timetopay[j.toString()] != undefined) {

            if (timetopay[j.toString()]["00"])
                timeto.push("T");
            else {
                timeto.push(j + ":00" );
            }

            for (var i = 1; i <= 3; i++) {
                
                if (timetopay[j.toString()][(i*15).toString()])
                    timeto.push("T");
                else
                {
                    timeto.push(j + ":" + (i * 15));
                }

            }
        }
        else {
            timeto.push(j + ":00");
            timeto.push(j + ":15");
            timeto.push(j + ":30");
            timeto.push(j + ":45");
        }
    }
   
    for (var i = 0; i < timeto.length; i++) {

        if (timeto[i]!="T")
        $("#myselect").append("<option>"+timeto[i]+"</option>");
    }
   
    
    $("#myselect").selectmenu();
   
    sessionStorage['orderdata'] = data;
}
function addagain()
{

    debugger;
    var x = $("#myselect").val(); //document.getElementById("myselect").value;
    data = JSON.parse(sessionStorage['orderdata']);
   
    data.time = x;
   
    data.shopname = sessionStorage.name;
   
    insertdatawindow(data,x)

}
function insertdatawindow(data, x) {
  
    WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "OrderWS.asmx";


    $.support.cors = true;
    $.ajax({
        url: WebServiceURL + "/InsertOrder",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert("error");
        },
        success: function (data) {

            if (data.d == null) {
                msg('<h2>your appointment in  ' + $("#date").val() + '  ' + x + '<br>has been confrimed  !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                });
            }
            else {
                if (data.d.length >= 60) {
                    msg('<h2>All hours in This day has been occupied !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });
                }

                else {
                    msg('<h2>sorry a error has been occured !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });
                }

            }
        }
    });

}