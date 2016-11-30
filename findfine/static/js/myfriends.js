(function($) {

    $(document).ready(initMyfriends);

    function initMyfriends() {


        $("#wishList").click(function() {
            window.location = "/page/wishList";
        });

        $("#myPlans").click(function() {
            window.location = "/page/myTrip";
        });

        $('#logoTop').click(function(event) {
            window.location = "/";
        });

        $('#wishesSel').click(function(event) {
            window.location = "/page/wishList";
        });

        $('#plansSel').click(function(event) {
            window.location = "/page/myTrip";
        });

        // 幣值設定
        initCurrencySelect();

        friendSetClick();

        initTopSearch();

        friendRemoveClick();

        // pad menu按鈕點擊
        padMenuAct();

        // toolbox點擊
        toolboxClick()

        // 頭像點擊
        headBtnClick();

        // 通知止滑
        notiBlkPrevent();

        // mobile menu按鈕點擊
        mobileMenuClick();

        // 個人設定點選 @TODO 點擊後要將資料傳到後端 @Q@ davidturtle 
        personelSetClick("#personelSet", ".setting_menu", "#editName", "#userName", ".rename_blk");
    };

})(jQuery);

function friendSetClick() {
    $(".set_btn").click(function(event) {
        $(this).parent().children('.menu').toggleClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".setting_blk") && !event.target.matches(".setting_blk *")) {
            $(".setting_blk>.menu").removeClass('active');
        }
    });
}
