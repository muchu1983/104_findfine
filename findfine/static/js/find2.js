/*
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
*/
(function($){
    
    $(document).ready(initFind);
    
    function initFind(){
        console.log(strKeywordFromHome)
        var strFilterQueryUrl = "/trip/filter";
        if (strKeywordFromHome != ""){
            strFilterQueryUrl = strFilterQueryUrl + "?keyword=" + strKeywordFromHome;
        };
        console.log(strFilterQueryUrl)
        $.getJSON(strFilterQueryUrl, function(jsonResp){
            console.log(jsonResp);
            $("div.findResultDiv ul.lstTripData").html("")
            for (i = 0; i < jsonResp.length; i++) {
                var dicTripData = jsonResp[i];
                var strTripDataHtml = getTripDataHtml(dicTripData["strTitle"], dicTripData["intUsdCost"], dicTripData["strIntroduction"]);
                $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
            };
            $("div.findResultDiv").fadeIn();
            $("#btnHideTrip").show();
        });
        
    };
    
    function getTripDataHtml(strTitle, intUsdCost, strIntroduction){
        var strTripDataHtml = [
            "<li class=\"tripCard\">",
            "<div class=\"tripData\">",
                "<div class=\"tripImgDiv\"><img src=\"/static/img/TripCard.png\"/></div>",
                "<div class=\"tripTitleDiv\">",
                    "<span class=\"tripTitleSpan\">" + strTitle + "</span>",
                    "<span class=\"tripUsdCostSpan\">" + intUsdCost + " USD</span>",
                "</div>",
                "<div class=\"tripIntroDiv\">",
                    "<span>" + strIntroduction + "</span>",
                "</div>",
            "</div>",
            "</li>"
        ].join("");
        return strTripDataHtml;
    };
    
})(jQuery);


function swithDetail() {
    
    var status = ($(".hideButtonDiv").text()).toString().trim();
    
    if(status=='Expand'){
         $(".findDetailDiv").show();
         $("#hideButton").text("Hide");
    }
    if(status=='Hide'){
         $(".findDetailDiv").hide();
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
