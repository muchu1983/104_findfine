//初始化autocomplate place_chenged event

function initStatus() {

    $('#myFriends').hide();
    $('#myMessages').hide();
    $('#logOut').hide();
    $('#noLogHeadBtn').hide();
    $("#headBtn").hide();
    $(".login_btns").hide();
    $(".logout_btns").hide();
    //strEmail 如已登入 不顯示login button 並顯示會員帳號
    var screenWidth = $(window).width();
    if (strEmail == "None") {
        // 暫時隱藏 為測試方便使用
        $('#noLogHeadBtn').show();
        $("#padRegister").show();
        $("#padLoginBtn").show();
        $(".logout_btns").show();
        if (screenWidth < 769) {
            $('#register').show();
            $('#loginBtn').show();
        } else if (screenWidth < 1051) {
            $('#register').hide();
            $('#loginBtn').hide();
        } else {
            $('#register').show();
            $('#loginBtn').show();
        }
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
    }
    $(window).resize(function(event) {
        var screenWidth = $(window).width();
        if (strEmail == "None") {
            if (screenWidth < 769) {
                $('#register').show();
                $('#loginBtn').show();
            } else if (screenWidth < 1051) {
                $('#register').hide();
                $('#loginBtn').hide();
            } else {
                $('#register').show();
                $('#loginBtn').show();
            }
        }
    });
}

(function($) {

    $(document).ready(initHome);

    function initHome() {

        // pad menu按鈕點擊
        padMenuAct();

        // mobile menu按鈕點擊
        mobileMenuClick();

        // 選單搜尋初始化
        initTopSearch();

        // toolbox點擊
        toolboxClick();

        homeInitCurrencySelect();

        // 大LOGO箭頭動畫 @Q@davidturtle
        $(".intro-text > .arrow_blk_hideblk>.arrow_blk").delay(1500).queue(function(next) {
            $(this).addClass('active');
            next();
        });

        // 頁面下滑選單效果 @Q@davidturtle
        topNavDown(800);


        // 頭像點擊
        headBtnClick();

        // 通知止滑
        notiBlkPrevent();

        initStatus();

        // 登出動作
        logoutToHome("#logOut");

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
            window.location = "/page/myPlan";
        });

        // pad版myPlans按鈕點擊 @Q@ davidturtle
        $("#padMyPlan").click(function() {
            window.location = "/page/myPlan";
        });


        //登入按鈕        
        $("#loginBtn").click(function() {
            window.location = "/account/login";
        });

        //未登入頭像按鈕        
        $("#noLogHeadBtn").click(function() {
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
    };

})(jQuery);
