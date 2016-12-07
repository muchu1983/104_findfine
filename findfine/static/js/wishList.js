$(document).ready(initWishList);

function initWishList() {



    // 個人設定點選 @TODO 點擊後要將資料傳到後端 @Q@ davidturtle 
    personelSetClick("#personelSet", ".setting_menu", "#editName", "#userName", ".rename_blk");

    // 幣值設定
    initCurrencySelect();

    // folder 設定點選
    folderMoreClick();
    renameFolderClick();
    folderClick();

    // ING folder 點選
    ingFolderClick();

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

    $("#wishList").click(function() {
        window.location = "/page/wishList";
    });

    $("#myPlans").click(function() {
        window.location = "/page/myTrip";
    });

    $('#logoTop').click(function(event) {
        window.location = "/";
    });

    $('#plansSel').click(function(event) {
        window.location = "/page/myTrip";
    });
    
    $('#friendsSel').click(function(event) {
        window.location = "/page/myFriends";
    });

    $(".wish_blk").html("");
    $(".wish_blk").hide();
    $(".waiting_blk").show();

    // addToFolderClick();
    $.getJSON("/trip/getFavoriteTrip", function(jsonResp) {

        var strUserCurrency = $("#moneySelect").val();
        $("div.userCurrencySpan").html(strUserCurrency);
        //trip data
        var lstDicTripData = jsonResp["trip"];
        for (i = 0; i < lstDicTripData.length; i++) {
            var dicTripData = lstDicTripData[i];

            var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"]);
            $(".wish_blk").append(strTripDataHtml);


            // 加入資料夾點擊 @Q@ davidturtle @TODO假的 需要連上真實資料
        };

        addToFolderClick();
        $(".waiting_blk").hide();
        $(".wish_blk").show();

    });


    //組出單組查詢結果出來的html字串
    function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId) {
        var reviewStar;
        if (intReviewStar == 0) {
            reviewStar = '☆☆☆☆☆';
        }
        if (intReviewStar == 1) {
            reviewStar = '★☆☆☆☆';
        }
        if (intReviewStar == 2) {
            reviewStar = '★★☆☆☆';
        }
        if (intReviewStar == 3) {
            reviewStar = '★★★☆☆';
        }
        if (intReviewStar == 4) {
            reviewStar = '★★★★☆';
        }
        if (intReviewStar == 5) {
            reviewStar = '★★★★★';
        }

        var strIntroduction = strIntroduction.substr(0, 135);

        var strTripDataHtml = [
            "<div class=\"wish\">",
            "<div class=\"card active\" style=\"background-image:url(" + strImageUrl + ");\">",
            "<div class=\"name\">",
            "<p>" + strTitle + "</p>",
            "</div>",
            "<p class=\"place\">" + strLocation + "</p>",
            "<p class=\"duration\">" + intDurationHour + "<span>HR</span></p>",
            "<div class=\"price\">",
            "<span class=\"country\">" + strUserCurrency + "</span> $",
            "<span class=\"number\">" + intUserCurrencyCost + "</span>",
            "</div>",
            "<div class=\"footprint_blk\">",
            "<span class=\"icon-tourdash footprint\"></span>",
            "</div>",            
            "<a target=\"_blank\" href=" + strOriginUrl + " class=\"read_more_btn\">Read More</a>",
            "<div class=\"folder_sel_btn\">",
            "<div class=\"text\">Choose Folders</div>",
            "<i class=\"icon-dropdown_icon\"></i>",
            "</div>",
            "<div class=\"darken_bg\"></div>",
            "</div>",
            "<ul class=\"menu\">",
            // @TODO 下面這串是假的 需要再連上真實資料
            "<li><span>favorite</span><i class=\"icon-checkmark\"></i></li><li><span>japan</span><i class=\"icon-checkmark\"></i></li><li><span>with parents</span><i class=\"icon-checkmark\"></i></li>",
            "</ul>",
            "</div>"
        ].join("");
        // var strTripDataHtml = [
        //     "<li id=" + intId + " style=\"list-style-type:none;\">",
        //     "<div>",
        //     //TODO 需要每個TOUR的KEY
        //     "<p><img src=\"" + strImageUrl + "\"/><p>",
        //     "<p><span style=\"color:orange\">" + strTitle + "</span></p>",
        //     "<p><a href=" + strOriginUrl + " target=\"_blank\"> read more</a><p>",
        //     "<p><span> Duration:" + intDurationHour + "</span></p>",
        //     "<p><span style=\"color:red\">Stars:" + reviewStar + "</span></p>",
        //     "<p><span>review:" + intReviewVisitor + "</span></p>",
        //     "<p><div class=\"favorite\" onclick=\"addPlan(" + intId + ")\">add plan</div><div class=\"favorite\" onclick=\"removeFavoriteTrip(" + intId + ")\">remove</div></p>",
        //     "</div>",
        //     "</li>"
        // ].join("");
        return strTripDataHtml;
    };
};
