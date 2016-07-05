(function($){
    $(document).ready(initFind);
    function initFind(){
        $("#btnFindTrip").click(function(){
            $(".findDetailDiv").hide();
            $(".googleMapDiv").hide();
            var strFilterText = $("#autocomplete").val();
            var strFilterQueryUrl = "/trip/filter";
            if (strFilterText != ""){
                strFilterQueryUrl = strFilterQueryUrl + "?keyword=" + strFilterText;
            };
            $.getJSON(strFilterQueryUrl, function(jsonResp){
                console.log(jsonResp);
                $("div.findResultDiv ul.lstTripData").html("")
                for (i = 0; i < jsonResp.length; i++) {
                    var dicTripData = jsonResp[i];
                    var strTripDataHtml = getTripDataHtml(dicTripData["strTitle"], dicTripData["intUsdCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"]);
                    $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
                };
                $("div.findResultDiv").fadeIn();
                $("#btnHideTrip").show();
            });
        });
        $("#hideButton").click(function(){
            swithDetail();
        });
    }

    function search(){
        var strFilterText = $('#placeID').val();
        var strFilterQueryUrl = "/trip/filter";
        if (strFilterText != ""){
            strFilterQueryUrl = strFilterQueryUrl + "?keyword=" + strFilterText;
        };
        $.getJSON(strFilterQueryUrl, function(jsonResp){
            console.log(jsonResp);
            $("div.findResultDiv ul.lstTripData").html("")
            for (i = 0; i < jsonResp.length; i++){
                var dicTripData = jsonResp[i];
                var strTripDataHtml =getTripDataHtml(dicTripData["strTitle"],dicTripData["intUsdCost"], dicTripData["strIntroduction"],dicTripData["strLocation"],dicTripData["intDurationHour"],dicTripData["strOriginUrl"]);
                $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
            };
            $("div.findResultDiv").fadeIn();
            $("#btnHideTrip").show();
        });
    }

    function getTripDataHtml(strTitle, intUsdCost, strIntroduction,strLocation,intDurationHour,strOriginUrl){
        var strTripDataHtml = [
        "<li>",
            "<div class=\"tripData\">",
                "<div class=\"tripImgDiv\">",
                    "<img src=\"/static/img/TripCard.png\"/>",
                "</div>",
                "<div class=\"tripContentDiv\"></br>",
                    "<span>Title:"+strTitle+"</span></br>",
                    "<span>Duration:"+intDurationHour+"</span></br>",
                    "<span><a href="+strOriginUrl+" target=\"_blank\">read more</a></span></br>",
                "</div>",
                "<div class=\"tripPriceAndWishDiv\">",
                    "<span>Price:"+intUsdCost+"</span></br>",
                "</div>",
            "</div>",
        "</li>"
        ].join("");
        return strTripDataHtml;
    };

    $(function() {
        var place = getUrlParam('place');
        $('#placeID').val(strKeywordFromHome);
        $('#pac-input').val(strKeywordFromHome);
        search();
        $('#autocomplete').change(function() {
            $('#placeID').val($('#autocomplete').val());
            $('#pac-input').val($('#autocomplete').val());
        });
        var place = getUrlParam('place');
        $('#placeID').val(strKeywordFromHome);
        $('#pac-input').val(strKeywordFromHome);
        search();
        $('#autocomplete').change(function() {
            $('#placeID').val($('#autocomplete').val());
            $('#pac-input').val($('#autocomplete').val());
        });
    });



function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function swithDetail() {
    var status = ($(".hideButtonDiv").text()).toString().trim();
    if(status=='Expand'){
        $(".findDetailDiv").show();
        $(".googleMapDiv").show();
        $("#hideButton").text("Hide");
    }
    if(status=='Hide'){
        $(".findDetailDiv").hide();
        $(".googleMapDiv").hide();
        $("#hideButton").text("Expand");
    }
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
    });
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
    map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location
    });
    marker.setVisible(true);

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address);
    infowindow.open(map, marker);
    });
}


})(jQuery);


