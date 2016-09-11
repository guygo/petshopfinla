
$(document).on("pageshow", "#MapPage", function () {


    geocoder = new google.maps.Geocoder();

    var myTrip = new Array();
    var defaultLatLng = new google.maps.LatLng(32.0983425, 34.87);
    if (navigator.geolocation) {
        function success(pos) {
            // Location found, show map with these coordinates

            var myloc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            drawMap(myloc);
            getshops(function (data) {
                if (data["d"] != undefined) {
                    var shops = [];
                    for (var i = 0; i < data["d"].length; i++)
                        shops.push(data["d"][i])
                }



                drawmarkers(myloc, shops, true);
            });

        }
        function fail(error) {

            drawMap(defaultLatLng);  // Failed to find location, show default map

            getshops(function (data) {
                if (data["d"] != undefined) {
                    var shops = [];
                    for (var i = 0; i < data["d"].length; i++)
                        shops.push(data["d"][i])
                }


                drawmarkers(defaultLatLng, shops, false);
            });

            $('#message').text("Couldn't get location");
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 6000 });
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
        getshops(function (data) {
            if (data["d"] != undefined) {
                var shops = [];
                for (var i = 0; i < data["d"].length; i++)
                    shops.push(data["d"][i])
            }


            drawmarkers(defaultLatLng, shops, false);
        });
    }
    function drawMap(latlng) {


        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("gmap_canvas"), myOptions);
        // Add an overlay to the map of current lat/lng

    }
    var arr = [];
    function codeAddress(shops, callback) {

        for (var i = 0; i < shops.length; i++)
            codeAdressofshop(shops[i], callback, shops.length);


    }
    function codeAdressofshop(shop, callback, shoplength) {
       
        geocoder.geocode({ 'address': shop.Adress }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

               
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                arr.push({ lat: lat, lng: lng, shop: shop });
                if (arr.length == shoplength) {

                    callback(arr);

                }
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });

    }


    function drawmarkers(loc, shops, locationenable) {

        codeAddress(shops, function (arr) {

            var map = new google.maps.Map(document.getElementById("gmap_canvas"), {
                zoom: 10,
                center: loc,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });



            if (locationenable) {
                var distances = [];
                for (var i = 0; i < arr.length; i++) {
                    distances.push(google.maps.geometry.spherical.computeDistanceBetween(loc, new google.maps.LatLng(arr[i].lat, arr[i].lng)));
                }
                var x = getmin(distances);
                minimumindex = distances.indexOf(x);
                $('#message').text(arr[minimumindex].shop.Name);
                $('#address').text(arr[minimumindex].shop.Adress);
            }
            var title = '</br><strong>location</strong></br>';
            var add;
            var i = 0;
            for (i = 0; i < arr.length; i++) {

                add = title + arr[i].shop.Name + '</br>' + arr[i].shop.Adress + '</br>';

                createMarker(add, arr[i].lat, arr[i].lng, map, i, arr[i].shop);
            }



            var myloc = new google.maps.Marker({
                clickable: false,
                icon: new google.maps.MarkerImage('./pics/mobileimgs2.png',
                                                                new google.maps.Size(22, 22),
                                                                new google.maps.Point(0, 18),
                                                                new google.maps.Point(11, 11)),
                shadow: null,
                zIndex: 999,
                map: map
            });
            myloc.setPosition(loc);

        });


    }


    function createMarker(add, lat, lng, map, i, shop) {


        var factory = new google.maps.LatLng(lat, lng);

        var content = '<div id="iw-container">' +
                    '<div class="iw-title">' + shop.Name + '</div>' +
                    '<div class="iw-content">' +
                      '<div class="iw-subTitle">Welcome!!!!</div>' +
                      '<img src=' + shop.imgurl + ' height="70" width="60">' +

                      '<div><p>' + shop.Adress + '</p></div>' +
                      '<div class="iw-subTitle">Contacts</div>' +
                      '<br>' + shop.Phone +
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                  '</div>';

        // A new Info Window is created and set content
        var infowindow = new google.maps.InfoWindow({
            content: content,

            // Assign a maximum value for the width of the infowindow allows
            // greater control over the various content elements
            maxWidth: 350
        });

        // marker options
        var marker = new google.maps.Marker({
            position: factory,
            map: map,
            title: "Fábrica de Porcelana da Vista Alegre"
        });

        // This event expects a click on a marker
        // When this event is fired the Info Window is opened.
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        // Event that closes the Info Window with a click on the map
        google.maps.event.addListener(map, 'click', function () {
            infowindow.close();
        });

        // *
        // START INFOWINDOW CUSTOMIZE.
        // The google.maps.event.addListener() event expects
        // the creation of the infowindow HTML structure 'domready'
        // and before the opening of the infowindow, defined styles are applied.
        // *
        google.maps.event.addListener(infowindow, 'domready', function () {

            // Reference to the DIV that wraps the bottom of infowindow
            var iwOuter = $('.gm-style-iw');

            /* Since this div is in a position prior to .gm-div style-iw.
             * We use jQuery and create a iwBackground variable,
             * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
            */
            var iwBackground = iwOuter.prev();

            // Removes background shadow DIV
            iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

            // Removes white background DIV
            iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

            // Moves the infowindow 115px to the right.
            iwOuter.parent().parent().css({ left: '68px' });

            // Moves the shadow of the arrow 76px to the left margin.
            iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 17px !important;' });

            // Moves the arrow 76px to the left margin.
            iwBackground.children(':nth-child(3)').attr('style', function (i, s) { return s + 'left: 17px !important;' });

            // Changes the desired tail shadow color.
            iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1' });

            // Reference to the div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();

            // Apply the desired effect to the close button
            iwCloseBtn.css({ opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9' });

            // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
            if ($('.iw-content').height() < 140) {
                $('.iw-bottom-gradient').css({ display: 'none' });
            }

            // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
            iwCloseBtn.mouseout(function () {
                $(this).css({ opacity: '1' });
            });
        });

    }
    var getmin = function (values) {
        if (values.length == 0)
            return -1;
        var min = values[0];
        for (var i = 1; i < values.length; i++)
            if (min > values[i])
                min = values[i];
        return min;
    }
});