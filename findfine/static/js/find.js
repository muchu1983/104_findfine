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

    // @TODO 登入狀況判斷完成後修改此處
    $('#myFriends').hide();
    $('#myMessages').hide();
    $('#logOut').hide();
    $('#noLogHeadBtn').hide();
    $("#headBtn").hide();
    $(".login_btns").hide();
    $(".logout_btns").hide();
    $("#addToFolderBlk").hide();
    //strEmail 如已登入 不顯示login button 並顯示會員帳號
    if (strEmail == "None") {
        // 暫時隱藏 為測試方便使用
        $('#register').show();
        $('#loginBtn').show();
        $('#noLogHeadBtn').show();
        $("#padRegister").show();
        $("#padLoginBtn").show();
        $(".logout_btns").show();
    } else {
        $(".login_btns").show();
        $('#logOut').show();
        $('#register').hide();
        $('#loginBtn').hide();
        $('#myFriends').show();
        $('#myMessages').show();
        $("#headBtn").show();
        $("#padWishlist").show();
        $("#padMyPlan").show();
        $(".login_btns").show();
        $("#addToFolderBlk").show();
    }

    //登入按鈕
    $("#loginBtn").click(function() {
        if ($("#loginBtn").html() == "Log In") {
            window.location = "/account/login";
        }
    });

    // 註冊按鈕 點擊
    $("#register").click(function() {
        window.location = "/account/register"
    });

    // 未登入頭像 點擊
    $('#noLogHeadBtn').click(function(event) {
        window.location = "/account/login";
    });

    // LOGO 點擊
    $('#logoTop').click(function(event) {
        window.location = "/";
    });

    //搜尋按鈕 點擊
    $("#btnSearch").click(function() {

        // $("#current_page").html("1");
        $("#current_page").val("1");
        var sortCondition = [];
        sortCondition[0] = $("#sortValBtn .sort_val").html();
        sortCondition[1] = $("#sortWayBtn .sort_val").html();
        $('html,body').animate({
            scrollTop: $("#findContent").offset().top
        }, 600);
        search(sortCondition);

    });

    // PAD搜尋按鈕 點擊
    $("#padBtnSearch").click(function() {

        // $("#current_page").html("1");
        $("#current_page").val("1");
        var sortCondition = [];
        sortCondition[0] = $("#sortValBtn .sort_val").html();
        sortCondition[1] = $("#sortWayBtn .sort_val").html();
        $('html,body').animate({
            scrollTop: $("#findContent").offset().top
        }, 600);
        search(sortCondition);

    });

    // wishList 按鈕 點擊
    $("#wishList").click(function() {
        window.location = "/page/wishList";
    });

    // logOut 按鈕 點擊
    $("#logOut").click(function() {
        if ($("#logOut").html() == "Log Out") {
            window.location = "/account/logout";
        }
    });

    // myPlans 按鈕 點擊
    $("#myPlans").click(function() {
        window.location = "/page/myTrip";
    });


    // 初始設定以星星排序 RE@Q@ davidturtle
    var initSortCondition = [];
    initSortCondition[0] = "Rating";
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

    // 多選單選項點擊 @Q@ davidturtle
    multiSelClick("multiple choice");

    // 加減選單點擊 @Q@ davidturtle
    plusBtnClcik("click to add");

    // 單選按鈕點擊 @Q@ davidturtle
    singleSelClick("select");

    // toolbox點擊
    toolboxClick()

    // 選單搜尋初始化
    initTopSearch();

    // pad menu按鈕點擊
    padMenuAct();

    // mobile menu按鈕點擊
    mobileMenuClick();

    // find區止滑
    findBlkPrevent();

    // 頭像點擊
    headBtnClick();

    // 通知止滑
    notiBlkPrevent();

    // 日期選擇初始化
    $("#startFrom").datepicker();
    $("#to").datepicker();

    // 頁碼輸入功能
    pageNumberType("current_page");

    // 資料夾選擇初始化
    addWishFolderInit("#addToFolderBlk");

    // 登出動作
    logoutToHome("#logOut");

    //頁面按鈕點擊效果 RE@Q@ davidturtle

    // 前一頁
    $("#prev_page_link").click(function() {
        // $("#current_page").html(parseInt($("#current_page").html()) - 1);
        $("#current_page").val(parseInt($("#current_page").val()) - 1);
        search('');
    });

    // 下一頁
    $("#next_page_link").click(function() {
        $("#current_page").val(parseInt($("#current_page").val()) + 1);
        // $("#current_page").val(parseInt($("#current_page").val()) + 1);
        search('');
    });

    // 第一頁
    $("#first_page_link").click(function() {
        $("#current_page").val("1");
        // $("#current_page").val("1");
        search('');
    });

    // 最後一頁
    $("#final_page_link").click(function() {
        $("#current_page").val($("#final_page_link").html());
        // $("#current_page").val($("#final_page_link").html());
        search('');
    });

    var urlVal = getUrlValue(),
        sendLat = urlVal['lat'],
        sendLng = urlVal['lng'];
    initMap(sendLat, sendLng);

    $(window).resize(function(event) {
        $("#page-top .find .intro-text .searchContent").removeClass('active');
    });
};

//hmoe頁面傳值至find頁面 googleMap呈現
function initMap(sendLat, sendLng) {
    var styles = [{
        "featureType": "administrative.land_parcel",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.neighborhood",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.business",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    }];

    var locaVal = {
        lat: Number(sendLat),
        lng: Number(sendLng)
    };


    var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });

    var map = new google.maps.Map(document.getElementById('map'), {
        center: locaVal,
        zoom: 16,
        // 滑鼠滾輪滾動不影響地圖縮放
        //scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        disableDefaultUI: true,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    });

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    var input = /** @type {!HTMLInputElement} */ (
        document.getElementById('placeID'));

    // 附近景點參數
    var request = {
        location: locaVal,
        // 半徑範圍
        radius: '500',
        // 搜尋類型，可多種
        // 類型列表連結 https://developers.google.com/places/supported_types?hl=zh-tw
        // amusement_park/art_gallery/church/department_store/hospital/museum/zoo
        types: ['amusement_park', 'art_gallery', 'church', 'department_store', 'museum', 'zoo']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var nearStops = results;
            for (var i = 0; i < nearStops.length; i++) {
                var customTxt = [
                    "<div class=\"mapLabel\" onclick=\"labelClickSearch(\'mapLb" + i + "\')\" id=\"mapLb" + i + "\">",
                    "<p>" + nearStops[i].name + "</p>",
                    "<span class=\"labelTale\"></span>",
                    "</div>",
                ].join("");

                var tarLatLng = nearStops[i].geometry.location;
                txt = new TxtOverlay(tarLatLng, customTxt, "mapLabel_blk", map);

            }
        }
    }
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        // anchorPoint: new google.maps.Point(0, -29)
        position: map.center,
        optimized: false,
        zIndex: 1000,
        icon: '../static/img/map_icon.png',
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        } else {
            map.setCenter(place.geometry.location);
            var newLocate = map.getCenter(),
                newLat = newLocate.lat(),
                newLng = newLocate.lng();

            // console.log(map.getCenter(place.geometry.location));
            initMap(newLat, newLng);
        }
    });
}

//home頁面到find頁面 or 按下search鍵 會執行的動作 可傳入排序條件
function search(condition) {

    $(".waiting_blk").show();
    $("#TripDataBlk").hide();
    $(".page_link_blk").hide();
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
    //旅遊時間長短 RE@Q@ davidturtle
    var duration = $('#durationVal').html().split(",");
    // var duration = $('input:checkbox:checked[name="duration"]').map(function() {
    //     return $(this).val();
    // }).get();
    //人數
    var passenger = $("#passenger").val();
    //類型 RE@Q@ davidturtle
    var style = $('#styleVal').html().split(",");
    //旅遊時間點開始
    var tourStarts = $('#tourStarts :selected').text();
    //旅遊時間點結束
    var tourEnds = $('#tourEnds :selected').text();
    //導覽語言
    var guideLanguage = $('input:checkbox:checked[name="guideLanguage"]').map(function() {
        return $(this).val();
    }).get();
    //可立即參與
    var availability = $("#availability").html();
    //萬用搜尋
    var attrations = $("#attrations").val();

    var strFilterQueryUrl = "/trip/filter?1=1";

    //attrations
    if (attrations != "" && place != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + attrations + "," + place;
    };

    //place
    if (place != "" && attrations == "") {
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + place;
    };

    //attrations
    if (place == "" && attrations != "") {
        strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + attrations;
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

    //duration RE@Q@ davidturtle
    if (duration != "") {
        for (var i = 0; duration.length > i; i++) {
            if (duration[i] == "1hr") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=0&max_duration=1";
            }
            if (duration[i] == "2hrs") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=1&max_duration=2";
            }
            if (duration[i] == "3hrs") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=2&max_duration=3";
            }
            if (duration[i] == "4~6hrs") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=4&max_duration=6";
            }
            if (duration[i] == "1Day") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=7&max_duration=24";
            }
            if (duration[i] == "More than 1 Day") {
                strFilterQueryUrl = strFilterQueryUrl + "&min_duration=25&max_duration=1000";
            }
        }
    };
    //passenger 目前沒有
    if (passenger != "") {
        // strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + passengerDown;
    };
    //style 目前db無資料 js需修改
    if (style != "") {
        for (var i = 0; duration.length > i; i++) {
            if (style[i] == "Cultural &Theme") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Eco") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Fashion & Shopping") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Food, Wine & Nightlife") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Sightseeing") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Skyline") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Sports") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Tickets & Passes") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Wildlife") {
                strFilterQueryUrl = strFilterQueryUrl + "&style=" + style;
            }
            if (style[i] == "Walking & Biking") {
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
        } else if (condition[0] == "Rating") {
            strFilterQueryUrl = strFilterQueryUrl + order_text + "intReviewStar";
        } else if (condition[0] == "Voted") {
            strFilterQueryUrl = strFilterQueryUrl + order_text + "intReviewVisitor";
        } else {
            console.log("get sortVal error");
        }
    }

    //page
    console.log("page index: " + $("#current_page").val());
    strFilterQueryUrl = strFilterQueryUrl + "&page=" + $("#current_page").val();

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

        // 等待動畫
        $("body").removeClass('waiting_body');
        $(".waiting_fullblk").hide(500);
        $(".waiting_blk").hide();
        $("#TripDataBlk").show();

        $(".page_link_blk").show();
    });
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

// 搜尋區顯示更多/更少選項 @Q@ davidturtle
function moreFilterClick() {
    $("#moreFilter").click(function(event) {
        if ($(".searchContent").hasClass('active')) {
            $("#moreFilter p").html("more filters");
            $(".searchContent").removeClass('active');

            $(".searchContent").css({
                "overflow": "hidden",
            });
        } else {
            $("#moreFilter p").html("less filters");
            $(".searchContent").addClass('active');

            $(".searchContent").delay(1000).queue(function(next) {
                $(this).css({
                    "overflow": "initial",
                });
                next();
            });
        }
    });
}

// 排序區域點擊效果 @Q@ davidturtle
function sortBlkClick() {

    // 初始設定
    $("#sortValBtn .drop li").eq(0).addClass('active');
    $("#sortWayBtn .drop li").eq(0).addClass('active');


    $(window).click(function() {
        if (!event.target.matches("#sortValBtn") && !event.target.matches("#sortValBtn .click")) {
            $("#sortValBtn > .drop").removeClass('active');
        }
        if (!event.target.matches("#sortWayBtn") && !event.target.matches("#sortWayBtn .click")) {
            $("#sortWayBtn > .drop").removeClass('active');
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

    $("#current_page").val(pageDataArray["current_page"]);

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

// 地圖中的附近地區 @Q@ davidturtle
function TxtOverlay(pos, txt, cls, map) {

    // Now initialize all properties.
    this.pos = pos;
    this.txt_ = txt;
    this.cls_ = cls;
    this.map_ = map;

    // We define a property to hold the image's
    // div. We'll actually create this div
    // upon receipt of the add() method so we'll
    // leave it null for now.
    this.div_ = null;

    // Explicitly call setMap() on this overlay
    this.setMap(map);
}
TxtOverlay.prototype = new google.maps.OverlayView();
TxtOverlay.prototype.onAdd = function() {

    // Note: an overlay's receipt of onAdd() indicates that
    // the map's panes are now available for attaching
    // the overlay to the map via the DOM.

    // Create the DIV and set some basic attributes.
    var div = document.createElement('DIV');
    div.className = this.cls_;

    div.innerHTML = this.txt_;

    // Set the overlay's div_ property to this DIV
    this.div_ = div;
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    // We add an overlay to a map via one of the map's panes.

    var panes = this.getPanes();
    panes.floatPane.appendChild(div);
}
TxtOverlay.prototype.draw = function() {


        var overlayProjection = this.getProjection();

        // Retrieve the southwest and northeast coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to resize the DIV.
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);


        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';



    }
    //Optional: helper methods for removing and toggling the text overlay.  
TxtOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
}
TxtOverlay.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
}

TxtOverlay.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
}

TxtOverlay.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility == "hidden") {
            this.show();
        } else {
            this.hide();
        }
    }
}

TxtOverlay.prototype.toggleDOM = function() {
    if (this.getMap()) {
        this.setMap(null);
    } else {
        this.setMap(this.map_);
    }
}

// 附近景點點擊 @Q@ davidturtle
function labelClickSearch(tarId) {
    console.log(tarId);
    var tarVal = $("#" + tarId).children('p').html();
    $("#keyword").html(tarVal);
    search('');
}
