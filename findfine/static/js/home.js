//初始化autocomplate place_chenged event


function initMap() {

    tour.sendData = {};

    homeRecommedTourGet();

    // pad menu按鈕點擊
    padMenuAct();

    // mobile menu按鈕點擊
    mobileMenuClick();

    // toolbox點擊
    toolboxClick()

    // 首頁搜尋區塊自動完成
    var input = (document.getElementById('autocomplete'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {

        var place = autocomplete.getPlace();
        if (!place.geometry) {
            //未獲得地點資訊
            return;
        }
        tour.sendData = {
            keyword: document.getElementById('autocomplete').value,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
    });

    // $('#wishList').hide();
    // $('#myPlans').hide();
    $('#myFriends').hide();
    $('#myMessages').hide();
    $('#logOut').hide();
    $('#register').hide();
    $('#loginBtn').hide();
    $('#noLogHeadBtn').hide();

    //strEmail 如已登入 不顯示login button 並顯示會員帳號
    if (strEmail == "None") {
        // 暫時隱藏 為測試方便使用
        // $('#register').show();
        // $('#loginBtn').show();
    } else {
        $('#wishList').show();
        $('#myPlans').show();
        $('#logOut').show();
        $('#register').hide();
        $('#loginBtn').hide();
        // $('#loginBtn').html(strEmail);
        // $('#myFriends').show();
        // $('#myMessages').show();
    }

    //登入按鈕
    $("#loginBtn").click(function() {
        if ($("#loginBtn").html() == "Log In") {
            window.location = "/account/login";
        }
    });

    //申請按鈕
    $("#register").click(function() {
        if ($("#register").html() == "Sign Up") {
            window.location = "/account/register";
        }
    });

    // 登出按鈕點擊
    $("#logOut").click(function() {
        if ($("#logOut").html() == "Log Out") {
            window.location = "/account/logout";
        }
    });



    // wishList按鈕點擊 @Q@ davidturtle
    $("#wishList").click(function() {
        window.location = "/page/wishList";
    });

    // pad版wishList按鈕點擊 @Q@ davidturtle
    $("#padWishlist").click(function() {
        window.location = "/page/wishList";
    });

    // myPlans按鈕點擊 @Q@ davidturtle
    $("#myPlans").click(function() {
        window.location = "/page/myTrip";
    });

    // pad版myPlans按鈕點擊 @Q@ davidturtle
    $("#padMyPlan").click(function() {
        window.location = "/page/myTrip";
    });

    // moretour按鈕點擊 @Q@ davidturtle
    $("#moreBtn").click(function(event) {
        window.location = "/page/find";

    });
    $('#btnFindTrip').on('click', function() {
        //暫時改丟靜態頁,之後改後端接
        //若無googlemap資訊 將值帶到下一頁
        if (typeof tour.sendData.keyword == 'undefined') {
            var input = ($('#autocomplete')).val();
            location.href = '/page/find?keyword=' + input + '&lat=' + tour.sendData.lat + '&lng=' + c.sendData.lng;
        } else {
            location.href = '/page/find?keyword=' + tour.sendData.keyword + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
        }
    });

    //圖片展示區塊
    $('.portfolio-link').on('click', function(e) {
        e.preventDefault();
        var url = '/page/find?keyword=' + $(this).data('place') + '&lat=' + $(this).data('lat') + '&lng=' + $(this).data('lng');
        location.href = url;
    });

}

(function($) {

    $(document).ready(initHome);

    function initHome() {

        homeInitCurrencySelect();
        //登入按鈕
        $("#loginBtn").click(function() {
            window.location = "/account/login";
        });
        // 飛機飛呀飛 @Q@davidturtle
        planeFly(5000);
        $(".plane_print").addClass('active');


        // 大LOGO箭頭動畫 @Q@davidturtle
        $(".intro-text > .arrow_blk_hideblk>.arrow_blk").delay(1500).queue(function(next) {
            $(this).addClass('active');
            next();
        });

        // 頁面下滑選單效果 @Q@davidturtle
        topNavDown(800);

        // 月份選單點擊效果 @Q@davidturtle
        homeMonthStoryMenuClick();

        // @TODO 實際抓出STORY資料
        homeMonthStoryMenuLiClick();

        // add to wishlist 按鈕點擊 @Q@ davidturtle
        addToWishlistBtnClick();
        // 推薦TOUR設定
        // 設定搜尋參數 @Q@davidturtle @TODO 後台功能增加後須改寫
        homeRecomTour();

        // 頭像點擊
        headBtnClick();

        // 通知止滑
        notiBlkPrevent();

        initMap();
    };



})(jQuery);
