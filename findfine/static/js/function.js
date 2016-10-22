// 飛機飛呀飛 @Q@davidturtle
function planeFly(sec){
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

// 加至wishlist按鈕點擊 @Q@davidturtle
function addToWishlistBtnClick(){
    $(".add_wish_btn").click(function(event) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else{
            $(this).addClass('active');
        }
    });
}

// 選單隨畫面下移改變為down樣式 @Q@davidturtle
function topNavDown(distance){
        $(window).scroll(function() {
        var top_position = $(window).scrollTop();
        if (top_position > distance) {
            $("#page-top .navbar-custom").addClass('down');
        }else{
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
function homeMonthStoryMenuClick(){
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
function homeMonthStoryMenuLiClick(){
    $("#monthDropDown li").click(function(event) {
        var tarEq = getEqVal($(this));
        $("#monthSelBtn").html($(this).html());
    });
}


// 首頁建議旅程抓取 RE@Q@davidturtle
function homeRecomTour(strFilterQueryUrl){

    $.getJSON(strFilterQueryUrl, function(jsonResp) {
        //console.log(jsonResp);
        var strUserCurrency = $("#moneySelect").val();
        //trip data
        var lstDicTripData = jsonResp["trip"];

        console.log(lstDicTripData);
        for (i = 0; i < 3; i++) {
            var dicTripData = lstDicTripData[i];
            var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"], dicTripData["isFavoriteTrip"]);
            $("#tourBlk").append(strTripDataHtml);
        };

        // add to wishlist 按鈕點擊
        addToWishlistBtnClick();
    });
}

//組出單組查詢結果出來的html字串
function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, isFavoriteTrip) {

    var reviewStar = "";
    fillstarQan = intReviewStar;
    emptystarQan = 5-intReviewStar;
    for (var fillstarCount = 0; fillstarCount < fillstarQan; fillstarCount++) {
        reviewStar+="<span class='icon-star_fill'></span>";
    }
    for (var emptystarCount = 0; emptystarCount< emptystarQan; emptystarCount++) {
        reviewStar+="<span class='icon-star_empty'></span>";
    }
    // 設定文字擷取字數 @Q@davidturtle
    var strIntroduction = strIntroduction.substr(0, 75);
    var strTitle = strTitle.substr(0,25);

    var favoriteTrip;

    //alert("isFavoriteTrip : "+isFavoriteTrip +"  length : "+isFavoriteTrip.toString());

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
// ripple按鈕效果啟動 @Q@ davidturtle
function initRippleBtn(){
    $('.ripple').on('click', function (event) {
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
          top: yPos - ($ripple.height()/2),
          left: xPos - ($ripple.width()/2),
          background: $(this).data("ripple-color"),
        }) 
        .appendTo($(this));

      window.setTimeout(function(){
        $div.remove();
      }, 2000);
    });
}