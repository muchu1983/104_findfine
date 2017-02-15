$(document).ready(initWishList);

function initWishList() {



    // 個人設定點選 @TODO 點擊後要將資料傳到後端 @Q@ davidturtle 
    personelSetClick("#personelSet", ".setting_menu", "#editName", "#userName", ".rename_blk");

    // 幣值設定
    initCurrencySelect();

    // 頁面刷新
    wishPageRenew();

    // 設定起頭PLAN數字
    setTopPlanNum();

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

    // 新增分類點選
    addNewFolderClick();

    // 選單搜尋 初始化
    initTopSearch();

    // 登出動作
    logoutToHome("#logOut");
    logoutToHome("#innerLogOut");


    $("#wishList").click(function() {
        window.location = "/page/wishList";
    });

    $("#myPlans").click(function(event) {
        window.location = "/page/myPlan";
    });

    $('#logoTop').click(function(event) {
        window.location = "/";
    });

    $('#plansSel').click(function(event) {
        window.location = "/page/myPlan";
    });

    $('#friendsSel').click(function(event) {
        window.location = "/page/myFriends";
    });



};


//幣別
function initCurrencySelect() {

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

        $("body").addClass('waiting_body');
        $(".waiting_fullblk").show();

        $.getJSON(strChangeUserCurrencyUrl, function(jsonResp) {
            strUserCurrency = jsonResp["strUserCurrency"];
            console.log("switch user currency to: " + strUserCurrency);

            wishPageRenew();
        });
    });
};
