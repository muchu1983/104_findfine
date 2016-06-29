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
            var strFilterText = $("#strFilterText").val()
            $.getJSON("/trip/filter", function(jsonResp){
                console.log(jsonResp);
                for (i = 0; i < jsonResp.length; i++) {
                    var dicTripData = jsonResp[i];
                    var strTripDataHtml = [
                        "<li>",
                            "<div class=\"tripData\">",
                                "<span>" + dicTripData["strTitle"] + "</span>",
                            "</div>",
                        "</li>"
                    ].join("");
                    $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
                };
                $("div.findResultDiv").fadeIn();
            });
        });
    }
    
})(jQuery);