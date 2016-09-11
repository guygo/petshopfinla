//____________items___________________
$(document).on("pageshow", "#ItemsPage", function () {
    wireEventsItemsPage();

});
$(document).on("pagebeforeshow", "#ItemsPage", function () {
    
    $('#itemlist').empty();
});



function wireEventsItemsPage() {

    WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "Products.asmx";
    $('#itemlist').empty();
    $.support.cors = true;
    $.ajax({
        url:  WebServiceURL + "/GetProducts",
        dataType: "json",

        type: "POST",
        data: "{'id':'" + sessionStorage[sessionStorage.name] + "'}",
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert('error!');
        },
        success: function (data) {
          
            var liItem = " <li ><a href='#' ";

            for (var i = 0; i < data.d.length; i++) {
                var img = "<img src='." + data.d[i].imgUrl + "'height='100' width='100'>";
                var itemtoadd = liItem + "name=" + data.d[i].imgUrl + "  class='shopitems'" + " id='" + data.d[i].Title.replace(/ /g, '') + i + "' >" + img + "<h2>" + data.d[i].Title + "</h2></a></li>";
                $('#itemlist').append(itemtoadd).listview('refresh');

            }
            $(".shopitems").bind('click', function () {

                var target = $(this),
                  brand = target.find("h2").html(),

                  short = target.attr("id"),
                  closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
                  header = '<div data-role="header"><h7>' + brand + '</h7></div>',

                  
                img = '<img src=' + target.attr("name") + '  alt="' + brand + '" class="photo" >',
                  popup = '<div data-role="popup" id="popup-' + short + '" data-short="' + short + '" data-theme="a" data-overlay-theme="a" data-corners="false" data-tolerance="15"></div>';
                link = '</br><a name="' + short + '" onclick=saveItem(this.name) href="#OrderItemPage" class="ui-btn    ui-icon-arrow-r ">make a order</a>'

                // Create the popup.

                $(header)
                    .appendTo($(popup)
                        .appendTo($.mobile.activePage)
                        .popup())
                    .toolbar()
                    .before(closebtn)
                    .after(img).append(link);
                // Wait with opening the popup until the popup image has been loaded in the DOM.
                // This ensures the popup gets the correct size and position
                $(".photo", "#popup-" + short).load(function () {
                    // Open the popup
                    $("#popup-" + short).popup("open");
                    // Clear the fallback
                    clearTimeout(fallback);
                });
                // Fallback in case the browser doesn't fire a load event
                var fallback = setTimeout(function () {
                    $("#popup-" + short).popup("open");
                }, 2000);
            });
            // Set a max-height to make large images shrink to fit the screen.
            $(document).on("popupbeforeposition", ".ui-popup", function () {
                var image = $(this).children("img"),
                    height = image.height(),
                    width = image.width();
                // Set height and width attribute of the image
                $(this).attr({ "height": height, "width": width });
                // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
                var maxHeight = $(window).height() - 68 + "px";
                $("img.photo", this).css("max-height", maxHeight);
            });
            // Remove the popup after it has been closed to manage DOM size
            $(document).on("popupafterclose", ".ui-popup", function () {
                $(this).remove();

            });
        }
    });

}

function saveItem(itemname) {
    if (typeof (Storage) !== "undefined")
        sessionStorage['item'] = itemname;
}
