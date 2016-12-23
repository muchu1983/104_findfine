(function($) {
    $(document).ready(initMyTrip);

    function initMyTrip() {

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

        // 設定上方wish 數量
        setTopWishNum();

        // 通知止滑
        notiBlkPrevent();
        // 個人設定點選 @TODO 點擊後要將資料傳到後端 @Q@ davidturtle 
        personelSetClick("#personelSet", ".setting_menu", "#editName", "#userName", ".rename_blk");

        // 登出動作
        logoutToHome("#logOut");
        logoutToHome("#innerLogOut");

        planListRefresh();

        addNewPlanClick();

        $("#wishList").click(function() {
            window.location = "/page/wishList";
        });

        $("#myPlans").click(function() {
            window.location = "/page/myPlan";
        });

        $('#logoTop').click(function(event) {
            window.location = "/";
        });

        $('#wishesSel').click(function(event) {
            window.location = "/page/wishList";
        });

        $('#friendsSel').click(function(event) {
            window.location = "/page/myFriends";
        });


    };
})(jQuery);

// function deletePlan(intId) {
//     alert("deletePlan");
//     var strRemoveTripPlanUrl = "/trip/removeTripPlan?intPlanId=" + intId;
//     $.getJSON(strRemoveTripPlanUrl, function(jsonResp) {});
//     $('#' + intId + '').remove();
// }

// function editPlan(intId) {
//     alert("editPlan");
//     window.location = "/page/tripEdit?intPlanId=" + intId;
// }
