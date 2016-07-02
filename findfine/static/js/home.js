/*
Copyright (C) 2015, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
*/
(function($){
    
    $(document).ready(initHome);
    
    function initHome(){
        $("#btnFindTrip").click(function(){
            var strFilterText = $("#strFilterText").val();
            var strFilterQueryUrl = "/trip/filter";
            if (strFilterText != ""){
                strFilterQueryUrl = strFilterQueryUrl + "?keyword=" + strFilterText;
            };
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
        });
        
        $("#btnHideTrip").click(function(){
            $("div.findResultDiv").fadeOut();
            $("#btnHideTrip").hide();
        });
    };
    
    function getTripDataHtml(strTitle, intUsdCost, strIntroduction){
        var strTripDataHtml = [
            "<li>",
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




var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

// [START region_fillform]
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]
