$(document).ready(initWishList);

function initWishList() {
    // 幣值設定
    initCurrencySelect();

    // folder 設定點選
    folderMoreClick();

    // 虛線產生
    dashLineGenerate(1000, 6, 2, 6, "#2bb0b9", $(".dashed_line"));

    $.getJSON("/trip/getFavoriteTrip", function(jsonResp) {
        $(".wish_blk").html("");
        var strUserCurrency = $("#moneySelect").val();
        $("div.userCurrencySpan").html(strUserCurrency);
        //trip data
        var lstDicTripData = jsonResp["trip"];
        for (i = 0; i < lstDicTripData.length; i++) {
            var dicTripData = lstDicTripData[i];

            var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"]);
            $(".wish_blk").append(strTripDataHtml);

            
            // 加入資料夾點擊 @Q@ davidturtle @TODO假的 需要連上真實資料
            addToFolderClick();
        };

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
            "<div class=\"folder_sel_btn\">",
            "<div class=\"text\">Choose Folders</div>",
            "<i class=\"icon-dropdown_icon\"></i>",
            "<ul class=\"menu\">",
            // @TODO 下面這串是假的 需要再連上真實資料
            "<li><span>favorite</span><i class=\"icon-checkmark\"></i></li><li><span>japan</span><i class=\"icon-checkmark\"></i></li><li><span>with parents</span><i class=\"icon-checkmark\"></i></li>",
            "</ul>",
            "</div>",
            "<div class=\"darken_bg\"></div>",
            "</div>",
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





function addPlan(intId) {
    //若無plan 導頁至 myPlan
    //若有plan 下拉選單展示myPlan 選其一後 導頁至 editPlan
}

function folderMoreClick() {
    $(".folder>.card>.text_blk>.more_btn").click(function(event) {
        $(this).parent().parent().parent().children('.menu').addClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".folder>.card>.text_blk>.more_btn")) {
            $(".folder>.menu").removeClass('active');
        }
    });
}

// 加入資料夾點擊 @Q@ davidturtle @TODO假的 需要連上真實資料
function addToFolderClick() {
    $(".folder_sel_btn").click(function(event) {
        $(this).children('.menu').addClass('active');
    });
    $(".folder_sel_btn .menu li").click(function(event) {
        $(this).toggleClass('active');
    });

    $(window).click(function() {
        if (!event.target.matches(".folder_sel_btn") && !event.target.matches(".folder_sel_btn *")) {
            $(".folder_sel_btn > .menu").removeClass('active');
        }
    });
}
