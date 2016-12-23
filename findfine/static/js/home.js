//初始化autocomplate place_chenged event

function initMap() {


    tour.sendData = {};
    // 首頁搜尋區塊自動完成
    var input = (document.getElementById('autocomplete'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        
    var geocoder = new google.maps.Geocoder();
    
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            //未獲得地點資訊
            //return;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': document.getElementById('autocomplete').value
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    tour.sendData = {
                    keyword: document.getElementById('autocomplete').value,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                    };
                }
            });
        }else{
            tour.sendData = {
                keyword: document.getElementById('autocomplete').value,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
        }
    });

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
}

(function($) {

    $(document).ready(initHome);

    function initHome() {
        

        // 抓取推薦行程
        homeRecommedTourGet();

        // pad menu按鈕點擊
        padMenuAct();

        // mobile menu按鈕點擊
        mobileMenuClick();

        // toolbox點擊
        toolboxClick()

        homeInitCurrencySelect();

        // 飛機飛呀飛 @Q@davidturtle
        planeFly(5000);
        $(".plane_print").addClass('active');

        // 大LOGO箭頭動畫 @Q@davidturtle
        $(".intro-text > .arrow_blk_hideblk>.arrow_blk").delay(1500).queue(function(next) {
            $(this).addClass('active');
            next();
        });

        // 頁面下滑選單效果 @Q@davidturtle
        topNavDown(800);

        // 月份選單點擊效果 @Q@davidturtle
        homeMonthStoryMenuClick();

        // @TODO 實際抓出STORY資料
        homeMonthStoryMenuLiClick();

        // add to wishlist 按鈕點擊 @Q@ davidturtle
        addToWishlistBtnClick();
        // 推薦TOUR設定
        // 設定搜尋參數 @Q@davidturtle @TODO 後台功能增加後須改寫
        homeRecomTour();

        // 頭像點擊
        headBtnClick();

        // 通知止滑
        notiBlkPrevent();

        initMap();

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

        // // 登出按鈕點擊
        // $("#logOut").click(function() {

        //     window.location = "/account/logout";
        // });

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

        // moretour按鈕點擊 @Q@ davidturtle
        // $("#moreBtn").click(function(event) {
        //     window.location = "/page/find";

        // });
        $('#btnFindTrip').on('click', function() {
            //暫時改丟靜態頁,之後改後端接
            //若無googlemap資訊 將值帶到下一頁
            if (typeof tour.sendData.keyword == 'undefined') {
                var input = ($('#autocomplete')).val();
                location.href = '/page/find?keyword=' + input + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
            } else {
                location.href = '/page/find?keyword=' + tour.sendData.keyword + '&lat=' + tour.sendData.lat + '&lng=' + tour.sendData.lng;
            }
        });

        //圖片展示區塊
        $('.portfolio-link').on('click', function(e) {
            e.preventDefault();
            var url = '/page/find?keyword=' + $(this).data('place') + '&lat=' + $(this).data('lat') + '&lng=' + $(this).data('lng');
            location.href = url;
        });

        //登入按鈕        
        $("#loginBtn").click(function() {
            window.location = "/account/login";
        });

        //未登入頭像按鈕        
        $("#noLogHeadBtn").click(function() {
            window.location = "/account/login";
        });
    };



})(jQuery);


// 月份選單點擊效果 @Q@davidturtle
function homeMonthStoryMenuClick() {
    $(window).click(function() {
        if (!event.target.matches("#monthSelBtn")) {
            if ($("#monthDropDown").hasClass('active')) {

                $("#monthDropDown").removeClass('active');
            }
        }
    });
    $("#monthSelBtn").click(function(event) {
        /* Act on the event */
        if ($("#monthDropDown").hasClass('active')) {

            $("#monthDropDown").removeClass('active');
        } else {
            $("#monthDropDown").addClass('active');
        }
    });
}

// 首頁月份選單項目點擊 @Q@davidturtle
function homeMonthStoryMenuLiClick() {
    $("#monthDropDown li").click(function(event) {
        var tarEq = getEqVal($(this));
        $("#monthSelBtn").html($(this).html());
    });
}

// 首頁建議旅程抓取 RE@Q@davidturtle
function homeRecomTour() {
    var strFilterQueryUrl = "/trip/recommended";
    $("#tourBlk").html("");
    $("#tourBlk").hide();
    $.getJSON(strFilterQueryUrl, function(jsonResp) {
        var strUserCurrency = $("#moneySelect").val();
        //trip data
        var lstDicTripData = jsonResp["trip"];
        console.log(lstDicTripData);
        for (i = 0; i < lstDicTripData.length; i++) {
            var dicTripData = lstDicTripData[i];
            var strTripDataHtml = getHomeTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"], dicTripData["isFavoriteTrip"]);
            $("#tourBlk").append(strTripDataHtml);
        };

        // add to wishlist 按鈕點擊
        addToWishlistBtnClick();

        homeRecShow(0);
        // 隔十秒換三張 
        // homeRecAct(lstDicTripData.length);
        var jsDetectWidth = $(window).width();
        var ingNumber;

        if (jsDetectWidth > 1049) {
            var myLoop = setInterval(function() {
                console.log(ingNumber);
                homeRecHide(ingNumber);
                ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                ingNumber = ingNumber + 3;
                if (ingNumber >= lstDicTripData.length) {
                    ingNumber = 0;
                }
                $("#tourBlk").attr('data-ing', ingNumber);
                homeRecShow(ingNumber);
            }, 3000);
        } else if (jsDetectWidth > 767) {
            var myLoop = setInterval(function() {

                homeRecHide(ingNumber);
                ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                ingNumber = ingNumber + 2;
                if (ingNumber >= lstDicTripData.length) {
                    ingNumber = 0;
                }
                $("#tourBlk").attr('data-ing', ingNumber);
                homeRecShow(ingNumber);
            }, 3000);
        } else {
            var myLoop = setInterval(function() {

                homeRecHide(ingNumber);
                ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                ingNumber = ingNumber + 1;
                if (ingNumber >= lstDicTripData.length) {
                    ingNumber = 0;
                }
                $("#tourBlk").attr('data-ing', ingNumber);
                homeRecShow(ingNumber);
            }, 3000);
        }
        $("#moreBtn").click(function(event) {
            jsDetectWidth = $(window).width();
            $("#tourBlk").attr('data-ing', 0);
            clearInterval(myLoop);
            ingNumber = parseInt($("#tourBlk").attr('data-ing'));
            ingNumber = ingNumber + 3;
            if (ingNumber >= lstDicTripData.length) {
                ingNumber = 0;
            }
            homeRecShow(ingNumber);
            // 隔十秒換三張 
            // homeRecAct(lstDicTripData.length);
            console.log(ingNumber);
            if (jsDetectWidth > 1049) {
                myLoop = setInterval(function() {

                    homeRecHide(ingNumber);
                    ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                    ingNumber = ingNumber + 3;
                    if (ingNumber >= lstDicTripData.length) {
                        ingNumber = 0;
                    }
                    $("#tourBlk").attr('data-ing', ingNumber);
                    homeRecShow(ingNumber);
                }, 3000);
            } else if (jsDetectWidth > 767) {
                myLoop = setInterval(function() {

                    homeRecHide(ingNumber);
                    ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                    ingNumber = ingNumber + 2;
                    if (ingNumber >= lstDicTripData.length) {
                        ingNumber = 0;
                    }
                    $("#tourBlk").attr('data-ing', ingNumber);
                    homeRecShow(ingNumber);
                }, 3000);
            } else {
                myLoop = setInterval(function() {

                    homeRecHide(ingNumber);
                    ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                    ingNumber = ingNumber + 1;
                    if (ingNumber >= lstDicTripData.length) {
                        ingNumber = 0;
                    }
                    $("#tourBlk").attr('data-ing', ingNumber);
                    homeRecShow(ingNumber);
                }, 3000);
            }

        });
        $(window).resize(function(event) {
            jsDetectWidth = $(window).width();
            $("#tourBlk").attr('data-ing', 0);
            clearInterval(myLoop);
            homeRecShow(0);
            // 隔十秒換三張 
            // homeRecAct(lstDicTripData.length);
            if (jsDetectWidth > 1049) {
                myLoop = setInterval(function() {

                    homeRecHide(ingNumber);
                    ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                    ingNumber = ingNumber + 3;
                    if (ingNumber >= lstDicTripData.length) {
                        ingNumber = 0;
                    }
                    $("#tourBlk").attr('data-ing', ingNumber);
                    homeRecShow(ingNumber);
                }, 3000);
            } else if (jsDetectWidth > 767) {
                myLoop = setInterval(function() {

                    homeRecHide(ingNumber);
                    ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                    ingNumber = ingNumber + 2;
                    if (ingNumber >= lstDicTripData.length) {
                        ingNumber = 0;
                    }
                    $("#tourBlk").attr('data-ing', ingNumber);
                    homeRecShow(ingNumber);
                }, 3000);
            } else {
                myLoop = setInterval(function() {

                    homeRecHide(ingNumber);
                    ingNumber = parseInt($("#tourBlk").attr('data-ing'));
                    ingNumber = ingNumber + 1;
                    if (ingNumber >= lstDicTripData.length) {
                        ingNumber = 0;
                    }
                    $("#tourBlk").attr('data-ing', ingNumber);
                    homeRecShow(ingNumber);
                }, 3000);
            }
        });
        $("#tourBlk").show();
        $(".waiting_blk").hide();

    });
}

//組出單組查詢結果出來的html字串
function getHomeTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId, isFavoriteTrip) {

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
    var strTitle = strTitle.substr(0, 50);

    var favoriteTrip;

    if (isFavoriteTrip.toString() == "true") {
        favoriteTrip = " active";
        // favoriteTrip = "<div class=\"favorite\">♥</div>";
    }
    if (isFavoriteTrip.toString() == "false") {
        favoriteTrip = "";
    }
    var hrText = "HR";
    if (intDurationHour > 1) {
        hrText = "HRs"
    }
    var strTripDataHtml = [
        "<div class=\"tour hometour\">",
        "<div class=\"card active\" style=\"background-image:url(" + strImageUrl + ");\">",
        "<div class=\"name\">",
        "<p>" + strTitle + "...</p>",
        "</div>",
        "<p class=\"place\">" + strLocation + "</p>",
        "<p class=\"duration\">" + intDurationHour + "<span>"+hrText+"</span></p>",
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
