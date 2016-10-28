// 飛機飛呀飛 @Q@davidturtle
function planeFly(sec) {
    var ms = document.querySelectorAll('.flying_plane');
    var defaultTiming = {
        duration: sec,
        iterations: 1,
        fill: 'both',
        easing: 'ease-in-out'
    };

    if (ms[0].style.motionOffset !== undefined) {
        var easing = 'cubic-bezier(.645,.045,0.355,1)';

        ms[0].animate([{
            motionOffset: 0,
            motionRotation: 'auto'
        }, {
            motionOffset: '100%',
            motionRotation: 'auto'
        }], defaultTiming);
    } else {
        document.documentElement.className = 'no-motionpath'
    }
}

// 加至wishList
function addFavoriteTrip(intId) {
    var strAddFavoriteTripUrl = "/trip/addFavoriteTrip?intTripId=" + intId;
    $.getJSON(strAddFavoriteTripUrl, function(jsonResp) {
        var status = jsonResp["add_favorite_trip_status"];
        console.log("add success");
    });
    //$('.favorite').html('♥');
    //this.html('♥');  no
    //this.$('.favorite').html('♥'); no
    //$(this).$('.favorite').html('♥'); no
    //$('this .favorite').html('♥'); 

    // $('#' + intId + '').html('♥');

    //alert(" initFind() 前");
    //initFind();
    //alert(" initFind() 後");
}

function removeFavoriteTrip(intId) {
    var strAddFavoriteTripUrl = "/trip/removeFavoriteTrip?intTripId=" + intId;
    $.getJSON(strAddFavoriteTripUrl, function(jsonResp) {
        var status = jsonResp["delete_favorite_trip_status"];
        console.log("remove success");
    });

    // $('#'+intId+'').hide();

    //alert(" initWishList() 前");
    //initWishList();
    //alert(" initWishList() 後");
    //window.location.reload();
}

// 加至wishlist按鈕點擊 @Q@davidturtle
function addToWishlistBtnClick() {
    $(".add_wish_btn").click(function(event) {
        var tarId = $(this).data('id');
        if ($(this).hasClass('active')) {
            removeFavoriteTrip(tarId);
            $(this).removeClass('active');
        } else {
            addFavoriteTrip(tarId);
            $(this).addClass('active');
        }
    });
}

// 選單隨畫面下移改變為down樣式 @Q@davidturtle
function topNavDown(distance) {
    $(window).scroll(function() {
        var top_position = $(window).scrollTop();
        if (top_position > distance) {
            $("#page-top .navbar-custom").addClass('down');
        } else {
            $("#page-top .navbar-custom").removeClass('down');

        }
    });
}

// 取得目標EQ值 @Q@davidturtle
function getEqVal(element) {
    var index = element.index();

    return index;
}

// 月份選單點擊效果 @Q@davidturtle
function homeMonthStoryMenuClick() {
    $(window).click(function() {
        if (!event.target.matches("#monthSelBtn")) {
            if ($("#monthDropDown").hasClass('active')) {

                $("#monthDropDown").removeClass('active');
            }
        }
    });
    $("#monthSelBtn").click(function(event) {
        /* Act on the event */
        if ($("#monthDropDown").hasClass('active')) {

            $("#monthDropDown").removeClass('active');
        } else {
            $("#monthDropDown").addClass('active');
        }
    });
}

// 首頁月份選單項目點擊 @Q@davidturtle
// @TODO 實際抓出STORY資料
function homeMonthStoryMenuLiClick() {
    $("#monthDropDown li").click(function(event) {
        var tarEq = getEqVal($(this));
        $("#monthSelBtn").html($(this).html());
    });
}


// 首頁建議旅程抓取 RE@Q@davidturtle
function homeRecomTour(strFilterQueryUrl, startNum, totalDic) {
    // $("#tourBlk").html("");
    $.getJSON(strFilterQueryUrl, function(jsonResp) {
        //console.log(jsonResp);
        var strUserCurrency = $("#moneySelect").val();
        //trip data
        var lstDicTripData = jsonResp["trip"];

        console.log(lstDicTripData);
        for (i = 0; i < lstDicTripData.length; i++) {
            var dicTripData = lstDicTripData[i];
            var strTripDataHtml = getHomeTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"], dicTripData["isFavoriteTrip"]);
            $("#tourBlk").append(strTripDataHtml);
        };

        // add to wishlist 按鈕點擊
        addToWishlistBtnClick();

        // 隔十秒換三張 @Q@ davidturtle
        homeRecAct();
    });
}

//組出單組查詢結果出來的html字串
function getHomeTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, isFavoriteTrip) {

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
        favoriteTrip = " active";
        // favoriteTrip = "<div class=\"favorite\">♥</div>";
    }
    if (isFavoriteTrip.toString() == "false") {
        favoriteTrip = "";
    }
    var strTripDataHtml = [
        "<div class=\"tour hometour\">",
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
        "<div class=\"compeople\">- " + intReviewVisitor + " voted -</div>",

        "<div class=\"trimtext\">" + strIntroduction + "...</div>",
        "<div class=\"readmore_btn\">",
        "<a target=\"_blank\" href=" + strOriginUrl + " data-ripple-color=\"#2bb0b9\">Read More</a>",
        "</div>",
        "<div class=\"footprint_blk\">",
        "<span class=\"icon-tourdash footprint\"></span>",
        "</div>",
        "<div class=\"add_wish_btn" + favoriteTrip + "\" data-id=\"" + intId + "\">",
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
        favoriteTrip = " active";
        // favoriteTrip = "<div class=\"favorite\">♥</div>";
    }
    if (isFavoriteTrip.toString() == "false") {
        favoriteTrip = "";
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
        "<div class=\"compeople\">- " + intReviewVisitor + " voted -</div>",

        "<div class=\"trimtext\">" + strIntroduction + "...</div>",
        "<div class=\"readmore_btn\">",
        "<a target=\"_blank\" href=" + strOriginUrl + " data-ripple-color=\"#2bb0b9\">Read More</a>",
        "</div>",
        "<div class=\"footprint_blk\">",
        "<span class=\"icon-tourdash footprint\"></span>",
        "</div>",
        "<div class=\"add_wish_btn" + favoriteTrip + "\" data-id=\"" + intId + "\">",
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
// ripple按鈕效果啟動 @Q@ davidturtle
function initRippleBtn() {
    $('.ripple').on('click', function(event) {
        event.preventDefault();

        var $div = $('<div/>'),
            btnOffset = $(this).offset(),
            xPos = event.pageX - btnOffset.left,
            yPos = event.pageY - btnOffset.top;



        $div.addClass('ripple-effect');
        var $ripple = $(".ripple-effect");

        $ripple.css("height", $(this).height());
        $ripple.css("width", $(this).height());
        $div
            .css({
                top: yPos - ($ripple.height() / 2),
                left: xPos - ($ripple.width() / 2),
                background: $(this).data("ripple-color"),
            })
            .appendTo($(this));

        window.setTimeout(function() {
            $div.remove();
        }, 2000);
    });
}


// 多選單選項點擊 @Q@ davidturtle
function multiSelClick(oriText) {
    $(".multi_sel_btn>.menu>li").click(function(event) {
        $(this).toggleClass('active');
        multiSelValSet($(this).parent('.menu').parent('.multi_sel_btn'), oriText);
    });
    $(".multi_sel_btn").click(function(event) {
        if (!event.target.matches(".multi_sel_btn>.menu>.clear_btn")) {
            $(".multi_sel_btn").children('.menu').removeClass('active');
            $(this).children('.menu').addClass('active');
        }
    });
    $(".multi_sel_btn>.menu>.clear_btn").click(function(event) {
        $(this).parent('.menu').children('li').removeClass('active');
        multiSelValSet($(this).parent('.menu').parent('.multi_sel_btn'), oriText);
        $(this).parent('.menu').removeClass('active');
    });


    $(window).click(function() {
        if (!event.target.matches(".multi_sel_btn") && !event.target.matches(".multi_sel_btn *")) {
            $(".multi_sel_btn > .menu").removeClass('active');
        }
    });

}

// 多選單選項點擊後內容調整 @Q@ davidturtle
function multiSelValSet(selBlk, oriText) {
    var selVal = "";
    var tarLi = selBlk.children('.menu').children('li');
    for (var liAciveCheckNum = 0; tarLi.eq(liAciveCheckNum).length > 0; liAciveCheckNum++) {
        if (tarLi.eq(liAciveCheckNum).hasClass('active')) {
            if (selVal == "") {
                selVal += tarLi.eq(liAciveCheckNum).children('span').html();
            } else {
                selVal += ", " + tarLi.eq(liAciveCheckNum).children('span').html();
            }
        }
    }
    if (selVal == "") {
        selBlk.children('.value').html(oriText);
    } else {
        selBlk.children('.value').html(selVal);
    }
}

// 加減選單點擊 @Q@ davidturtle
function plusBtnClcik(oriText) {

    $(".plus_click_btn .icon-minus_round").click(function(event) {
        var valBlk = $(this).parent().children('.value');
        if (valBlk.html() == oriText) {} else {
            var valBlkVal = valBlk.html();
            valBlkVal--;
            if (valBlkVal == 0) {
                valBlk.html(oriText);
            } else {
                valBlk.html(valBlkVal);
            }
        }
    });
    $(".plus_click_btn .icon-plus_round").click(function(event) {
        var valBlk = $(this).parent().children('.value');
        if (valBlk.html() == oriText) {
            valBlk.html("1");
        } else {
            var valBlkVal = valBlk.html();
            valBlkVal++;
            valBlk.html(valBlkVal);
        }
    });

}

// 單選按鈕點擊 @Q@ davidturtle
function singleSelClick(oriText) {

    $(".single_sel_btn>.menu>li").click(function(event) {
        $(".single_sel_btn>.menu>li").removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().children('.value').html($(this).html());
        console.log($(this).html());
        $(this).parent('.menu').removeClass('active');
    });
    $(".single_sel_btn>.menu>.clear_btn").click(function(event) {
        $(".single_sel_btn>.menu>li").removeClass('active');
        $(this).parent().parent().parent().children('.single_sel_btn').children('.value').html(oriText);
        $(this).parent('.menu').removeClass('active');
    });
    $(".single_sel_btn").click(function(event) {
        if (!event.target.matches(".single_sel_btn>.menu>.clear_btn") && !event.target.matches(".single_sel_btn>.menu>li")) {
            $(".single_sel_btn").children('.menu').removeClass('active');
            $(this).children('.menu').addClass('active');
        }
    });
    $(window).click(function() {
        if (!event.target.matches(".single_sel_btn") && !event.target.matches(".single_sel_btn *")) {
            $(".single_sel_btn > .menu").removeClass('active');
        }
    });

}
//幣別
function initCurrencySelect() {
    //設定目前幣別
    var strUserCurrencyUrl = "/trip/userCurrency";
    $.getJSON(strUserCurrencyUrl, function(jsonResp) {
        strUserCurrency = jsonResp["strUserCurrency"];
        $("#moneySelect").val(strUserCurrency);
        $("#moneySelect").selectpicker("refresh")
        console.log("init user currency selection: " + strUserCurrency);
    });
    //切換目前幣別
    $("#moneySelect").change(function() {
        var strSelectedCurrencyVal = $("#moneySelect").find(":selected").val();
        var strChangeUserCurrencyUrl = strUserCurrencyUrl + "?user_currency=" + strSelectedCurrencyVal;

        $.getJSON(strChangeUserCurrencyUrl, function(jsonResp) {
            strUserCurrency = jsonResp["strUserCurrency"];
            console.log("switch user currency to: " + strUserCurrency);
        });
    });

};

// 虛線產生 @Q@ davidturtle
function dashLineGenerate(totalWidth, dashWidth, dashHeight, dashSpace, dashColor, tar) {
    var htmlCon = "";
    var dashHtml = "<div style=\"width: " + dashWidth + "px;height: " + dashHeight + "px;background-color: " + dashColor + ";float: left;\"></div>";
    var spaceHtml = "<div style=\"width: " + dashSpace + "px;height: " + dashHeight + "px;float: left;\"></div>";
    var totalLength = 0;
    for (var totalLength = dashWidth + dashSpace; totalLength < totalWidth; totalLength += dashWidth + dashSpace) {
        htmlCon += dashHtml + spaceHtml;
    }
    tar.html(htmlCon);
}

// 選單搜尋 ENTER @Q@ davidturtle
function headerSearch() {
    $('#topSearch').keypress(function(e) {
        var key = e.which;
        var tarPlace = $(this).val();
        if (key == 13) {
            if (typeof tour.sendData.keyword == 'undefined') {
                var headInput = ($('#topSearch')).val();
                location.href = '/page/find?keyword=' + headInput + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
            } else {
                location.href = '/page/find?keyword=' + tour.sendData.keyword + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
            }
        }
    });
}

// 首頁推薦旅程動態 @Q@ davidturtle

function homeRecShow(ingNum) {
    $(".home_tour_blk .hometour").hide();
    var tarNum = ingNum + 3;
    for (var i = ingNum; i < tarNum; i++) {
        $(".home_tour_blk .hometour").eq(i).css({
            'left': i % 3 * 33.333333333 + "%",
            'display': 'block',
        });
        $(".home_tour_blk .hometour").eq(i).delay(i % 3 * 200).queue(function(next) {
            $(this).addClass('active');
            next();
        });
    }

}

function homeRecHide(ingNum) {
    var tarNum = ingNum + 3;
    for (var i = ingNum; i < tarNum; i++) {
        $(".home_tour_blk .hometour").eq(i).delay(i % 3 * 200).queue(function(next) {
            $(this).addClass('away');
            next();
            $(this).delay(1000).queue(function(next) {
                $(this).removeClass('active');
                $(this).removeClass('away');
                next();
            });
        });
    }
}

function homeRecAct() {

    var ingNumber;
    var myLoop = setInterval(function() {

        homeRecHide(ingNumber);
        ingNumber = $("#tourBlk").data('ing');
        ingNumber = ingNumber+3;
        if (ingNumber>=15) {
            ingNumber = 0;
        }
        console.log(ingNumber);
        $("#tourBlk").data('ing', ingNumber);
        console.log($("#tourBlk").data('ing'));
        homeRecShow(ingNumber);
    }, 15000);
}

// 首頁推薦旅程動態
