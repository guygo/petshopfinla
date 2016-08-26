$(document).on("pageinit", "#OrderItemPage", function () {
    wireEventsOrderItemPage();

});
function wireEventsOrderItemPage() {
    $('#placeorder').on('click', function () {
        
        if (($("#email").val() == "" || $("#email").val() == null) || ($("#uphone").val() == "" || $("#uphone").val() == null))
        {

            msg('<h2>all field must  be filled out!</h2>', 'info', function () {
            });
           return;
        }
        if (!phonenumber($("#uphone").val()))
        {
            msg('<h2>invalid phone number!</h2>', 'info', function () {

            });
            return;

        }
            if (!validateEmail($("#email").val()))
            {
                msg('<h2>invalid maill adress!</h2>', 'info', function () {

                });
                return;
            }


            WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "OrderItemWS.asmx";

        $.support.cors = true;
        $.ajax({
            url:  WebServiceURL + "/addOrder",
            dataType: "json",

            type: "POST",
            data: "{'Email':'" + $("#email").val() + "'," +
                        "'Phone':'" + $("#uphone").val() + "'," +
                        "'ProductName':'" + sessionStorage['item'] + "'," +
                       "'shopid':'" + sessionStorage[sessionStorage.name] +
                        "'}",
            contentType: "application/json; charset=utf-8",
            error: function (err) {
                alert('error!');
            },
            success: function (data) {




                if (data.d) {
                    msg('<h2>your orderd was registerd successfully !<h2></br><p>see  you in our store ;) !</p>', 'info', function () {
                        alert('call back function');// this line is not called
                    });

                } else {
                    msg('failed', 'info', function () {
                        alert('call back function');// this line is not called
                    });
                }
            }
        });
    });
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
            alert(e);
        }

    }
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function phonenumber(inputtxt)  
{  
    var phoneno = /^\d{10}$/;  
    return phoneno.test(inputtxt);
    
}  