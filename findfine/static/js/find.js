//本網頁讀取完成後 執行
$(document).ready(initFind);



function initFind(){
    initCurrencySelect();
    var keyword = tour.QueryString().keyword;
    //js取值
    // alert("keyword:"+keyword);
    //server取值
    // alert("strKeywordFromHome:"+strKeywordFromHome);

    //將值填入googlemap
    $('#pac-input').val(keyword);
    //將值填入place欄位
    $('#placeID').val(keyword);
    var $toggleCollapse = $('.toggleCollapse');
    $('#moreInfo').on('show.bs.collapse',function(){
       $toggleCollapse.html(' less');
    }).on('hide.bs.collapse',function(){
       $toggleCollapse.html(' more');
    });
    
    //登入按鈕
    $("#loginBtn").click(function(){
        if($("#loginBtn").html()=="Log In"){
            window.location = "/account/login";
        }
    });
    
    //搜尋按鈕
    $("#btnSearch").click(function(){
        $("#current_page").html("1");
        search("");
        
    });
    
    $('#wishList').hide();
    $('#myFriends').hide();
    $('#myPlans').hide();
    $('#myMessages').hide();
    $('#logOut').hide();
    
    //strEmail 如已登入 不顯示login button 並顯示會員帳號
    if(strEmail=="None"){
    }else{
        $('#loginBtn').html(strEmail);
        $('#wishList').show();
        $('#myFriends').show();
        $('#myPlans').show();
        $('#myMessages').show();
        $('#logOut').show();
    }
    
    $("#wishList").click(function(){
            window.location = "/page/wishList";
    });
    
    $("#myPlans").click(function(){
            window.location = "/page/myTrip";
    });
    
    //page
    $("#prev_page_link").click(function(){
        $("#current_page").html(parseInt($("#current_page").html())-1);
        search('');
    });
    $("#next_page_link").click(function(){
        $("#current_page").html(parseInt($("#current_page").html())+1);
        search('');
    });
    
    
    //不傳入sort條件
    search('');
    
};

//hmoe頁面傳值至find頁面 googleMap呈現
function initMap(sendLat,sendLng) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: Number(tour.QueryString().lat),
            lng: Number(tour.QueryString().lng)
        },
        zoom: 13
    });
    var input = /** @type {!HTMLInputElement} */ (
        document.getElementById('placeID'));

    var types = document.getElementById('type-selector');
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

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
        //infowindow.open(map, marker);
    });
}

//home頁面到find頁面 or 按下search鍵 會執行的動作 可傳入排序條件
function search(condition){
    
//主搜尋
    //地點
    var place         = $("#placeID").val();
    //預算下限
    var budgetDown    = $("#budgetDownID").val();
    //預算上限
    var budgetUp      = $("#budgetUpID").val();
    //時間起迄
    var startFrom     =$("#startFrom").val();
    var to            =$("#to").val();
//摺疊搜尋
    //旅遊時間長短
    var duration      =$('input:checkbox:checked[name="duration"]').map(function() { return $(this).val(); }).get();
    //人數
    var passenger =$("#passenger").val();
    //類型
    var style         =$('input:checkbox:checked[name="style"]').map(function() { return $(this).val(); }).get();
    //旅遊時間點開始
    var tourStarts    =$('#tourStarts :selected').text();
    //旅遊時間點結束
    var tourEnds      =$('#tourEnds :selected').text();
    //導覽語言
    var guideLanguage =$('input:checkbox:checked[name="guideLanguage"]').map(function() { return $(this).val(); }).get();
    //可立即參與
    var availability  =$('input:checkbox:checked[name="availability"]').map(function() { return $(this).val(); }).get();
    //萬用搜尋
    var attrations    =$("#attrations").val();  
    
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
    //startFrom db無資料
    if (startFrom != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&date_from=" + startFrom;
    };
    //to db無資料
    if (to != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&date_to=" + to;
    };
    
    //duration
    if (duration != ""){
        for(var i=0;duration.length>i;i++){
            if(duration[i]=="1"){
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=0&max_duration=1";
            }
            if(duration[i]=="2"){
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=1&max_duration=2";
            }
            if(duration[i]=="3"){
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=2&max_duration=3";
            }
            if(duration[i]=="4"){
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=3&max_duration=6";
            }
            if(duration[i]=="5"){
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=12&max_duration=24";
            }
            if(duration[i]=="5"){
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=24&max_duration=1000";
            }
        }
    };
    //passenger 目前沒有
    if (passenger != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + passengerDown;
    };
    //style 目前db無資料 js需修改
    if (style != ""){
        for(var i=0;duration.length>i;i++){
            if(style[i]=="Cultural"){
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if(style[i]=="Food"){
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if(style[i]=="Fashion"){
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if(style[i]=="Wild"){
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if(style[i]=="Sports"){
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if(style[i]=="Eco"){
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
        }
    };
    //tourStarts 程式尚未實作
    if (tourStarts != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&date_from=" + tourStarts;
    };
    //tourEnds  程式尚未實作
    if (tourEnds != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&date_to=" + tourEnds;
    };
    //guideLanguage 
    if (guideLanguage != ""){
        for(var i=0;guideLanguage.length>i;i++){
            if(guideLanguage[i]=="English"){
                strFilterQueryUrl = strFilterQueryUrl + "&guide_language=English";
            }
            if(guideLanguage[i]=="Chinese"){
                strFilterQueryUrl = strFilterQueryUrl + "&guide_language=中文";
            }
        }
    };
    //availability db 無資料
    if (availability != ""){
        for(var i=0;availability.length>i;i++){
            if(availability[i]=="instantConfirmation"){
                strFilterQueryUrl = strFilterQueryUrl + "&option=" + option[i];
            }
            if(availability[i]=="onRequest"){
                strFilterQueryUrl = strFilterQueryUrl + "&option=" + option[i];
            }
        }
    };
    //attrations
    if (attrations != ""){
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + attrations;
    };

    //排序條件
    if(condition !=""){
        if(condition=='intUsdCost'){
            //預算
            if($("#sortByBudgetID").val() =="Budget ↓"){
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=" +condition;
                $("#sortByBudgetID").val("Budget ↑");
                $("#hiddenID").val("Budget ↓");
                
            }else{
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=-" +condition;
                $("#sortByBudgetID").val("Budget ↓");
                $("#hiddenID").val("Budget ↑");
            }
        }
        if(condition=='intDurationHour'){
            //tour長短
            if($("#sortByDurationHourID").val() =="Duration ↓"){
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=" +condition;
                $("#sortByDurationHourID").val("Duration ↑");
                $("#hiddenID").val("Duration ↓");
            }else{
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=-" +condition;
                $("#sortByDurationHourID").val("Duration ↓");
                $("#hiddenID").val("Duration ↑");
            }
        }
        if(condition=='intReviewStar'){
            //評分高低
            if($("#sortByReviewStarID").val() =="ReviewStar ↓"){
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=" +condition;
                $("#sortByReviewStarID").val("ReviewStar ↑");
                $("#hiddenID").val("ReviewStar ↓");
            }else{
                strFilterQueryUrl = strFilterQueryUrl + "&order_by=-" +condition;
                $("#sortByReviewStarID").val("Star ↓");
                $("#hiddenID").val("ReviewStar ↑");
            }
        }
    }
    
    //page
    console.log("page index: "+$("#current_page").html());
    strFilterQueryUrl = strFilterQueryUrl + "&page=" + $("#current_page").html();
    
    //alert(" 254:strFilterQueryUrl:"+strFilterQueryUrl);
    $.getJSON(strFilterQueryUrl, function(jsonResp){
        //console.log(jsonResp);
        $("div.findResultDiv ul.lstTripData").html("");
        
        var strUserCurrency = $("#moneySelect").val();
        $("div.userCurrencySpan").html(strUserCurrency);
        //trip data
        var lstDicTripData = jsonResp["trip"];
        for (i = 0; i < lstDicTripData.length; i++) {
            var dicTripData = lstDicTripData[i];
            var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"] ,dicTripData["intId"] ,dicTripData["isFavoriteTrip"]);
            $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
        };
        
        //page data
        var dicPageData = jsonResp["page"];
        console.log(dicPageData);
        $("#current_page").html(dicPageData["current_page"]);
        if (dicPageData["current_page"]-1 < 1){
            $("#prev_page_link").hide();
        }else{
            $("#prev_page_link").show();
            $("#prev_page_link").attr("page_value", dicPageData["current_page"]-1);
        }
        if (dicPageData["current_page"]+1 > dicPageData["total_page"]){
            $("#next_page_link").hide();
        }else{
            $("#next_page_link").show();
            $("#next_page_link").attr("page_value", dicPageData["current_page"]+1);
        }
    });
    
    

};

//組出單組查詢結果出來的html字串
function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, isFavoriteTrip ){
    var reviewStar;
    if(intReviewStar==0){
        reviewStar='☆☆☆☆☆';
    }
    if(intReviewStar==1){
        reviewStar='★☆☆☆☆';
    }
    if(intReviewStar==2){
        reviewStar='★★☆☆☆';
    }
    if(intReviewStar==3){
        reviewStar='★★★☆☆';
    }
    if(intReviewStar==4){
        reviewStar='★★★★☆';
    }
    if(intReviewStar==5){
        reviewStar='★★★★★';
    }
    
    var strIntroduction=strIntroduction.substr( 0 , 135 );
    
    var favoriteTrip ;
    
    //alert("isFavoriteTrip : "+isFavoriteTrip +"  length : "+isFavoriteTrip.toString());
    
    if(isFavoriteTrip.toString()=="true"){
        favoriteTrip="<div class=\"favorite\">♥</div>";
    }
    if(isFavoriteTrip.toString()=="false"){
        favoriteTrip="<div class=\"favorite\" id="+intId+" onclick=\"addFavoriteTrip("+intId+")\">♡</div>";
    }
    
    var strTripDataHtml = [
    "<li class=\"col-xs-12 col-md-6\">",
        "<div class=\"tripData\">",
            "<div class=\"tripImgDiv col-xs-4\">",
                "<img src=\""+strImageUrl+"\"/>",
            "</div>",
            "<div class=\"col-xs-8\">",
            "<div class=\"tripContentDiv\">",
                "<p><span style=\"color:orange\">"+strTitle+"</span></p>",
                "<span class=\"trimText\">"+strIntroduction+"...<a href="+strOriginUrl+" target=\"_blank\"> read more</a></span><br>",
                "<span><i class=\"fa fa-clock-o\"></i> Duration:"+intDurationHour+"</span><br>",
                "<span style=\"color:red\">Stars:"+reviewStar+"</span><br>",
                "<span><i class=\"fa fa-user\"></i> review:"+intReviewVisitor+"</span><br>",
            "</div>",
            "</div>",
            "<div class=\"tripPriceAndWishDiv\">",
                "<span class=\"pull-right\">",
                "<i class=\"fa fa-usd\"></i>",
                "<span style=\"color:red\">"+intUserCurrencyCost+" "+strUserCurrency+"</span></br>",
            "</div>",
            //TODO 要加TOUR KEY 觸發事件後加入 wish list  intId
            //"<div class=\"favorite\"><a href=\"/trip/addFavoriteTrip?intTripId=3\" return false;> ♥</a></div>",
            //"<div class=\"favorite\" onclick=\"addFavoriteTrip("+intId+")\">♥</div>",
            favoriteTrip,
            //isFavoriteTrip
        "</div>",
    "</li>"
    ].join("");
    
    return strTripDataHtml;
};

//幣別功能
function initCurrencySelect(){
    //設定目前幣別
    var strUserCurrencyUrl = "/trip/userCurrency";
    $.getJSON(strUserCurrencyUrl, function(jsonResp){
        strUserCurrency = jsonResp["strUserCurrency"];
        $("#moneySelect").val(strUserCurrency);
        $("#moneySelect").selectpicker("refresh");
        console.log("init user currency selection: " + strUserCurrency);
    });
    //切換目前幣別
    $("#moneySelect").change(function(){
        var strSelectedCurrencyVal = $("#moneySelect").find(":selected").val();
        var strChangeUserCurrencyUrl = strUserCurrencyUrl + "?user_currency=" + strSelectedCurrencyVal;
        $.getJSON(strChangeUserCurrencyUrl, function(jsonResp){
            strUserCurrency = jsonResp["strUserCurrency"];
            console.log("switch user currency to: " + strUserCurrency);
            //重新搜尋
            console.log("research");
            //這裡要帶排序條件

            if($("#hiddenID").val()=="Budget ↓"){
                search("intUsdCost");
            }
            if($("#hiddenID").val()=="Budget ↑"){
                search("intUsdCost");
            }
            if($("#hiddenID").val()=="Duration ↓"){
                search("intDurationHour");
            }
            if($("#hiddenID").val()=="Duration ↑"){
                search("intDurationHour");
            }
            if($("#hiddenID").val()=="ReviewStar ↓"){
                search("intReviewStar");
            }
            if($("#hiddenID").val()=="ReviewStar ↑"){
                search("intReviewStar");
            }
            if($("#hiddenID").val()==""){
                search("");
            }
        });
    });
};

function addFavoriteTrip( intId ){
        var strAddFavoriteTripUrl = "/trip/addFavoriteTrip?intTripId="+intId ;
        $.getJSON(strAddFavoriteTripUrl, function(jsonResp){
            var status = jsonResp["add_favorite_trip_status"];
        });
        //$('.favorite').html('♥');
        //this.html('♥');  no
        //this.$('.favorite').html('♥'); no
        //$(this).$('.favorite').html('♥'); no
        //$('this .favorite').html('♥'); 

        $('#'+intId+'').html('♥');
        
        //alert(" initFind() 前");
        //initFind();
        //alert(" initFind() 後");
}
