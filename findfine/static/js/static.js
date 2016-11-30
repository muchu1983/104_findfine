(function($) {
    $(document).ready(initMyTrip);

    function initMyTrip() {


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
