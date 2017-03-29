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
    var ingId = -1;
    var dirUrl = "/account/getFavoriteTripFolder";
    $.getJSON(dirUrl, function(jsonResp) {
        var dirArr = jsonResp.lstStrFavoriteTripFolder;
        var dirqua = dirArr.length;

        $(".add_wish_btn").click(function(event) {

            if (strEmail == "None") {
                window.location = "/account/login";
            } else {
                var tarId = $(this).data('id');
                if ($(this).hasClass('active')) {
                    removeFavoriteTrip(tarId);
                    $(this).removeClass('active');

                    $("#TripDataBlk").finish();
                    $("#addToFolderBlk").removeClass('active');
                } else {
                    ingId = tarId;
                    addFavoriteTrip(tarId);
                    $(this).addClass('active');
                    $("#TripDataBlk").finish();
                    $("#addToFolderBlk").addClass('active');
                    $("#TripDataBlk").delay(5000).queue(function(next) {
                        $("#addToFolderBlk").removeClass('active');
                        next();
                    });
                    var tarLi = $("#addToFolderBlk>.info>.multi_sel_btn>.menu>li");
                    console.log(tarId);

                    tarLi.removeClass('active');
                    tarLi.off();
                    tarLi.click(function(event) {
                        $("#TripDataBlk").finish();
                        $("#addToFolderBlk").addClass('active');
                        $("#TripDataBlk").delay(5000).queue(function(next) {
                            $("#addToFolderBlk").removeClass('active');
                            next();
                        });
                        $(this).toggleClass('active');
                        if ($(this).hasClass('active')) {
                            var favoUrl = "/trip/addFavoriteTrip?intTripId=" + ingId + "&add_folder=" + $(this).children('span').html();
                        } else {
                            var favoUrl = "/trip/addFavoriteTrip?intTripId=" + ingId + "&remove_folder=" + $(this).children('span').html();
                        }
                        $.getJSON(favoUrl, function(jsonResp) {
                            console.log("add or remove success");
                        });

                    });

                }
            }

        });
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
    console.log(strTitle.length);
    if (strTitle.length > 60) {
        var strTitle = strTitle.substr(0, 60)+"...";
    }

    var favoriteTrip;

    if (isFavoriteTrip.toString() == "true") {
        favoriteTrip = " active";
        // favoriteTrip = "<div class=\"favorite\">♥</div>";
    }
    if (isFavoriteTrip.toString() == "false") {
        favoriteTrip = "";
    }


    var strIntDurationHour;
    if (intDurationHour.toString().trim() == "1") {
        strIntDurationHour = "<p class=\"duration\">" + intDurationHour + "<span>HR</span></p>";
    } else {
        strIntDurationHour = "<p class=\"duration\">" + intDurationHour + "<span>HRs</span></p>";
    }


    var strTripDataHtml = [
        "<div class=\"tour\">",
        "<div class=\"card active\" style=\"background-image:url(" + strImageUrl + ");\">",
        "<div class=\"name\">",
        "<p>" + strTitle + "</p>",
        "</div>",
        "<p class=\"place\">" + strLocation + "</p>",
        strIntDurationHour,
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
    $(".currency_sel_blk").hide();
    //設定目前幣別
    var strUserCurrencyUrl = "/trip/userCurrency";
    $.getJSON(strUserCurrencyUrl, function(jsonResp) {
        strUserCurrency = jsonResp["strUserCurrency"];
        $("#moneySelect").val(strUserCurrency);
        $("#moneySelect").selectpicker("refresh")
        console.log("init user currency selection: " + strUserCurrency);
        $(".currency_sel_blk").show();
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

    $(".currency_sel_blk").hide();
    //設定目前幣別
    var strUserCurrencyUrl = "/trip/userCurrency";
    $.getJSON(strUserCurrencyUrl, function(jsonResp) {
        strUserCurrency = jsonResp["strUserCurrency"];
        $("#moneySelect").val(strUserCurrency);
        $("#moneySelect").selectpicker("refresh")
        console.log("init user currency selection: " + strUserCurrency);
        $(".currency_sel_blk").show();
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

// Wishlist MORE 按鈕 點擊
function wishMoreClick() {
    $(".wish>.more_blk>.more_btn").click(function(event) {
        $(".wish>.more_blk>.more_btn").removeClass('active');
        $(this).parent().children('.more_menu').addClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".wish>.more_blk>.more_btn")) {
            $(".wish>.more_blk>.more_menu").removeClass('active');
        }
    });
}

function wishFolderRenew(tarWish) {
    var tarId = parseInt(tarWish.attr('data-id'));
    var tarLi = tarWish.children('.menu').children('li');
    var folders = [];
    for (var i = 0; tarLi.eq(i).length > 0; i++) {
        if (tarLi.eq(i).hasClass('active')) {
            folders.push(tarLi.eq(i).children('span').html());
        }
    }
    console.log(folders);
}

function wishAddFolder(wishId, folderName) {
    var wishAddFolderUrl = "/trip/addFavoriteTrip?intTripId=" + wishId + "&add_folder=" + folderName;

    $.getJSON(wishAddFolderUrl, function(jsonResp) {

        console.log("add access");

    });
}

function wishRemoveFolder(wishId, folderName) {
    var wishRemoveFolderUrl = "/trip/addFavoriteTrip?intTripId=" + wishId + "&remove_folder=" + folderName;

    $.getJSON(wishRemoveFolderUrl, function(jsonResp) {

        console.log("remove access");

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
        var wishId = $(this).parent().parent().attr('data-id');
        var folderName = $(this).children('span').html();
        if ($(this).hasClass('active')) {
            wishAddFolder(wishId, folderName);
            folderTourQumRenew(folderName, 1);
        } else {
            wishRemoveFolder(wishId, folderName);
            folderTourQumRenew(folderName, -1);
        }
    });

    $(window).click(function() {
        if (!event.target.matches(".folder_sel_btn") && !event.target.matches(".folder_sel_btn *") && !event.target.matches(".wish>.menu") && !event.target.matches(".wish>.menu *")) {
            $(".wish>.menu").removeClass('active');
        }
    });
}


function folderTourQumRenew(folderName, change) {
    var tarFolder = getWishFolderByName(folderName);
    console.log(tarFolder);
    var tourQumBlk = tarFolder.children('.card').children('.text_blk').children('.tour_qua');
    var ingQum = parseInt(tourQumBlk.html());
    var tarQum = ingQum + change;
    tourQumBlk.html(tarQum);
}

function getWishFolderByName(folderName) {
    console.log(folderName);
    var tarEq = -1;
    for (var i = 0; $(".folder").eq(i).length > 0; i++) {
        console.log($(".folder").eq(i).children('.card').children('.text_blk').children('.folder_name').html());
        if ($(".folder").eq(i).children('.card').children('.text_blk').children('.folder_name').html() == folderName) {
            tarEq = i;
        }
    }
    console.log(tarEq);
    if (tarEq >= 0) {
        return $(".folder").eq(tarEq);
    }
}

// 新增PLAN點選
function addNewPlanClick() {
    $("#addNewPlan").click(function(event) {
        $(".add_plan_blk").show();
    });
    $(".add_plan_blk>.blur_bg").click(function(event) {
        $(".add_plan_blk").hide();
    });
    $(".add_plan_blk>.content_blk>.close_btn").click(function(event) {
        $(".add_plan_blk").hide();
    });
    $(".add_plan_blk>.content_blk>.confirm_btn").click(function(event) {
        var tar = $(".add_plan_blk>.content_blk>input");
        if (tar.val() != "" && tar.val() != null) {

            $(".add_plan_blk").hide();

            $("body").addClass('waiting_body');
            $(".waiting_fullblk").show();

            var planDate = new Date();
            planDate = oriDateToDashed(planDate);
            var imgUrl = "/static/img/empty_plan.png";
            var addNewPlanUrl = "/trip/addTripPlan?strPlanName=" + tar.val() + "&strImageUrl=" + imgUrl + "&strDatetimeFrom=" + planDate + "&strDatetimeTo=" + planDate;


            $.post("/trip/addTripPlan", { csrfmiddlewaretoken: strCsrfToken, strPlanName: tar.val(), strImageUrl: imgUrl, strDatetimeFrom: planDate, strDatetimeTo: planDate })
                .done(function() {
                    console.log("success");
                    planListRefresh();

                    tar.val("");
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

            // $.ajax({
            //     url: "/trip/addTripPlan",
            //     type: 'POST',
            //     dataType: 'json',
            //     data: {
            //         strPlanName: tar.val(),
            //         strImageUrl: imgUrl,
            //         strDatetimeFrom: planDate,
            //         strDatetimeTo: planDate,
            //     },
            // })
            // .done(function() {
            //     console.log("success");

            // })
            // .fail(function() {
            //     console.log("error");
            // })
            // .always(function() {
            //     console.log("complete");
            // });

            // $.getJSON(addNewPlanUrl, function(jsonResp) {

            //     planListRefresh();

            //     tar.val("");
            // });
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

            $("body").addClass('waiting_body');
            $(".waiting_fullblk").show();
            var addNewFolderUrl = "/account/addFavoriteTripFolder?folder=" + tar.val();
            $.getJSON(addNewFolderUrl, function(jsonResp) {

                wishPageRenew();

                tar.val("");
            });
        }
    });
}

function wishPageRenew(wishFolderPick) {
    // 舊資料清空
    $(".folder").replaceWith("");
    $(".wish_blk > .wish").replaceWith("");
    // 取得資料夾
    var getFoldersUrl = "/account/getFavoriteTripFolder";
    $.getJSON(getFoldersUrl, function(jsonResp) {
        var folders = jsonResp.lstStrFavoriteTripFolder;

        var folderJson = [];
        var folderJsonNum = 0;

        for (var i = 0; i < folders.length; i++) {
            if (folders[i] != "default_folder") {
                folderJson[folderJsonNum] = [];
                folderJson[folderJsonNum].name = folders[i];
                folderJsonNum++;
            }
        }

        // 取得wishList
        if (wishFolderPick != undefined) {
            var getWishlistsUrl = "/trip/getFavoriteTrip?folder=" + wishFolderPick;
        } else {
            var getWishlistsUrl = "/trip/getFavoriteTrip"
        }
        $.getJSON(getWishlistsUrl, function(jsonResp) {

            var strUserCurrency = $("#moneySelect").val();

            // $("div.userCurrencySpan").html(strUserCurrency);
            //trip data
            var lstDicTripData = jsonResp["trip"];

            $("#wishTopNum").html(lstDicTripData.length);
            $("#innerWishNum").html(lstDicTripData.length);
            $("#innerFolderNum").html(folderJson.length);

            folderJson = renewFolders(folderJson, lstDicTripData);
            // 放入folders資料
            for (var i = 0; i < folderJson.length; i++) {
                var WishFolderCon = getWishFolderCon(folderJson[i]);
                $("#foldersBlk").append(WishFolderCon);
            }

            // 放入wishlist資料
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];

                var WishFolderMenuCon = getWishFolderMenuCon(dicTripData, folderJson);

                var menuCon = "";
                var folderBtnCon = "";

                if (folderJson.length != 0) {
                    menuCon = "<ul class=\"menu\">" + WishFolderMenuCon + "</ul>";
                    folderBtnCon = "<div class=\"folder_sel_btn\"><div class=\"text\">Choose Folders</div><i class=\"icon-dropdown_icon\"></i></div>";
                }

                var strTripDataHtml = getWishHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"], menuCon, folderBtnCon, dicTripData["intId"]);
                $(".wish_blk").append(strTripDataHtml);


                // 加入資料夾點擊 @Q@ davidturtle @TODO假的 需要連上真實資料
            };


            // folder 設定點選
            folderMoreClick();
            renameFolderClick();
            folderClick();

            // ING folder 點選
            ingFolderClick();

            addToFolderClick();

            removeFolderClick();

            removeWishBtnClick();

            // Wishlist MORE 按鈕 點擊
            wishMoreClick();

            // 選單止滑
            scrollPrevent(".wish>.menu");

            // 等待動畫
            $("body").removeClass('waiting_body');
            $(".waiting_fullblk").hide();

        });
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
        "<li class=\"remove_folder_btn\">Remove Folder</li>",
        "</ul>",
        "</div>",
    ].join("");

    return newFolderCon;
}

// 移除FOLDER點選
function removeFolderClick() {
    $(".remove_folder_btn").click(function(event) {

        $("body").addClass('waiting_body');
        $(".waiting_fullblk").show();

        var folderName = $(this).parent().parent().children('.card').children('.text_blk').children('.folder_name').html();

        var removeFolderUrl = "/account/removeFavoriteTripFolder?folder=" + folderName;
        $.getJSON(removeFolderUrl, function(jsonResp) {

            wishPageRenew();
        });
    });
    $("#innerRemoveBtn").click(function(event) {

        $("body").addClass('waiting_body');
        $(".waiting_fullblk").show();

        var folderName = $("#ingFolderName").html();

        var removeFolderUrl = "/account/removeFavoriteTripFolder?folder=" + folderName;
        $.getJSON(removeFolderUrl, function(jsonResp) {

            $(".ing_folder_blk").hide();
            $(".folders").show();
            $(".folder_blk>.dashed_line").show();
            $("#ingFolderName").html("");
            wishPageRenew();
        });
    });
}

function removeWish(wishId, folderPick) {

    $("body").addClass('waiting_body');
    $(".waiting_fullblk").show();

    var removeWishUrl = "/trip/removeFavoriteTrip?intTripId=" + wishId;

    $.getJSON(removeWishUrl, function(jsonResp) {
        if (folderPick != undefined) {
            wishPageRenew(folderPick);
        } else {
            wishPageRenew();
        }
    });
}

function removeWishBtnClick() {
    $(".wish>.more_blk>.more_menu>li.remove_btn").click(function(event) {
        var wishId = $(this).parent().parent().parent().attr('data-id');
        if ($("#ingFolderName").html() != "") {
            removeWish(wishId, folderPick);
        } else {
            removeWish(wishId);
        }
    });
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
        $(".waiting_fullblk").show();
        $("body").addClass('waiting_body');
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

//組出單組查詢結果出來的html字串
function getWishHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, menuCon, folderBtnCon, intId) {

    var strIntroduction = strIntroduction.substr(0, 135);
    var hrText = "HR";
    if (intDurationHour > 1) {
        hrText = "HRs";
    }
    var strTripDataHtml = [
        "<div class=\"wish\" data-id=\"" + intId + "\">",
        "<div class=\"card active\" style=\"background-image:url(" + strImageUrl + ");\">",
        "<div class=\"name\">",
        "<p>" + strTitle + "</p>",
        "</div>",
        "<p class=\"place\">" + strLocation + "</p>",
        "<p class=\"duration\">" + intDurationHour + "<span>" + hrText + "</span></p>",
        "<div class=\"price\">",
        "<span class=\"country\">" + strUserCurrency + "</span> $",
        "<span class=\"number\">" + intUserCurrencyCost + "</span>",
        "</div>",
        "<div class=\"footprint_blk\">",
        "<span class=\"icon-tourdash footprint\"></span>",
        "</div>",
        "<a target=\"_blank\" href=" + strOriginUrl + " class=\"read_more_btn\">Read More</a>",
        folderBtnCon,
        "<div class=\"darken_bg darken\"></div>",
        "</div>",
        menuCon,
        "<div class=\"more_blk\"><div class=\"more_btn icon-more_btn\"></div><ul class=\"more_menu\"><li class=\"remove_btn\">Remove Tour</li></ul></div>",
        "</div>"
    ].join("");

    return strTripDataHtml;
};

// 目前分類點擊
function ingFolderClick() {

    var actBtn = ".ing_folder_more_btn",
        menu = ".ing_folder_more_blk>.menu";
    $(actBtn).off();
    $(actBtn).click(function(event) {
        $(this).parent(".ing_folder_more_blk").children('.menu').addClass('active');
    });

    $(window).click(function() {
        if (!event.target.matches(actBtn)) {
            $(menu).removeClass('active');
        }
    });

    $(".rename_ingfolder_btn").off();
    $(".rename_ingfolder_btn").click(function(event) {
        $(".rename_folder_blk").show();
    });


    $(".ing_folder_blk>.back_btn").off();
    $(".ing_folder_blk>.back_btn").click(function(event) {

        $("body").addClass('waiting_body');
        $(".waiting_fullblk").show();
        $(".ing_folder_blk").hide();
        $(".folders").show();
        $(".folder_blk>.dashed_line").show();
        $("#ingFolderName").html("");
        wishPageRenew();
    });

    $(".ing_folder_blk>.ing_folder>.ing_back_text").off();
    $(".ing_folder_blk>.ing_folder>.ing_back_text").click(function(event) {

        $("body").addClass('waiting_body');
        $(".waiting_fullblk").show();
        $(".ing_folder_blk").hide();
        $(".folders").show();
        $(".folder_blk>.dashed_line").show();
        $("#ingFolderName").html("");
        wishPageRenew();
    });
}

// 分類資料夾點擊
function folderClick() {
    $(".folder>.card").off();
    $(".folder>.card").click(function(event) {
        if (!event.target.matches(".folder>.card>.text_blk>.more_btn")) {

            $("body").addClass('waiting_body');
            $(".waiting_fullblk").show();

            var tarName = $(this).children('.text_blk').children('.folder_name').html(),
                tarEq = $(this).parent().index('.folder');
            $(".ing_folder_blk").attr('data-ingfoldEq', tarEq);
            $(".ing_folder_blk>.ing_folder>.name").html(tarName);
            $(".folders").hide();
            $(".folder_blk>.dashed_line").hide();
            $(".ing_folder_blk").show();
            $("#ingFolderName").html(tarName);

            wishPageRenew(tarName);
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
    $("#topSearch").click(function(event) {
        $(this).addClass('active')

    });
    $(document).click(function(event) {
        if (!event.target.matches("#topSearch") && !event.target.matches("#topSearch *")) {
            $("#topSearch").removeClass('active');
        }
    });

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

    var tarBtn = $(".mini_searchbar>.icon-magnifier");
    tarBtn.click(function(event) {
        if ($("#topSearch").hasClass('active')) {
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

// 初始DATE轉換
function oriDateToDashed(tarDate) {
    var year = tarDate.getFullYear();
    var month = tarDate.getMonth() + 1;
    var day = tarDate.getDate();
    var dasdDate = year + "-" + month + "-" + day + "-00-00";
    return dasdDate;
}

// DATE轉換
function parseDateX(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
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
function dateToFullYear(date) {
    var dateArray = date.split('/');
    var dateFullYear = [parseInt(dateArray[2]), parseInt(dateArray[0]), parseInt(dateArray[1])].join('.');
    return dateFullYear;
}

// DATE 轉換為.格式
function dateToDot(date) {
    var dotA = date.split("-");
    var dot = dotA[0] + "." + dotA[1] + "." + dotA[2];
    return dot;
}

function dateDashToSlash(date) {
    var slashArr = date.split("-");
    var slash = slashArr[1] + "/" + slashArr[2] + "/" + slashArr[0];
    return slash;
}

function dateSlashToDash(date) {
    var dashArr = date.split("/");
    var dash = dashArr[2] + "-" + dashArr[0] + "-" + dashArr[1] + "-00-00";
    return dash;
}

// 得到下一天的DATE格式
function getNextFullYear(fullYearDate, toDays) {
    var date = new Date();
    var parts = fullYearDate.split('.');
    date.setFullYear(parts[0], parts[1] - 1, parts[2]); // year, month (0-based), day
    date.setTime(date.getTime() + toDays * 86400000);

    var nextFullYear = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
    return nextFullYear;
}

function logoutToHome(LogoutBtnName) {
    var strFilterQueryUrl = "/account/logout";

    $(LogoutBtnName).click(function(event) {
        $.getJSON(strFilterQueryUrl, function(jsonResp) {
            window.location = "/";
        });
    });
}

function getWishFolderMenuCon(wish, folderArray) {
    var x = "";
    var wishFloders = wish.lstStrFolderName;
    if (folderArray.length != 0) {

    }
    for (var i = 0; i < folderArray.length; i++) {
        var activeCon = "";
        for (var j = 0; j < wishFloders.length; j++) {
            if (folderArray[i].name == wishFloders[j]) {
                activeCon = "active";
            }
        }
        x += "<li class=\"" + activeCon + "\"><span>" + folderArray[i].name + "</span><i class=\"icon-checkmark\"></i></li>";
    }



    // for (var i = 0; i < wishArray.lstStrFolderName.length; i++) {
    //     if (wishArray.lstStrFolderName[i] != "default_folder") {            
    //         x += "<li><span>" + wishArray.lstStrFolderName[i] + "</span><i class=\"icon-checkmark\"></i></li>";
    //     }
    // }
    return x;
}

function renewFolders(folderArray, wishArray) {

    for (var k = 0; k < folderArray.length; k++) {

        folderArray[k].tourQum = 0;
        folderArray[k].picUrls = [];
        var tarName = folderArray[k].name;
        for (var i = 0; i < wishArray.length; i++) {
            for (var j = 0; j < wishArray[i].lstStrFolderName.length; j++) {
                if (wishArray[i].lstStrFolderName[j] == tarName) {

                    // 取得TOUR數量

                    // 取得前三圖片連結
                    folderArray[k].picUrls[folderArray[k].tourQum] = wishArray[i].strImageUrl;
                    folderArray[k].tourQum++;
                }
            }
        }
    }
    return folderArray;
}

function getWishFolderCon(folder) {

    var picBlkCon = "";
    if (folder.tourQum == 0) {
        picBlkCon = '<div class="empty"><p class="big_text">Oops ! </p><p class="text">This Folder is Empty.</p></div>';
    } else {
        var picBlkConPic1 = '<div class="pic_1" style="background-image: url(' + folder.picUrls[0] + ');"></div>';
        if (folder.picUrls[1] != undefined) {
            var picBlkConPic2 = '<div class="pic_2" style="background-image: url(' + folder.picUrls[1] + ');"></div>';
        } else {
            var picBlkConPic2 = '<div class="pic_2"></div>';
        }
        if (folder.picUrls[2] != undefined) {
            var picBlkConPic3 = '<div class="pic_3" style="background-image: url(' + folder.picUrls[2] + ');"></div>';
        } else {
            var picBlkConPic3 = '<div class="pic_3"></div>';
        }

        picBlkCon = picBlkConPic1 + picBlkConPic2 + picBlkConPic3;
    }
    var x = [
        '<div class="folder">',
        '<div class="card">',
        '<div class="pic_blk">',
        picBlkCon,
        '</div>',
        '<div class="text_blk">',
        '<div class="folder_name">',
        folder.name,
        '</div>',
        '<div class="tour_text">Tour</div>',
        '<div class="tour_qua">',
        folder.tourQum,
        '</div>',
        '<span class="more_btn icon-more_btn"></span>',
        '</div>',
        '</div>',
        '<ul class="menu"><li class="rename_folder_btn">Rename Folder</li><li class="remove_folder_btn">Remove Folder</li></ul>',
        '</div>',
    ].join("");
    return x;
}

function getPlanCon(planId, imgUrl, planName, tourQum, timeFrom, timeTo) {
    var x = [
        '<div class="plan" data-id="' + planId + '">',
        '<div class="card">',
        '<div class="map_blk" style="background-image: url(' + imgUrl + ');"></div>',
        '<div class="name">' + planName + '</div>',
        '<div class="info_blk">',
        '<div class="info tour">',
        '<div class="title">Tour</div>',
        '<div class="content">' + tourQum + '</div>',
        '</div>',
        '<div class="info date">',
        '<div class="title">Date</div>',
        '<div class="content">',
        '<span class="time_from">' + timeFrom + '<span>-',
        '<span class="time_to">' + timeTo + '</span></div>',
        '</div>',
        '<div class="info pals"><div class="title">Pals</div><div class="content friend">6</div></div><div class="friends_blk"><div class="friend_1"></div><div class="friend_2"></div><div class="friend_3"></div></div>',
        '</div>',
        '<span class="bg icon-plan_bg"></span>',
        '<span class="bg_2 icon-plan_bg_page"></span>',
        '</div>',
        '<div class="more_blk"><div class="more_btn icon-more_btn"></div><ul class="more_menu"><li class="remove_btn">Remove Plan</li></ul></div>',
        '</div>',
    ].join("");
    return x;
}

function planListRefresh() {
    console.log("planListRefresh");

    $(".plan").replaceWith("");
    $(".waiting_fullblk").show();
    $("body").addClass('waiting_body');

    var getPlanListUrl = "/trip/getTripPlan"
    $.getJSON(getPlanListUrl, function(jsonResp) {
        // console.log(jsonResp.plan);
        var planA = jsonResp.plan;
        if (planA.length == 0) {
            $(".waiting_fullblk").hide();
            $("body").removeClass('waiting_body');
        }
        $("#planTopNum").html(planA.length);
        for (var i = 0; i < planA.length; i++) {
            var tarPlan = planA[i];
            if (i == planA.length - 1) {
                putPlanCon(tarPlan, 1);
            } else {

                putPlanCon(tarPlan);
            }
        }
    });
}

function putPlanCon(tarPlan, stop) {
    var tourQum = 0;
    var getPlanItemUrl = "/trip/getTripPlanItem?intPlanId=" + tarPlan.intId;
    $.getJSON(getPlanItemUrl, function(jsonResp) {

        var tourQum = jsonResp.plan_item.length;
        var dateFrom = dateToDot(tarPlan.strDatetimeFrom);
        var dateTo = dateToDot(tarPlan.strDatetimeTo);
        var tarPlanCon = getPlanCon(tarPlan.intId, tarPlan.strImageUrl, tarPlan.strName, tourQum, dateFrom, dateTo);
        $("#planBlk").append(tarPlanCon);
        if (stop == 1) {
            $(".waiting_fullblk").hide();
            $("body").removeClass('waiting_body');
            planMoreClick();
            removePlanClick();
            planClick();
        }
    });
}

// 移除FOLDER點選
function removePlanClick() {
    $(".remove_btn").off();
    $(".remove_btn").click(function(event) {

        $("body").addClass('waiting_body');
        $(".waiting_fullblk").show();

        var folderName = $(this).parent().parent().children('.card').children('.text_blk').children('.folder_name').html();

        var planId = $(this).parent().parent().parent().attr('data-id');

        var removePlanUrl = "/trip/removeTripPlan?intPlanId=" + planId;
        $.getJSON(removePlanUrl, function(jsonResp) {
            console.log("plan remove success");
            planListRefresh();
        });
    });
}

// MORE 按鈕 點擊
function planMoreClick() {
    $(".plan > .more_blk>.more_btn").off();
    $(".plan > .more_blk>.more_btn").click(function(event) {
        $(".plan > .more_blk>.more_menu").removeClass('active');
        $(this).parent().children('.more_menu').addClass('active');
    });
    $(window).click(function() {
        if (!event.target.matches(".plan > .more_blk>.more_btn")) {
            $(".plan > .more_blk>.more_menu").removeClass('active');
        }
    });
}

// 分類資料夾點擊
function planClick() {
    $(".plan").off();
    $(".plan").click(function(event) {
        if (!event.target.matches(".plan>.more_blk>.more_btn") && !event.target.matches(".plan>.more_blk>.more_menu") && !event.target.matches(".plan>.more_blk>.more_menu *")) {
            var tarPlanId = $(this).attr('data-id');
            window.location = "/page/tripEdit?ingPlanId=" + tarPlanId;
        }
    });

}

// 取得進行中plan ID
function getIngPlanIdFromUrl() {
    var x = window.location.href.split("?");
    var paraGet = x[1].split("=");
    if (paraGet[0] == "ingPlanId") {
        var ingId = paraGet[1];
        return ingId;
    }
}

// DATE 轉換
function dateMomentToDash(moment, planIng) {
    var dayStartSlash = dateToFullYear(planIng.startDay);
    var dayMove = planIng.ingDay;
    var tarDayDot = getNextFullYear(dayStartSlash, dayMove);
    var tarDayDash = dateDotToDash(tarDayDot);
    var tarDatArr = tarDayDash.split("/");
    var tarMoment = "";
    if (moment % 1 == 0) {
        if (moment >= 10) {
            tarMoment = moment + "-" + "00";
        } else {
            tarMoment = "0" + moment + "-" + "00";
        }
    } else {
        if (moment >= 10) {
            tarMoment = Math.floor(moment) + "-" + "30";
        } else {
            tarMoment = "0" + Math.floor(moment) + "-" + "30";
        }

    }
    tarDateDash = tarDatArr[0] + "-" + tarDatArr[1] + "-" + tarDatArr[2] + "-" + tarMoment;
    return tarDateDash;
}

function dateDotToDash(date) {
    var dateArr = date.split(".");
    var tarDate = dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2];
    return tarDate;
}

function dateDashToMoment(dateDash) {
    var dateArr = dateDash.split("-");
    var momentA = parseInt(dateArr[3]);

    if (dateArr[4] == "30") {
        var momentB = ".5";
    } else if (dateArr[4] == "00") {
        var momentB = "";
    }
    var moment = parseFloat(momentA + momentB);
    return moment;
}

function addWishFolderInit(tar) {
    console.log(tar);
    var getFavoUrl = "/account/getFavoriteTripFolder";
    $.getJSON(getFavoUrl, function(jsonResp) {
        var foldersOri = jsonResp.lstStrFavoriteTripFolder;
        var folders = [];

        for (var i = 0; i < foldersOri.length; i++) {
            if (foldersOri[i] != "default_folder") {
                folders.push(foldersOri[i]);
            }
        }
        for (var i = 0; i < folders.length; i++) {
            var tarCon = wishFolderLiCon(folders[i]);
            $("#addToFolderBlk>.info>.multi_sel_btn>.menu").append(tarCon);
        }
    });
}

function wishFolderLiCon(name) {
    var x = '<li><span>' + name + '</span><i class="icon-checkmark"></i></li>';
    return x;
}

function setTopPlanNum() {
    var getPlanListUrl = "/trip/getTripPlan"
    $.getJSON(getPlanListUrl, function(jsonResp) {
        // console.log(jsonResp.plan);
        var planA = jsonResp.plan;
        console.log(planA);
        $("#planTopNum").html(planA.length);
    });
}

function setTopWishNum() {
    var getPlanListUrl = "/trip/getFavoriteTrip"
    $.getJSON(getPlanListUrl, function(jsonResp) {
        // console.log(jsonResp.plan);
        var wishA = jsonResp.trip;
        $("#wishTopNum").html(wishA.length);
    });
}

function alertShow() {
    $("#alertTextBlk").show();
    var closeBtn = $("#alertTextBlk>.content_blk>.close_btn");
    var okBtn = $("#alertTextBlk>.content_blk>.confirm_btn");
    var bg = $("#alertTextBlk>.bg");

    closeBtn.off();
    closeBtn.click(function(event) {
        $("#alertTextBlk").hide();
    });

    okBtn.off();
    okBtn.click(function(event) {
        $("#alertTextBlk").hide();
    });

    bg.off();
    bg.click(function(event) {
        $("#alertTextBlk").hide();
    });
}
