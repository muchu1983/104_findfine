(function($) {
    $(document).ready(initMyTrip);

    function initMyTrip() {


        $('#myFriends').hide();
        $('#myMessages').hide();
        $('#logOut').hide();
        $('#noLogHeadBtn').hide();
        $("#headBtn").hide();
        $(".login_btns").hide();
        $(".logout_btns").hide();
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
        }

        $("#wishList").click(function() {
            window.location = "/page/wishList";
        });

        $("#myPlans").click(function() {
            window.location = "/page/myTrip";
        });

        $('#logoTop').click(function(event) {
            window.location = "/";
        });

        $('#loginBtn').hide();
        $('#noLogHeadBtn').hide();
        // 幣值設定
        initCurrencySelect();

        initTopSearch();

        // pad menu按鈕點擊
        padMenuAct();

        // mobile menu按鈕點擊
        mobileMenuClick();

        // toolbox點擊
        toolboxClick()

        // 頭像點擊
        headBtnClick();

        // 通知止滑
        notiBlkPrevent();

    };
})(jQuery);
