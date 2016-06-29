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