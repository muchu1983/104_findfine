//初始化autocomplate place_chenged event
tour.sendData = {};

function initMap() {
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

    var headInput = (document.getElementById('topSearch'));
    var headAutocomplete = new google.maps.places.Autocomplete(headInput);
    headAutocomplete.addListener('place_changed', function() {
        var place = headAutocomplete.getPlace();
        if (!place.geometry) {
            //未獲得地點資訊
            return;
        }
        tour.sendData = {
            keyword: document.getElementById('topSearch').value,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
    });

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
    // 選單搜尋
    $('#topSearch').keypress(function (e) {
     var key = e.which;
     if(key == 13)  // the enter key code
      {
        console.log("ada");
      }
    });  

    $('#wishList').hide();
    $('#myFriends').hide();
    $('#myPlans').hide();
    $('#myMessages').hide();
    $('#logOut').hide();
    $('#register').hide();
    $('#loginBtn').hide();

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
}

$(function() {
    $('#btnFindTrip').on('click', function() {
        //暫時改丟靜態頁,之後改後端接
        //若無googlemap資訊 將值帶到下一頁
        if (typeof tour.sendData.keyword == 'undefined') {
            var input = ($('#autocomplete')).val();
            location.href = '/page/find?keyword=' + input + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
        } else {
            location.href = '/page/find?keyword=' + tour.sendData.keyword + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
        }
    });

    // 選單搜尋 ENTER @Q@ davidturtle
    headerSearch();

    //圖片展示區塊
    $('.portfolio-link').on('click', function(e) {
        e.preventDefault();
        var url = '/page/find?keyword=' + $(this).data('place') + '&lat=' + $(this).data('lat') + '&lng=' + $(this).data('lng');
        location.href = url;
    });
});

(function($) {

    $(document).ready(initHome);

    function initHome() {

        initCurrencySelect();
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
        var recomTourSearchCon = "/trip/filter?1=1&keyword=Taichung&page=1";
        homeRecomTour(recomTourSearchCon);

        $(".head_btn")  .click(function(event) {
            $(this).children('.head_menu').toggleClass('active');
        });
    };

    

})(jQuery);
 