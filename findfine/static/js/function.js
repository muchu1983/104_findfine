// 飛機飛呀飛
function planeFly(sec) {
    var ms = document.querySelectorAll('.flying_plane');
    var defaultTiming = {
        duration: sec,
        iterations: 1,
        fill: 'both',
        easing: 'ease-in-out'
    };

    if (ms[0].style.motionOffset !== undefined) {
        var easing = 'cubic-bezier(.645,.045,0.355,1)';

        ms[0].animate([{
            motionOffset: 0,
            motionRotation: 'auto'
        }, {
            motionOffset: '100%',
            motionRotation: 'auto'
        }], defaultTiming);
    } else {
        document.documentElement.className = 'no-motionpath'
    }
}

// 加至wishList
function addFavoriteTrip(intId) {
    var strAddFavoriteTripUrl = "/trip/addFavoriteTrip?intTripId=" + intId;
    $.getJSON(strAddFavoriteTripUrl, function(jsonResp) {
        var status = jsonResp["add_favorite_trip_status"];
        console.log("add success");
    });
    //$('.favorite').html('♥');
    //this.html('♥');  no
    //this.$('.favorite').html('♥'); no
    //$(this).$('.favorite').html('♥'); no
    //$('this .favorite').html('♥'); 

    // $('#' + intId + '').html('♥');

    //alert(" initFind() 前");
    //initFind();
    //alert(" initFind() 後");
}

// 從 WISHLIST 移除
function removeFavoriteTrip(intId) {
    var strAddFavoriteTripUrl = "/trip/removeFavoriteTrip?intTripId=" + intId;
    $.getJSON(strAddFavoriteTripUrl, function(jsonResp) {
        var status = jsonResp["delete_favorite_trip_status"];
        console.log("remove success");
    });

    // $('#'+intId+'').hide();

    //alert(" initWishList() 前");
    //initWishList();
    //alert(" initWishList() 後");
    //window.location.reload();
}

// 加至wishlist按鈕點擊
function addToWishlistBtnClick() {
    $(".add_wish_btn").click(function(event) {
        var timer,
            tarId = $(this).data('id');
        clearInterval(timer);
        if ($(this).hasClass('active')) {
            removeFavoriteTrip(tarId);
            $(this).removeClass('active');
        } else {
            addFavoriteTrip(tarId);
            $(this).addClass('active');
            $("#addToFolderBlk").css({
                bottom: '10px',
            });
            timer = setTimeout(function() {
                $("#addToFolderBlk").css({
                    bottom: '-200px',
                });
            }, 5000);
            $("#addToFolderBlk").click(function(event) {
                clearInterval(timer);
                timer = setTimeout(function() {
                    $("#addToFolderBlk").css({
                        bottom: '-200px',
                    });
                }, 5000);
            });
        }
    });
}

// 選單隨畫面下移改變為down樣
function topNavDown(distance) {
    $(window).scroll(function() {
        var top_position = $(window).scrollTop();
        if (top_position > distance) {
            $("#page-top .navbar-custom").addClass('down');
        } else {
            $("#page-top .navbar-custom").removeClass('down');

        }
    });
}

// 取得目標EQ值
function getEqVal(element) {
    var index = element.index();

    return index;
}

//組出單組查詢結果出來的html字串
function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, isFavoriteTrip) {

    var reviewStar = "";
    fillstarQan = intReviewStar;
    emptystarQan = 5 - intReviewStar;
    for (var fillstarCount = 0; fillstarCount < fillstarQan; fillstarCount++) {
        reviewStar += "<span class='icon-star_fill'></span>";
    }
    for (var emptystarCount = 0; emptystarCount < emptystarQan; emptystarCount++) {
        reviewStar += "<span class='icon-star_empty'></span>";
    }
    // @Q@設定文字擷取字數
    var strIntroduction = strIntroduction.substr(0, 75);
    var strTitle = strTitle.substr(0, 25);

    var favoriteTrip;

    if (isFavoriteTrip.toString() == "true") {
        favoriteTrip = " active";
        // favoriteTrip = "<div class=\"favorite\">♥</div>";
    }
    if (isFavoriteTrip.toString() == "false") {
        favoriteTrip = "";
    }
    var strTripDataHtml = [
        "<div class=\"tour\">",
        "<div class=\"card active\" style=\"background-image:url(" + strImageUrl + ");\">",
        "<div class=\"name\">",
        "<p>" + strTitle + "...</p>",
        "</div>",
        "<p class=\"place\">" + strLocation + "</p>",
        "<p class=\"duration\">" + intDurationHour + "<span>HRs</span></p>",
        "<div class=\"price\">",
        "<span class=\"country\">" + strUserCurrency + "</span> $",
        "<span class=\"number\">" + intUserCurrencyCost + "</span>",
        "</div>",
        "<div class=\"star\">" + reviewStar + "</div>",
        "<div class=\"compeople\">- " + intReviewVisitor + " voted -</div>",

        "<div class=\"trimtext\">" + strIntroduction + "...</div>",
        "<div class=\"readmore_btn\">",
        "<a target=\"_blank\" href=" + strOriginUrl + " data-ripple-color=\"#2bb0b9\">Read More</a>",
        "</div>",
        "<div class=\"footprint_blk\">",
        "<span class=\"icon-tourdash footprint\"></span>",
        "</div>",
        "<div class=\"add_wish_btn" + favoriteTrip + "\" data-id=\"" + intId + "\">",
        "<p class=\"oriword\">Add To WishList</p>",
        "<span class=\"icon-wishlist\"></span>",
        "<p class=\"actword\">My Wishlist</p>",
        "<span class=\"icon-quill\"></span>",
        "<span class=\"extend_line\"></span>",
        "</div>",
        "<div class=\"darken_bg\"></div>",
        "</div>",
        "</div>"
    ].join("");

    return strTripDataHtml;
};

// ripple按鈕效果啟動 
function initRippleBtn() {
    $('.ripple').on('click', function(event) {
        event.preventDefault();

        var $div = $('<div/>'),
            btnOffset = $(this).offset(),
            xPos = event.pageX - btnOffset.left,
            yPos = event.pageY - btnOffset.top;



        $div.addClass('ripple-effect');
        var $ripple = $(".ripple-effect");

        $ripple.css("height", $(this).height());
        $ripple.css("width", $(this).height());
        $div
            .css({
                top: yPos - ($ripple.height() / 2),
                left: xPos - ($ripple.width() / 2),
                background: $(this).data("ripple-color"),
            })
            .appendTo($(this));

        window.setTimeout(function() {
            $div.remove();
        }, 2000);
    });
}

// 多選單選項點擊 
function multiSelClick(oriText) {
    $(".multi_sel_btn>.menu>li").click(function(event) {
        $(this).toggleClass('active');
        multiSelValSet($(this).parent('.menu').parent('.multi_sel_btn'), oriText);
    });
    $(".multi_sel_btn").click(function(event) {
        if (!event.target.matches(".multi_sel_btn>.menu>.clear_btn")) {
            $(".multi_sel_btn").children('.menu').removeClass('active');
            $(this).children('.menu').addClass('active');
        }
    });
    $(".multi_sel_btn>.menu>.clear_btn").click(function(event) {
        $(this).parent('.menu').children('li').removeClass('active');
        multiSelValSet($(this).parent('.menu').parent('.multi_sel_btn'), oriText);
        $(this).parent('.menu').removeClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".multi_sel_btn") && !event.target.matches(".multi_sel_btn *")) {
            $(".multi_sel_btn > .menu").removeClass('active');
        }
    });
}

// 多選單選項點擊後內容調整 
function multiSelValSet(selBlk, oriText) {
    var selVal = "";
    var tarLi = selBlk.children('.menu').children('li');
    for (var liAciveCheckNum = 0; tarLi.eq(liAciveCheckNum).length > 0; liAciveCheckNum++) {
        if (tarLi.eq(liAciveCheckNum).hasClass('active')) {
            if (selVal == "") {
                selVal += tarLi.eq(liAciveCheckNum).children('span').html();
            } else {
                selVal += ", " + tarLi.eq(liAciveCheckNum).children('span').html();
            }
        }
    }
    if (selVal == "") {
        selBlk.children('.value').html(oriText);
    } else {
        selBlk.children('.value').html(selVal);
    }
}

// 加減選單點擊 
function plusBtnClcik(oriText) {

    $(".plus_click_btn .icon-minus_round").click(function(event) {
        var valBlk = $(this).parent().children('.value');
        if (valBlk.html() == oriText) {} else {
            var valBlkVal = valBlk.html();
            valBlkVal--;
            if (valBlkVal == 0) {
                valBlk.html(oriText);
            } else {
                valBlk.html(valBlkVal);
            }
        }
    });
    $(".plus_click_btn .icon-plus_round").click(function(event) {
        var valBlk = $(this).parent().children('.value');
        if (valBlk.html() == oriText) {
            valBlk.html("1");
        } else {
            var valBlkVal = valBlk.html();
            valBlkVal++;
            valBlk.html(valBlkVal);
        }
    });
}

// 單選按鈕點擊 
function singleSelClick(oriText) {

    $(".single_sel_btn>.menu>li").click(function(event) {
        $(".single_sel_btn>.menu>li").removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().children('.value').html($(this).html());
        $(this).parent('.menu').removeClass('active');
    });
    $(".single_sel_btn>.menu>.clear_btn").click(function(event) {
        $(".single_sel_btn>.menu>li").removeClass('active');
        $(this).parent().parent().parent().children('.single_sel_btn').children('.value').html(oriText);
        $(this).parent('.menu').removeClass('active');
    });
    $(".single_sel_btn").click(function(event) {
        if (!event.target.matches(".single_sel_btn>.menu>.clear_btn") && !event.target.matches(".single_sel_btn>.menu>li")) {
            $(".single_sel_btn").children('.menu').removeClass('active');
            $(this).children('.menu').addClass('active');
        }
    });
    $(window).click(function() {
        if (!event.target.matches(".single_sel_btn") && !event.target.matches(".single_sel_btn *")) {
            $(".single_sel_btn > .menu").removeClass('active');
        }
    });

}

//幣別
function initCurrencySelect() {
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

        $.getJSON(strChangeUserCurrencyUrl, function(jsonResp) {
            strUserCurrency = jsonResp["strUserCurrency"];
            console.log("switch user currency to: " + strUserCurrency);
        });
    });

};

//幣別
function homeInitCurrencySelect() {
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
        homeRecomTour();
        $.getJSON(strChangeUserCurrencyUrl, function(jsonResp) {
            strUserCurrency = jsonResp["strUserCurrency"];
            console.log("switch user currency to: " + strUserCurrency);
        });
    });

};

// 虛線產生 
function dashLineGenerate(totalWidth, dashWidth, dashHeight, dashSpace, dashColor, tar) {
    var htmlCon = "";
    var dashHtml = "<div style=\"width: " + dashWidth + "px;height: " + dashHeight + "px;background-color: " + dashColor + ";float: left;\"></div>";
    var spaceHtml = "<div style=\"width: " + dashSpace + "px;height: " + dashHeight + "px;float: left;\"></div>";
    var totalLength = 0;
    for (var totalLength = dashWidth + dashSpace; totalLength < totalWidth; totalLength += dashWidth + dashSpace) {
        htmlCon += dashHtml + spaceHtml;
    }
    tar.html(htmlCon);
}

// 選單搜尋 ENTER 
function headerSearch(tour) {
    if (typeof tour.sendData.keyword == 'undefined') {
        var headInput = ($('#topSearch')).val();
        location.href = '/page/find?keyword=' + headInput + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
    } else {
        location.href = '/page/find?keyword=' + tour.sendData.keyword + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
    }
}

// 首頁推薦旅程動態
// 出現
function homeRecShow(ingNum) {

    var jsDetectWidth = $(window).width();
    if (jsDetectWidth > 1049) {

        $(".home_tour_blk .hometour").hide();
        var tarNum = ingNum + 3;
        for (var i = ingNum; i < tarNum; i++) {
            $(".home_tour_blk .hometour").eq(i).css({
                'left': i % 3 * 33.333333333 + "%",
                'display': 'block',
            });
            $(".home_tour_blk .hometour").eq(i).delay(i % 3 * 200).queue(function(next) {
                $(this).addClass('active');
                next();
            });
        }
    } else if (jsDetectWidth > 767) {

        $(".home_tour_blk .hometour").hide();
        var tarNum = ingNum + 2;
        for (var i = ingNum; i < tarNum; i++) {
            $(".home_tour_blk .hometour").eq(i).css({
                'left': i % 2 * 50 + "%",
                'display': 'block',
            });
            $(".home_tour_blk .hometour").eq(i).delay(i % 2 * 200).queue(function(next) {
                $(this).addClass('active');
                next();
            });
        }
    } else {

        $(".home_tour_blk .hometour").hide();
        var tarNum = ingNum + 1;
        for (var i = ingNum; i < tarNum; i++) {
            $(".home_tour_blk .hometour").eq(i).css({
                'left': "initial",
                'display': 'block',
            });
            $(".home_tour_blk .hometour").eq(i).delay(200).queue(function(next) {
                $(this).addClass('active');
                next();
            });
        }

    }

}

// 隱藏
function homeRecHide(ingNum) {
    var jsDetectWidth = $(window).width();
    if (jsDetectWidth > 991) {
        var tarNum = ingNum + 3;
        for (var i = ingNum; i < tarNum; i++) {
            $(".home_tour_blk .hometour").eq(i).delay(i % 3 * 200).queue(function(next) {
                $(this).addClass('away');
                next();
                $(this).delay(1000).queue(function(next) {
                    $(this).removeClass('active');
                    $(this).removeClass('away');
                    next();
                });
            });
        }
    } else if (jsDetectWidth > 767) {
        var tarNum = ingNum + 2;
        for (var i = ingNum; i < tarNum; i++) {
            $(".home_tour_blk .hometour").eq(i).delay(i % 2 * 200).queue(function(next) {
                $(this).addClass('away');
                next();
                $(this).delay(1000).queue(function(next) {
                    $(this).removeClass('active');
                    $(this).removeClass('away');
                    next();
                });
            });
        }
    } else {
        var tarNum = ingNum + 1;
        for (var i = ingNum; i < tarNum; i++) {
            $(".home_tour_blk .hometour").eq(i).delay(200).queue(function(next) {
                $(this).addClass('away');
                next();
                $(this).delay(1000).queue(function(next) {
                    $(this).removeClass('active');
                    $(this).removeClass('away');
                    next();
                });
            });
        }

    }

}

// 客製單選按鈕點擊 
function cusSingleSelClick(tar, oriText) {
    $(tar + ">.menu>li").off();
    $(tar + ">.menu>li").click(function(event) {
        $(tar + ">.menu>li").removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().children('.value').html($(this).html());
        $(this).parent('.menu').removeClass('active');
    });

    $(tar + ">.menu>.clear_btn").off();
    $(tar + ">.menu>.clear_btn").click(function(event) {
        $(tar + ">.menu>li").removeClass('active');
        $(this).parent().parent().parent().children(tar).children('.value').html(oriText);
        $(this).parent('.menu').removeClass('active');
    });

    $(tar).off();
    $(tar).click(function(event) {
        if (!event.target.matches(tar + ">.menu>.clear_btn") && !event.target.matches(tar + ">.menu>li")) {
            $(tar).children('.menu').removeClass('active');
            $(this).children('.menu').addClass('active');
        }
    });

    $(window).click(function() {
        if (!event.target.matches(tar) && !event.target.matches(tar + " *")) {
            $(tar + " > .menu").removeClass('active');
        }
    });
}

//首頁推薦tour資料抓取
function homeRecommedTourGet() {
    //設定目前幣別
    var strRecommedTourUrl = "/trip/recommended";
    $.getJSON(strRecommedTourUrl, function(jsonResp) {
        strRecommedTour = jsonResp["trip"];
        console.log(strRecommedTour);
    });
};

// 頁碼輸入 
function pageNumberType(idName) {
    var pageBlkid = idName,
        ingPage = 1,
        minPage = 1,
        maxPage = 0;
    $("#" + idName).focusin(function(event) {
        ingPage = $(this).val();
        $(this).val("");
        maxPage = parseInt($("#final_page_link").html());
    });
    $("#" + idName).focusout(function(event) {
        $("#" + idName).val(ingPage);
    });
    $("#" + idName).keypress(function(e) {
        var key = e.which;
        var tarPage = $(this).val();
        if (key == 13) {
            if (parseInt(tarPage, 10) == tarPage && tarPage >= minPage && ingPage != tarPage) {
                if (isNaN(maxPage) || tarPage <= maxPage) {
                    ingPage = tarPage;
                    $(this).val(tarPage);
                    $(this).blur();
                    search('');
                }
            }
        }
    });
}

// 個人設定點選 
function personelSetClick(setBtn, menu, nameBtn, nameBlk, inputBlk) {
    var tarBtn = $(setBtn),
        tarClassChanger = tarBtn.parent().children(menu);
    tarBtn.click(function(event) {
        tarClassChanger.addClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(setBtn)) {
            tarClassChanger.removeClass('active');
        }
    });

    // edit name 確定按鈕點選 @TODO 點選後資料傳至後端
    $(nameBtn).click(function(event) {
        $(inputBlk).show();
    });
    $(inputBlk + ">.blur_bg").click(function(event) {
        $(inputBlk).hide();
    });
    $(inputBlk + ">.content_blk>.close_btn").click(function(event) {
        $(inputBlk).hide();
    });
    $(inputBlk + ">.content_blk>.confirm_btn").click(function(event) {
        var tar = $(inputBlk + ">.content_blk>input");
        if (tar.val() != "" && tar.val() != null) {
            $(nameBlk).html(tar.val());
            $(inputBlk).hide();
            tar.val("");
        }
    });
}

// MORE 按鈕 點擊
function folderMoreClick() {
    $(".folder>.card>.text_blk>.more_btn").click(function(event) {
        $(".folder_blk > .folders > .inner_blk > .folder > .menu").removeClass('active');
        $(this).parent().parent().parent().children('.menu').addClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".folder>.card>.text_blk>.more_btn")) {
            $(".folder>.menu").removeClass('active');
        }
    });
}

// 加入資料夾點擊  @TODO假的 需要連上真實資料
function addToFolderClick() {
    $(".folder_sel_btn").click(function(event) {

        $(".wish>.menu").removeClass('active');
        $(this).parent().parent().children('.menu').addClass('active');
    });
    $(".wish>.menu>li").click(function(event) {
        $(this).toggleClass('active');
    });

    $(window).click(function() {
        if (!event.target.matches(".folder_sel_btn") && !event.target.matches(".folder_sel_btn *") && !event.target.matches(".wish>.menu") && !event.target.matches(".wish>.menu *")) {
            $(".wish>.menu").removeClass('active');
        }
    });
}

// 新增分類點選
function addNewFolderClick() {
    $("#addNewFolder").click(function(event) {
        $(".add_folder_blk").show();
    });
    $(".add_folder_blk>.blur_bg").click(function(event) {
        $(".add_folder_blk").hide();
    });
    $(".add_folder_blk>.content_blk>.close_btn").click(function(event) {
        $(".add_folder_blk").hide();
    });
    $(".add_folder_blk>.content_blk>.confirm_btn").click(function(event) {
        var tar = $(".add_folder_blk>.content_blk>input");
        if (tar.val() != "" && tar.val() != null) {
            $(".add_folder_blk").hide();
            var pic1Url = "",
                pic2Url = "",
                pic3Url = "",
                folderName = "",
                tourNum = 0,
                folderContainer = $(".folders>.inner_blk");
            newFoldCon = FolderHtml(pic1Url, pic2Url, pic3Url, folderName, tourNum);
            folderContainer.append(newFoldCon);
            tar.val("");

            // folder 設定點選
            folderMoreClick();
            renameFolderClick();
            folderClick();
        }
    });
}

// tour分類資料夾HTML
function FolderHtml(pic1Url, pic2Url, pic3Url, folderName, tourNum) {
    var empty = false;
    var picHtmlCon = "";

    if (pic1Url == "" && pic2Url == "" && pic3Url == "") {
        empty = true;
    }

    if (empty) {
        picHtmlCon = [
            "<div class=\"empty\">",
            "<p class=\"big_text\">Oops ! </p>",
            "<p class=\"text\">This Folder is Empty.</p>",
            "</div>",
        ].join("");
    } else {
        picHtmlCon = [
            "<div class=\"pic_1\" style=\"background-image: url(" + pic1Url + ");\"></div>",
            "<div class=\"pic_2\" style=\"background-image: url(" + pic2Url + ");\"></div>",
            "<div class=\"pic_3\" style=\"background-image: url(" + pic3Url + ");\"></div>",
        ].join("");
    }

    var newFolderCon = [
        "<div class=\"folder\">",
        "<div class=\"card\">",
        "<div class=\"pic_blk\">" + picHtmlCon + "</div>",
        "<div class=\"text_blk\">",
        "<div class=\"folder_name\">" + folderName + "</div>",
        "<div class=\"tour_text\">Tour</div>",
        "<div class=\"tour_qua\">" + tourNum + "</div>",
        "<span class=\"more_btn icon-more_btn\"></span>",
        "</div>",
        "</div>",
        "<ul class=\"menu\">",
        "<li class=\"rename_folder_btn\">Rename Folder</li>",
        "<li>Remove Folder</li>",
        "</ul>",
        "</div>",
    ].join("");

    return newFolderCon;
}

// 分類重新命名點選 @TODO 目前先用EQ來紀錄欲設定之資料夾，還要補上改變猴連結資料庫
function renameFolderClick() {

    $(".rename_folder_btn").click(function(event) {
        $(".rename_folder_blk").show();
        var tarFoldEq = $(this).parent().parent().index('.folder');
        $(".ing_folder_blk").attr('data-ingfoldEq', tarFoldEq);
    });
    $(".rename_folder_blk>.blur_bg").click(function(event) {
        $(".rename_folder_blk").hide();
    });
    $(".rename_folder_blk>.content_blk>.close_btn").click(function(event) {
        $(".rename_folder_blk").hide();
    });
    $(".rename_folder_blk>.content_blk>.confirm_btn").click(function(event) {
        var tar = $(".rename_folder_blk>.content_blk>input");
        var tarEq = $(".ing_folder_blk").attr('data-ingfoldEq');
        if (tar.val() != "" && tar.val() != null) {
            $(".folder").eq(tarEq).children('.card').children('.text_blk').children('.folder_name').html(tar.val());
            $(".ing_folder_blk>.ing_folder>.name").html(tar.val());
            $(".rename_folder_blk").hide();

            tar.val("");
        }
    });
}

// 目前分類點擊
function ingFolderClick() {

    var actBtn = ".ing_folder_more_btn",
        menu = ".ing_folder_more_blk>.menu";

    $(actBtn).click(function(event) {
        $(this).parent(".ing_folder_more_blk").children('.menu').addClass('active');
    });

    $(window).click(function() {
        if (!event.target.matches(actBtn)) {
            $(menu).removeClass('active');
        }
    });
    $(".rename_ingfolder_btn").click(function(event) {
        $(".rename_folder_blk").show();
    });

    $(".ing_folder_blk>.back_btn").click(function(event) {
        $(".ing_folder_blk").hide();
        $(".folders").show();
        $(".folder_blk>.dashed_line").show();
    });
    $(".ing_folder_blk>.ing_folder>.ing_back_text").click(function(event) {
        $(".ing_folder_blk").hide();
        $(".folders").show();
        $(".folder_blk>.dashed_line").show();
    });
}

// 分類資料夾點擊 @TODO 後端資料建立後要抓後端分類內的TOUR
function folderClick() {
    $(".folder>.card").off();
    $(".folder>.card").click(function(event) {
        if (!event.target.matches(".folder>.card>.text_blk>.more_btn")) {

            var tarName = $(this).children('.text_blk').children('.folder_name').html(),
                tarEq = $(this).parent().index('.folder');
            $(".ing_folder_blk").attr('data-ingfoldEq', tarEq);
            $(".ing_folder_blk>.ing_folder>.name").html(tarName);
            $(".folders").hide();
            $(".folder_blk>.dashed_line").hide();
            $(".ing_folder_blk").show();
        }
    });
}

// 切拉欄位狀態切換
function shortScrollToggle(tar, maxHeight) {
    var totalH = 0,
        tarOb = document.getElementById(tar);
    if (tarOb.scrollHeight > maxHeight) {
        $("#" + tar).removeClass('short');
    } else {
        $("#" + tar).addClass('short');
    }
    $("#" + tar).bind('DOMSubtreeModified', function() {
        totalH = 0;
        if (tarOb.scrollHeight > maxHeight) {
            $(this).removeClass('short');
        } else {
            $(this).addClass('short');
        }
    });
}

// 編輯詳情
function editDetailShow() {
    $(".infoin.put").mouseover(function() {
        detailRefresh($(this));

        $(".infoin.put").removeClass('open');
        $(this).addClass('open');
    });
    $("body").mousemove(function(event) {
        if (!event.target.matches("#tourDetailBlk") && !event.target.matches("#tourDetailBlk *") && !event.target.matches(".infoin.put") && !event.target.matches(".infoin.put *") && !event.target.matches(".pac-container") && !event.target.matches(".pac-container *")) {
            $("#tourDetailBlk").hide();
            $(".infoin.put").removeClass('open');
        }
    });
}

// 詳情更新
function detailRefresh(tarInfo) {
    var tarOb = $("#tourDetailBlk");
    tarTop = tarInfo.offset().top,
        limitTop = $("#momentPutBlk").offset().top,
        name = tarInfo.children('.info').children('.name').html(),
        place = tarInfo.children('.info').children('.place').children('.content').html(),
        note = tarInfo.children('.info').children('.note').children('.content').html(),
        hr = tarInfo.data('hr'),
        price = tarInfo.data('price'),
        locate = tarInfo.attr('data-locate'),
        link = tarInfo.data('link');
    //qqq

    tarOb.children('.title').html(name);
    tarOb.children('.place').html(place);
    tarOb.children('.hr').children('.text').children('.number').html(hr);
    tarOb.children('.price').children('.text').html(price);
    tarOb.children('.note_blk').children('.note').val(note);
    tarOb.children('.address_blk').children('.address_type').val(locate);
    tarOb.children('.read_more_btn').attr("href", link);
    if (limitTop < tarTop) {
        tarOb.css({
            top: tarTop,
        });
    } else {
        tarOb.css({
            top: limitTop,
        });
    }
    $("#tourDetailBlk").show();
}

// 選單搜尋地點
function initTopSearch() {
    var tour = {};
    tour.sendData = {};
    var input = (document.getElementById('topSearch'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {

        var place = autocomplete.getPlace();
        if (!place.geometry) {
            //未獲得地點資訊
            return;
        }
        tour.sendData = {
            keyword: document.getElementById('topSearch').value,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
        // 選單搜尋 ENTER @Q@ davidturtle

        headerSearch(tour);
    });

    $('#topSearch').keypress(function(e) {
        var key = e.which;
        var tarPlace = $(this).val();
        if (key == 13) {
            headerSearch(tour);
        }
    });
}

// 抓取網址
function getUrlValue() {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i,
        x = [];

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        x[sParameterName[0]] = sParameterName[1];
    }
    return x;
}

// 建立地圖標示
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

// PAD 選單 初始化
function padMenuAct() {
    $("#padMenuBtn").click(function(event) {
        $("#padMenu").addClass('active');
        $(".toolbox_blk").removeClass('active');
    });
    $("#padMenu>.close_btn").click(function(event) {
        $("#padMenu").removeClass('active');
    });
}

// 朋友移除
function friendRemoveClick() {
    $(".friend>.inner_blk>.setting_blk>.menu>.un_btn").click(function(event) {
        var tar = $(this).parent().parent().parent().parent();
        tar.addClass('hide');
        $(".unfriend_blk").show();

        $("#confirm").off();
        $("#confirm").click(function(event) {
            $(".unfriend_blk").hide();
        });
        $("#recover").off();
        $("#recover").click(function(event) {
            tar.removeClass('hide');
            $(".unfriend_blk").hide();
        });
    });
}

// MOBILE 選單 點擊
function mobileMenuClick() {
    $("#mobileMenuBtn").click(function(event) {
        $("#mainNav").toggleClass('active');
        $(".toolbox_blk").removeClass('active');
    });
}

// TOOLBOX 點擊
function toolboxClick() {
    $(".toolbox_btn").click(function(event) {
        $(".toolbox_blk").toggleClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".toolbox_btn") && !event.target.matches(".toolbox_btn *")) {
            $(".toolbox_blk").removeClass('active');
        }
    });
}

// 頭像點擊
function headBtnClick() {
    $("#headBtn").click(function(event) {
        $(this).children('.head_menu').toggleClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches("#headBtn")) {

            $("#headBtn").children('.head_menu').removeClass('active');

        }
    });
}

// 通知止滑
function notiBlkPrevent() {
    $('.noti_blk').on('mousewheel DOMMouseScroll', function(e) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });
}

// 搜尋欄位止滑
function findBlkPrevent() {
    $('#page-top .find .intro-text .searchContent .row').on('mousewheel DOMMouseScroll', function(e) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });
}

// 止滑
function scrollPrevent(tarBlk) {
    $(tarBlk).on('mousewheel DOMMouseScroll', function(e) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });
}

// DATE轉換
function parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
}

// DATE轉換
function daydiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

// 靜態地圖產生
function staticMapUrlGenerate(lat, lng, zoomScale) {
    var tarUrl = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyC2tc4aDgzf5dJHMouGgbFT7cbvDBV5zP4&center=" + lat + "," + lng + "&zoom=" + zoomScale + "&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xebe3cd&style=element:labels%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x523735&style=element:labels.text.stroke%7Ccolor:0xf5f1e6&style=feature:administrative%7Celement:geometry.stroke%7Ccolor:0xc9b2a6&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:geometry.stroke%7Ccolor:0xdcd2be&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xae9e90&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x93817c&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0xa5b076&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x447530&style=feature:road%7Celement:geometry%7Ccolor:0xf5f1e6&style=feature:road.arterial%7Celement:geometry%7Ccolor:0xfdfcf8&style=feature:road.highway%7Celement:geometry%7Ccolor:0xf8c967&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0xe9bc62&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0xe98d58&style=feature:road.highway.controlled_access%7Celement:geometry.stroke%7Ccolor:0xdb8555&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x806b63&style=feature:transit.line%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:transit.line%7Celement:labels.text.fill%7Ccolor:0x8f7d77&style=feature:transit.line%7Celement:labels.text.stroke%7Ccolor:0xebe3cd&style=feature:transit.station%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:water%7Celement:geometry.fill%7Ccolor:0xb9d3c2&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x92998d&size=700x700";
    return tarUrl;
}

// DATE格式轉換
function dateToFullYear(date){
    var dateArray = date.split('/');
    var dateFullYear = [parseInt(dateArray[2]),parseInt(dateArray[0]),parseInt(dateArray[1])].join('.');
    return dateFullYear;
}

// 得到下一天的DATE格式
function getNextFullYear(fullYearDate, toDays){
    var date = new Date();
    var parts = fullYearDate.split('.');
    date.setFullYear(parts[0], parts[1]-1, parts[2]); // year, month (0-based), day
    date.setTime(date.getTime() + toDays*86400000);

    var nextFullYear = date.getFullYear() +"."+ (date.getMonth() + 1) +"."+ date.getDate();
    return nextFullYear;
}