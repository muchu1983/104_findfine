//本網頁讀取完成後 執行
$(function(){
    var keyword = tour.QueryString().keyword;
    //js取值
    alert("keyword:"+keyword);
    //server取值
    alert("strKeywordFromHome:"+strKeywordFromHome);

    //將值填入googlemap
    $('#pac-input').val(keyword);
    //將值填入place欄位
    $('#placeID').val(keyword);
    //不傳入sort條件
    search('');
});

//hmoe頁面傳值至find頁面 googleMap呈現
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        
        center: {
            lat: Number(tour.QueryString().lat),
            lng: Number(tour.QueryString().lng)
        },
        zoom: 13
    });
    var input = /** @type {!HTMLInputElement} */ (
        document.getElementById('pac-input'));

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        // anchorPoint: new google.maps.Point(0, -29)
        position:map.center
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });
}

//home頁面到find頁面 or 按下search鍵 會執行的動作 可傳入排序條件
function search( condition){

    var place         = $("#placeID").val();
    //預算下限
    var budgetDown    = $("#budgetDownID").val();
    //預算上限
    var budgetUp      = $("#budgetUpID").val();
    
    
    var strFilterQueryUrl = "/trip/filter?1=1";
    //place
    if (place != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + place;
    };
    //budgetDown
    if (budgetDown != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&min_budget=" + budgetDown;
    };
    //budgetUp
    if (budgetUp != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&max_budget=" + budgetUp;
    };
    //排序條件
    if(condition !=""){
        if(condition=='intUsdCost'){
            //預算
            if($("#sortByBudgetID").val() =="Budget ASC"){
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=" +condition;
                $("#sortByBudgetID").val("Budget DESC");
            }else{
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=-" +condition;
                $("#sortByBudgetID").val("Budget ASC");
            }
        }
        if(condition=='intDurationHour'){
            //tour長短
            if($("#sortByDurationHourID").val() =="Duration ASC"){
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=" +condition;
                $("#sortByDurationHourID").val("Duration DESC");
            }else{
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=-" +condition;
                $("#sortByDurationHourID").val("Duration ASC");
            }
        }
        if(condition=='intReviewStar'){
            //評分高低
            if($("#sortByReviewStarID").val() =="ReviewStar ASC"){
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=" +condition;
                $("#sortByReviewStarID").val("ReviewStar DESC");
            }else{
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=-" +condition;
                $("#sortByReviewStarID").val("ReviewStar ASC");
            }
        }
    }

    $.getJSON(strFilterQueryUrl, function(jsonResp){
        //console.log(jsonResp);
        $("div.findResultDiv ul.lstTripData").html("");
        if(jsonResp.length>0){
            
            if($("body").find(".sortedBy").length!=1){
                var sortedByHtml=[
                 "<div class=\"sortedBy\">",
                    "<span>sorted by</span>",
                    "<span><input id=\"sortByBudgetID\"       type=\"button\" onclick='search(\"intUsdCost\")'      value=\"Budget ASC\">    </span>",
                    "<span><input id=\"sortByDurationHourID\" type=\"button\" onclick='search(\"intDurationHour\")' value=\"Duration ASC\">  </span>",
                    "<span><input id=\"sortByReviewStarID\"   type=\"button\" onclick='search(\"intReviewStar\")'   value=\"ReviewStar ASC\"></span>",
                 "</div>",
                ]
                $(".find").append(sortedByHtml);
            }
        }
        for (i = 0; i < jsonResp.length; i++) {
            var dicTripData = jsonResp[i];
            var strTripDataHtml = getTripDataHtml(dicTripData["strTitle"], dicTripData["intUsdCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"]);
            $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
        };
    });
};

//組出單組查詢結果出來的html字串
function getTripDataHtml(strTitle, intUsdCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl){
    var strTripDataHtml = [
    "<li>",
        "<div class=\"tripData\">",
            "<div class=\"tripImgDiv\">",
                "<img src=\""+strImageUrl+"\"/>",
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

