//本網頁讀取完成後 執行
$(document).ready(initFind);



function initFind() {
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
    $('#moreInfo').on('show.bs.collapse', function() {
        $toggleCollapse.html(' less');
    }).on('hide.bs.collapse', function() {
        $toggleCollapse.html(' more');
    });

    //登入按鈕
    $("#loginBtn").click(function() {
        if ($("#loginBtn").html() == "Log In") {
            window.location = "/account/login";
        }
    });

    //搜尋按鈕
    $("#btnSearch").click(function() {
        $("#current_page").html("1");
        var sortCondition = [];
            sortCondition[0] = $("#sortValBtn .sort_val").html();
            sortCondition[1] = $("#sortWayBtn .sort_val").html();
        search(sortCondition);

    });

    // $('#wishList').hide();
    $('#myFriends').hide();
    // $('#myPlans').hide();
    $('#myMessages').hide();
    $('#logOut').hide();

    //strEmail 如已登入 不顯示login button 並顯示會員帳號
    if (strEmail == "None") {} else {
        $('#loginBtn').html(strEmail);
        $('#wishList').show();
        $('#myFriends').show();
        $('#myPlans').show();
        $('#myMessages').show();
        $('#logOut').show();
        $('#loginBtn').hide();
    }

    $("#wishList").click(function() {
        window.location = "/page/wishList";
    });

    $("#logOut").click(function() {
        if ($("#logOut").html() == "Log Out") {
            window.location = "/account/logout";
        }
    });

    $("#myPlans").click(function() {
        window.location = "/page/myTrip";
    });


    // 初始設定以星星排序 RE@Q@ davidturtle
    var initSortCondition = [];
    initSortCondition[0] = "Star";
    initSortCondition[1] = "Decending";
    search(initSortCondition);


    // 搜尋區顯示更多/更少選項 @Q@davidturtle
    moreFilterClick();

    // 飛機飛呀飛 @Q@davidturtle
    planeFly(5000);
    $(".plane_print").addClass('active');

    // 頁面下滑選單效果 @Q@davidturtle
    topNavDown(800);

    // 排序區域點擊效果 @Q@ davidturtle
    sortBlkClick();

    //頁面按鈕點擊效果 RE@Q@ davidturtle
    $("#prev_page_link").click(function() {
        $("#current_page").html(parseInt($("#current_page").html()) - 1);
        search('');
    });
    $("#next_page_link").click(function() {
        $("#current_page").html(parseInt($("#current_page").html()) + 1);
        search('');
    });
    $("#first_page_link").click(function() {
        $("#current_page").html("1");
        search('');
    });
    $("#final_page_link").click(function() {
        $("#current_page").html($("#final_page_link").html());
        search('');
    });

};

//hmoe頁面傳值至find頁面 googleMap呈現
function initMap(sendLat, sendLng) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: Number(tour.QueryString().lat),
            lng: Number(tour.QueryString().lng)
        },
        zoom: 13,
        // 滑鼠滾輪滾動不影響地圖縮放
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
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
        position: map.center
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
function search(condition) {

    //主搜尋
    //地點
    var place = $("#placeID").val();
    //預算下限
    var budgetDown = $("#budgetDownID").val();
    //預算上限
    var budgetUp = $("#budgetUpID").val();
    //時間起迄
    var startFrom = $("#startFrom").val();
    var to = $("#to").val();
    //摺疊搜尋
    //旅遊時間長短
    var duration = $('input:checkbox:checked[name="duration"]').map(function() {
        return $(this).val();
    }).get();
    //人數
    var passenger = $("#passenger").val();
    //類型
    var style = $('input:checkbox:checked[name="style"]').map(function() {
        return $(this).val();
    }).get();
    //旅遊時間點開始
    var tourStarts = $('#tourStarts :selected').text();
    //旅遊時間點結束
    var tourEnds = $('#tourEnds :selected').text();
    //導覽語言
    var guideLanguage = $('input:checkbox:checked[name="guideLanguage"]').map(function() {
        return $(this).val();
    }).get();
    //可立即參與
    var availability = $('input:checkbox:checked[name="availability"]').map(function() {
        return $(this).val();
    }).get();
    //萬用搜尋
    var attrations = $("#attrations").val();

    var strFilterQueryUrl = "/trip/filter?1=1";
    //place
    if (place != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + place;
    };
    //budgetDown
    if (budgetDown != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&min_budget=" + budgetDown;
    };
    //budgetUp
    if (budgetUp != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&max_budget=" + budgetUp;
    };
    //startFrom db無資料
    if (startFrom != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&date_from=" + startFrom;
    };
    //to db無資料
    if (to != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&date_to=" + to;
    };

    //duration
    if (duration != "") {
        for (var i = 0; duration.length > i; i++) {
            if (duration[i] == "1") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=0&max_duration=1";
            }
            if (duration[i] == "2") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=1&max_duration=2";
            }
            if (duration[i] == "3") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=2&max_duration=3";
            }
            if (duration[i] == "4") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=3&max_duration=6";
            }
            if (duration[i] == "5") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=12&max_duration=24";
            }
            if (duration[i] == "5") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=24&max_duration=1000";
            }
        }
    };
    //passenger 目前沒有
    if (passenger != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + passengerDown;
    };
    //style 目前db無資料 js需修改
    if (style != "") {
        for (var i = 0; duration.length > i; i++) {
            if (style[i] == "Cultural") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Food") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Fashion") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Wild") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Sports") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Eco") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
        }
    };
    //tourStarts 程式尚未實作
    if (tourStarts != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&date_from=" + tourStarts;
    };
    //tourEnds  程式尚未實作
    if (tourEnds != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&date_to=" + tourEnds;
    };
    //guideLanguage 
    if (guideLanguage != "") {
        for (var i = 0; guideLanguage.length > i; i++) {
            if (guideLanguage[i] == "English") {
                strFilterQueryUrl = strFilterQueryUrl + "&guide_language=English";
            }
            if (guideLanguage[i] == "Chinese") {
                strFilterQueryUrl = strFilterQueryUrl + "&guide_language=中文";
            }
        }
    };
    //availability db 無資料
    if (availability != "") {
        for (var i = 0; availability.length > i; i++) {
            if (availability[i] == "instantConfirmation") {
                strFilterQueryUrl = strFilterQueryUrl + "&option=" + option[i];
            }
            if (availability[i] == "onRequest") {
                strFilterQueryUrl = strFilterQueryUrl + "&option=" + option[i];
            }
        }
    };
    //attrations
    if (attrations != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + attrations;
    };

    //排序條件 RE@Q@ davidturtle
    if (condition != "" && condition[0] != "" && condition[1] != "" && condition[0] != "undefined" && condition[1] != "undefined") {

        var order_text = "";
        if (condition[1] == "Ascending") {
            order_text = "&order_by=-";
        } else if (condition[1] == "Decending") {
            order_text = "&order_by=-";
        } else {
            console.log("get sortWay error");
        }

        if (condition[0] == "Duration") {
            strFilterQueryUrl = strFilterQueryUrl + order_text + "intDurationHour";
        } else if (condition[0] == "Budget") {
            strFilterQueryUrl = strFilterQueryUrl + order_text + "intUsdCost";
        } else if (condition[0] == "Star") {
            strFilterQueryUrl = strFilterQueryUrl + order_text + "intReviewStar";
        } else {
            console.log("get sortVal error");
        }
    }

    //page
    console.log("page index: " + $("#current_page").html());
    strFilterQueryUrl = strFilterQueryUrl + "&page=" + $("#current_page").html();

    //alert(" 254:strFilterQueryUrl:"+strFilterQueryUrl);
    console.log(strFilterQueryUrl);
    $.getJSON(strFilterQueryUrl, function(jsonResp) {
        //console.log(jsonResp);
        $("div.findResultDiv ul.lstTripData").html("");
        var strUserCurrency = $("#moneySelect").val();
        $("div.userCurrencySpan").html("(" + strUserCurrency + ")");
        //trip data
        var lstDicTripData = jsonResp["trip"];

        for (i = 0; i < lstDicTripData.length; i++) {
            var dicTripData = lstDicTripData[i];
            var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"], dicTripData["isFavoriteTrip"]);
            $("div.findResultDiv ul.lstTripData").append(strTripDataHtml);
        };

        //page data
        var dicPageData = jsonResp["page"];
        console.log(dicPageData);

        // 頁碼重整 RE@Q@ davidturtle
        pageReload(dicPageData);

        // add to wishlist 按鈕點擊 @Q@ davidturtle
        addToWishlistBtnClick();

        // ripple按鈕啟動 @Q@ davidturtle
        initRippleBtn();
    });
};

//組出單組查詢結果出來的html字串
function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, isFavoriteTrip) {

    var reviewStar = "";
    fillstarQan = intReviewStar;
    emptystarQan = 5 - intReviewStar;
    for (var fillstarCount = 0; fillstarCount < fillstarQan; fillstarCount++) {
        reviewStar += "<span class='icon-star_fill'></span>";
    }
    for (var emptystarCount = 0; emptystarCount < emptystarQan; emptystarCount++) {
        reviewStar += "<span class='icon-star_empty'></span>";
    }
    // @Q@設定文字擷取字數
    var strIntroduction = strIntroduction.substr(0, 75);
    var strTitle = strTitle.substr(0, 25);

    var favoriteTrip;

    if (isFavoriteTrip.toString() == "true") {
        favoriteTrip = "<div class=\"favorite\">♥</div>";
    }
    if (isFavoriteTrip.toString() == "false") {
        favoriteTrip = "<div class=\"favorite\" id=" + intId + " onclick=\"addFavoriteTrip(" + intId + ")\">♡</div>";
    }
    var strTripDataHtml = [
        "<div class=\"tour\">",
        "<div class=\"card active\" style=\"background-image:url(" + strImageUrl + ");\">",
        "<div class=\"name\">",
        "<p>" + strTitle + "...</p>",
        "</div>",
        "<p class=\"place\">" + strLocation + "</p>",
        "<p class=\"duration\">" + intDurationHour + "<span>HR</span></p>",
        "<div class=\"price\">",
        "<span class=\"country\">" + strUserCurrency + "</span> $",
        "<span class=\"number\">" + intUserCurrencyCost + "</span>",
        "</div>",
        "<div class=\"star\">" + reviewStar + "</div>",
        "<p class=\"trimtext\">" + strIntroduction + "...</p>",
        "<div class=\"readmore_btn\">",
        "<a target=\"_blank\" href=" + strOriginUrl + " data-ripple-color=\"#2bb0b9\">Read More</a>",
        "</div>",
        "<div class=\"footprint_blk\">",
        "<span class=\"icon-tourdash footprint\"></span>",
        "</div>",
        "<div class=\"add_wish_btn\">",
        "<p class=\"oriword\">Add To WishList</p>",
        "<span class=\"icon-wishlist\"></span>",
        "<p class=\"actword\">My Wishlist</p>",
        "<span class=\"icon-quill\"></span>",
        "<span class=\"extend_line\"></span>",
        "</div>",
        "<div class=\"darken_bg\"></div>",
        "</div>",
        "</div>"
    ].join("");

    return strTripDataHtml;
};

//幣別功能
function initCurrencySelect() {
    //設定目前幣別
    var strUserCurrencyUrl = "/trip/userCurrency";
    $.getJSON(strUserCurrencyUrl, function(jsonResp) {
        strUserCurrency = jsonResp["strUserCurrency"];
        $("#moneySelect").val(strUserCurrency);
        $("#moneySelect").selectpicker("refresh");
        console.log("init user currency selection: " + strUserCurrency);
    });
    //切換目前幣別
    $("#moneySelect").change(function() {
        var strSelectedCurrencyVal = $("#moneySelect").find(":selected").val();
        var strChangeUserCurrencyUrl = strUserCurrencyUrl + "?user_currency=" + strSelectedCurrencyVal;
        $.getJSON(strChangeUserCurrencyUrl, function(jsonResp) {
            strUserCurrency = jsonResp["strUserCurrency"];
            console.log("switch user currency to: " + strUserCurrency);
            //重新搜尋
            console.log("research");
            //這裡要帶排序條件


            var sortCondition = [];
            sortCondition[0] = $("#sortValBtn .sort_val").html();
            sortCondition[1] = $("#sortWayBtn .sort_val").html();
            search(sortCondition);
        });
    });
};

function addFavoriteTrip(intId) {
    var strAddFavoriteTripUrl = "/trip/addFavoriteTrip?intTripId=" + intId;
    $.getJSON(strAddFavoriteTripUrl, function(jsonResp) {
        var status = jsonResp["add_favorite_trip_status"];
    });
    //$('.favorite').html('♥');
    //this.html('♥');  no
    //this.$('.favorite').html('♥'); no
    //$(this).$('.favorite').html('♥'); no
    //$('this .favorite').html('♥'); 

    $('#' + intId + '').html('♥');

    //alert(" initFind() 前");
    //initFind();
    //alert(" initFind() 後");
}

// 搜尋區顯示更多/更少選項 @Q@ davidturtle
function moreFilterClick() {
    $("#moreFilter").click(function(event) {
        if ($(".searchContent > .row").hasClass('active')) {
            $("#moreFilter p").html("more filters");
        } else {
            $("#moreFilter p").html("less filters");

        }
        $(".searchContent > .row").toggleClass('active');

    });
}
// 排序區域點擊效果 @Q@ davidturtle
function sortBlkClick() {

    // 初始設定
    $("#sortValBtn .drop li").eq(0).addClass('active');
    $("#sortWayBtn .drop li").eq(0).addClass('active');


    $(window).click(function() {
        if (!event.target.matches("#sortValBtn")) {
            if ($("#sortValBtn > .drop").hasClass('active')) {

                $("#sortValBtn > .drop").removeClass('active');
            }
        }
        if (!event.target.matches("#sortWayBtn")) {
            if ($("#sortWayBtn > .drop").hasClass('active')) {

                $("#sortWayBtn > .drop").removeClass('active');
            }
        }
    });

    $("#sortValBtn").click(function(event) {
        $(this).children('.drop').addClass('active');
    });

    $("#sortWayBtn").click(function(event) {
        $(this).children('.drop').addClass('active');
    });

    $("#sortValBtn > ul li").click(function(event) {
        $("#sortValBtn > .sort_val").html($(this).html());
        $("#sortValBtn > ul li").removeClass('active');
        $(this).addClass('active');

        var sortCondition = [];
        sortCondition[0] = $("#sortValBtn .sort_val").html();
        sortCondition[1] = $("#sortWayBtn .sort_val").html();
        search(sortCondition);
    });

    $("#sortWayBtn > ul li").click(function(event) {
        $("#sortWayBtn > .sort_val").html($(this).children('.content').html());
        $("#sortWayBtn > ul li").removeClass('active');
        $(this).addClass('active');
        if ($(this).children('.content').html() == "Ascending") {
            $("#sortWayBtn .icon-diagram_up").removeClass('reverse');
        } else {
            $("#sortWayBtn .icon-diagram_up").addClass('reverse');
        }

        var sortCondition = [];
        sortCondition[0] = $("#sortValBtn .sort_val").html();
        sortCondition[1] = $("#sortWayBtn .sort_val").html();
        search(sortCondition);
    });
}

// 頁碼重整 RE@Q@ davidturtle
function pageReload(pageDataArray) {

    var preLinkVal = "<i class=\"icon-switchLeft\"></i><span>Previous</span>";
    var nextLinkVal = "<span>Next</span><i class=\"icon-switchRight\"></i>";

    $("#current_page").html(pageDataArray["current_page"]);

    if (pageDataArray["current_page"] - 1 < 1) {
        $("#prev_page_link").html("");
        $("#first_page_link").html("");
        $("#first_page_dot").html("");
    } else {
        $("#prev_page_link").html(preLinkVal);
        $("#first_page_link").html("1");
        $("#first_page_dot").html("...");
    }
    if (pageDataArray["current_page"] + 1 > pageDataArray["total_page"]) {
        $("#next_page_link").html("");
        $("#final_page_link").html("");
        $("#final_page_dot").html("");
    } else {
        $("#next_page_link").html(nextLinkVal);
        $("#final_page_link").html(pageDataArray["total_page"]);
        $("#final_page_dot").html("...");
    }
}