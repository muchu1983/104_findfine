// 假資料
var planIng = {
    planName: "tokyo GO",
    planId: "",
    startDay: "11/16/2016",
    endDay: "11/17/2016",
    ingDay: 0,
    checkList: [

        {
            finish: false,
            content: "訂飯店",
            assignId: "71",
        },

        {
            finish: true,
            content: "寫小卡",
            assignId: "51",
        },
    ],
    friends: [

        {
            id: "71",
            name: "小黃",
            photoUrl: "/static/img/friend_1.jpg",
        },

        {
            id: "51",
            name: "小綠",
            photoUrl: "/static/img/friend_2.jpg",
        },
    ],
    days: [

        {
            date: "2016.11.16",
            notes: [

                {
                    startmoment: "2",
                    coshr: "1",
                    content: "just a note test",
                },

                {
                    startmoment: "3.5",
                    coshr: "0.5",
                    content: "just a note test",
                }
            ],
            tours: [

                {
                    id: "1234",
                    hr: "5",
                    cosHr: "3",
                    price: "CNY $701",
                    link: "http://yahoo.com",
                    locate: "Tainan City, Taiwan",
                    photoUrl: "http://localhost:8000/static/img/berlin_new.jpg",
                    name: "tour1",
                    place: "Tainan",
                    note: "first note",
                    startMoment: "5",
                    lat: "22.9998999",
                    lng: "120.22687580000002",
                },

                {
                    id: "1235",
                    hr: "3",
                    cosHr: "2",
                    price: "CNY $74",
                    link: "http://google.com",
                    locate: "Taichung City, Taiwan",
                    photoUrl: "http://localhost:8000/static/img/berlin_new.jpg",
                    name: "tour2",
                    place: "Taichung",
                    note: "sec note",
                    startMoment: "10",
                    lat: "24.1477358",
                    lng: "120.6736482",
                },

                {
                    id: "1236",
                    hr: "4",
                    cosHr: "2",
                    price: "CNY $594",
                    link: "http://google.com",
                    locate: "Taipei City, Taiwan",
                    photoUrl: "http://localhost:8000/static/img/berlin_new.jpg",
                    name: "tour2",
                    place: "Taipei",
                    note: "third note",
                    startMoment: "18",
                    lat: "25.0329636",
                    lng: "121.56542680000007",
                },
            ],
        },

        {
            date: "2016.11.17",
            notes: [

                {
                    startmoment: "2",
                    coshr: "1",
                    content: "juqwdqwedqwefqw",
                },

                {
                    startmoment: "3.5",
                    coshr: "0.5",
                    content: "justdsfqewfqwst",
                }
            ],
            tours: [

                {
                    id: "1236",
                    hr: "4",
                    cosHr: "2",
                    price: "CNY $594",
                    link: "http://google.com",
                    locate: "Taipei City, Taiwan",
                    photoUrl: "http://localhost:8000/static/img/berlin_new.jpg",
                    name: "tour2",
                    place: "Taipei",
                    note: "third note",
                    startMoment: "6",
                    lat: "25.0329636",
                    lng: "121.56542680000007",
                },

                {
                    id: "1236",
                    hr: "4",
                    cosHr: "2",
                    price: "CNY $594",
                    link: "http://google.com",
                    locate: "Taoyuan City, Taiwan",
                    photoUrl: "http://localhost:8000/static/img/berlin_new.jpg",
                    name: "tour2",
                    place: "Taoyuan",
                    note: "third note",
                    startMoment: "11",
                    lat: "24.9936281",
                    lng: "121.30097980000005",
                },

                {
                    id: "1238",
                    hr: "3",
                    cosHr: "2",
                    price: "CNY $74",
                    link: "http://google.com",
                    locate: "Hsinchu City, Taiwan Province, Taiwan",
                    photoUrl: "http://localhost:8000/static/img/berlin_new.jpg",
                    name: "tour4",
                    place: "Hsinchu",
                    note: "sec note",
                    startMoment: "16",
                    lat: "24.8138297",
                    lng: "120.96747519999997",
                },
            ],
        },
    ],
};
(function($) {
    $(document).ready(initTripEdit);

    function initTripEdit() {

        // 個人設定點選 @TODO 點擊後要將資料傳到後端 @Q@ davidturtle 
        personelSetClick("#personelSet", ".setting_menu", "#editName", "#userName", ".rename_blk");

        // 時間區域設定 @Q@ davidturtle
        timeBlkSet();

        // PLAN 初始化
        oriPlanSet(planIng, planIng.ingDay);

        // 選單搜尋
        initTopSearch();

        // 幣值設定
        initCurrencySelect();

        // 回到抓取 WISHLIST 頁面
        backToTourBtnClickAct();

        // tour地址 輸入
        tourAddressType();

        // 筆記區域 輸入
        noteAreaTyping();

        // 日期選擇初始化
        $("#startDate").datepicker({
            format: "dd/mm/yyyy",
            autoclose: true
        })
        $("#toDate").datepicker();

        // CHECKLIST 新增
        addNewTask();

        // CHECKLIST 勾選
        checkboxClick();

        // CHECKLIST 刪除
        checkListCancel();

        // DATE 輸入 檢測
        dateInputCheck();

        // DATE 監視
        dateTypeCheck();

        // 編輯中TOUR 詳細資訊 初始化
        editDetailShow();
        $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk").scrollTop(300);

        // scrollbar設定
        shortScrollToggle("toursBlk", 448);
        shortScrollToggle("checkLists", 205);

        // 止滑
        scrollPrevent(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk");
        scrollPrevent("#tourDetailBlk");
        scrollPrevent(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists");
        scrollPrevent("#tourDetailBlk");
        scrollPrevent("#addNoteArea");

        // 新增筆記 按鈕 初始化
        addNoteAct();

        // 筆記 輸入 監視
        addNoteTyping();

        // 還沒設定日期時的灰色大區塊 點擊 初始化
        goSetDateClick();

        // PLAN 名稱 編輯
        planNameEdit();

        var intId;

        //顯示wishList
        //在执行之前加
        $.ajaxSettings.async = false;
        // });
        //执行你的代码之后及时恢复为
        $.ajaxSettings.async = true;


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

            var strHidden = "||" + strUserCurrency + "||" + strTitle + "||" + intUserCurrencyCost + "||" + strIntroduction + "||" + strLocation + "||" + intDurationHour + "||" + strOriginUrl + "||" + strImageUrl + "||" + intReviewStar + "||" + intReviewVisitor + "||" + intId + "||";

            var strTripDataHtml = [
                "<li id=" + intId + " style=\"list-style-type:none;\">",
                "<div class='fc-event'>",
                "<p><img src=\"" + strImageUrl + "\"/><p>",
                "<p><span style=\"color:orange\">" + strTitle + "</span></p>",
                "<p><a href=" + strOriginUrl + " target=\"_blank\"> read more</a><p>",
                "<p><span> Duration:" + intDurationHour + "</span></p>",
                "<p><span> strUserCurrency:" + strUserCurrency + "</span></p>",
                "<p><span> intUserCurrencyCost:" + intUserCurrencyCost + "</span></p>",
                "<p><span> strLocation:" + strLocation + "</span></p>",
                "<p><span> strOriginUrl:" + strOriginUrl + "</span></p>",
                "<p><span> Duration:" + intDurationHour + "</span></p>",
                "<p><span style=\"color:red\">Stars:" + reviewStar + "</span></p>",
                "<p><span>review:" + intReviewVisitor + "</span></p>",
                "<p><input type='hidden' value='hidden:" + strHidden + "'><p>",
                "</div>",
                "</li>"
            ].join("");
            return strTripDataHtml;
        };

        $("#backAllPlanBtn").click(function(event) {
            window.location = "/page/myTrip";
        });
        $("#wishList").click(function() {
            window.location = "/page/wishList";
        });

        $("#myPlans").click(function() {
            window.location = "/page/myTrip";
        });
        $('#wishesSel').click(function(event) {
            window.location = "/page/wishList";
        });

        $('#friendsSel').click(function(event) {
            window.location = "/page/myFriends";
        });

    };
})(jQuery);

// 初始化行程區域
function oriPlanSet() {

    tourDateInitSet("#startDate", "#toDate");
    checkListInitSet();
    planNameInitSet();
    planTourInitSet();
    planNoteInitSet();
    addressCheck();
    extendDrag();
    dateShowBlkCheck();
    daySwitchClick();
    wishListSearchType();
}

// TOUR 編輯區域更新
function tourBlkReNew() {

    jsonEditRenew();
    tourEmptify();
    noteEmptify();
    planTourInitSet();
    planNoteInitSet();
    addressCheck();
    extendDrag();
}

// Plan Data 初始化
function tourDateInitSet(startTar, toTar) {
    $(startTar).val(planIng.startDay);
    $(toTar).val(planIng.endDay);
}

// checkList 產生
function getCheckListCon(content, done, assign) {
    var doneReady,
        assignUrl;

    if (done == false) {
        doneReady = "";
    } else if (done == true) {
        doneReady = " done";
    } else {
        console.log("check done error");
    }

    if (assign.photoUrl != "" && assign.photoUrl != "NaN") {
        assignUrl = assign.photoUrl;
    } else {
        assignUrl = "/static/img/addfriend_s.png";
    }

    var x = [
        '<div class="checklist">',
        '<span class="checkbox icon-tick' + doneReady + '"></span>',
        '<input type="text" class="content" value="' + content + '">',
        '<span class="cancel icon-cancel"></span>',
        '<span class="friend" data-id="' + assign.id + '" style="background-image: url(' + assignUrl + ');"></span>',
        '</div>',

    ].join("");
    return x;
}

// checkList 初始化
function checkListInitSet() {
    var tarCon = "";
    for (var i = 0; i < planIng.checkList.length; i++) {
        var assignFriend = getFriendById(planIng, planIng.checkList[i].assignId);
        tarCon += getCheckListCon(planIng.checkList[i].content, planIng.checkList[i].finish, assignFriend);
    }
    $("#checkLists").html(tarCon);
}

// 透過 id 找到朋友
function getFriendById(planIng, id) {
    var friendNum = 0,
        tarEq = -1,
        result = "";
    for (var i = 0; i < planIng.friends.length; i++) {
        if (planIng.friends[i].id == id) {
            tarEq = i;
        }
    }
    if (tarEq < 0) {
        result = "find no friend";
    } else if (tarEq >= 0) {
        result = planIng.friends[tarEq];
    }
    return result;
}

// PLAN 名稱 初始化
function planNameInitSet() {
    $("#planName").html(planIng.planName);
}

// 時刻區域初始設定 @Q@ davidturtle
function timeBlkSet() {
    var planData = [];
    momentCon = "",
        putCon = "",
        tarMom = 0,
        startTime = 0;
    tarMomentBlk = $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.moment_blk"),
        tarPutBlk = $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts");
    for (var momentCoun = 0; momentCoun < 24; momentCoun++) {
        tarMom = momentCoun + startTime;
        if (tarMom < 10) {
            momentCon += "<div class=\"moment full\"><div class=\"time\">0" + tarMom + ":00</div></div><div class=\"moment half\"><div class=\"time\">0" + tarMom + ":30</div></div>";
        } else if (tarMom < 24) {
            momentCon += "<div class=\"moment full\"><div class=\"time\">" + tarMom + ":00</div></div><div class=\"moment half\"><div class=\"time\">" + tarMom + ":30</div></div>";
        } else {
            tarMom = tarMom - 24;
            momentCon += "<div class=\"moment full\"><div class=\"time\">0" + tarMom + ":00</div></div><div class=\"moment half\"><div class=\"time\">0" + tarMom + ":30</div></div>";
        }
    }
    momentCon += "<div class=\"transcover\"></div>";
    tarMomentBlk.html(momentCon);
    putCon = getPutCon(0, 23.5);
    tarPutBlk.html(putCon);
}

// tour資料傳入picker @Q@ davidturtle
function setPickerOri(clicker, picker, mouseX, mouseY) {
    var pickerWidth = picker.outerWidth(),
        pickerHeight = picker.outerHeight(),
        clickerId = clicker.data('id'),
        clickerHr = clicker.data('hr'),
        tarLink = clicker.data('link'),
        toBackImg = clicker.children('.card').css('background-image'),
        toName = clicker.children('.card').children('.name').children('p').html(),
        toPlace = clicker.children('.card').children('.place').html(),
        toPriceCountry = clicker.children('.card').children('.price').children('.country').html(),
        toPriceNumber = clicker.children('.card').children('.price').children('.number').html(),
        toPrice = toPriceCountry + " $" + toPriceNumber;
    picker.css({
        top: mouseY - pickerHeight / 2,
        left: mouseX - pickerWidth / 2,
        'background-image': toBackImg,
    });
    picker.show();
    picker.children('.name').html(toName);
    picker.children('.place').html(toPlace);
    picker.attr('data-id', clickerId);
    picker.attr('data-hr', clickerHr);
    picker.attr('data-link', tarLink);
    picker.attr('data-price', toPrice);
    picker.attr('data-coshr', clickerHr);
    picker.attr('data-obj', "tour");
}

// 已放入的tour資料傳入picker @Q@ davidturtle
function setPickerPut(clicker, picker, mouseX, mouseY) {
    var pickerWidth = picker.outerWidth(),
        pickerHeight = picker.outerHeight(),
        clickerId = clicker.attr('data-id'),
        clickerHr = clicker.attr('data-hr'),
        clickerLocate = clicker.attr('data-locate'),
        clickercosHr = clicker.attr('data-coshr'),
        clickerPrice = clicker.attr('data-price'),
        clickerLink = clicker.attr('data-link'),
        clickerLat = clicker.attr('data-lat'),
        clickerLng = clicker.attr('data-lng'),
        clickerMoment = clicker.attr('data-startmoment'),
        putInfoEq = clicker.index('.put.infoin'),
        toBackImg = clicker.children('.photo').css('background-image'),
        toName = clicker.children('.info').children('.name').html(),
        toNote = clicker.children('.info').children('.note').children('.content').html(),
        toPlace = clicker.children('.info').children('.place').children('.content').html();
    picker.css({
        top: mouseY - pickerHeight / 2,
        left: mouseX - pickerWidth / 2,
        'background-image': toBackImg,
    });
    picker.show();
    picker.children('.name').html(toName);
    picker.children('.place').html(toPlace);
    picker.attr('data-id', clickerId);
    picker.attr('data-hr', clickerHr);
    picker.attr('data-coshr', clickercosHr);
    picker.attr('data-price', clickerPrice);
    picker.attr('data-link', clickerLink);
    picker.attr('data-locate', clickerLocate);
    picker.attr('data-note', toNote);
    picker.attr('data-lat', clickerLat);
    picker.attr('data-lng', clickerLng);
    picker.attr('data-startmoment', clickerMoment);

    picker.attr('data-obj', putInfoEq);
}

// 已放入的note資料傳入notePicker @Q@ davidturtle
function setNotePickerPut(clicker, picker, mouseX, mouseY) {
    var pickerWidth = picker.outerWidth(),
        pickerHeight = picker.outerHeight(),
        putInfoEq = clicker.index('.put.added'),
        clickerCosHr = parseFloat(clicker.attr('data-coshr'));
    var startMoment = clicker.attr('data-startmoment');
    picker.css({
        top: mouseY - pickerHeight / 2,
        left: mouseX - pickerWidth / 2,
    });
    picker.html(clicker.children('.note').html());
    picker.attr('data-coshr', clickerCosHr);
    picker.attr('data-ingEq', putInfoEq);
    picker.attr('data-startmoment', startMoment);
}

// picker跟滑鼠移動 @Q@ davidturtle
function pickerMove(picker, mouseX, mouseY) {
    var tarTop = mouseY - picker.innerHeight() / 2,
        tarLeft = mouseX - picker.innerWidth() / 2;
    picker.css({
        top: tarTop,
        left: tarLeft,
    });
}

// picker over 時刻偵測 @Q@ davidturtle
function putOverCheck(picker) {
    var put = $(".puts .put"),
        putDetectLeft,
        putDetectRight,
        putTop,
        putBottom,
        pickerCenterX,
        pickerCenterY,
        ingPut;

    pickerCenterX = picker.offset().left + picker.innerWidth() / 2;
    pickerCenterY = picker.offset().top + picker.innerHeight() / 2;
    for (var putNum = 0; put.eq(putNum).length > 0; putNum++) {
        ingPut = put.eq(putNum);
        putDetectLeft = ingPut.offset().left - picker.innerWidth() / 2;
        putDetectRight = ingPut.offset().left + ingPut.innerWidth() + picker.innerWidth() / 2;
        putTop = ingPut.offset().top;
        putBottom = ingPut.offset().top + ingPut.innerHeight();
        if (pickerCenterX > putDetectLeft && pickerCenterX < putDetectRight && pickerCenterY > putTop && pickerCenterY < putBottom) {
            ingPut.addClass('over');
        } else {
            ingPut.removeClass('over');
        }
    }
}

// TOUR 放入時刻 @Q@ davidturtle
function putInfoSet(tarPut, picker) {
    var tarImgUrl = picker.css('background-image').replace("url(\"", "").replace("\")", ""),
        tarCancel = $(".put.infoin").eq(parseInt(picker.attr('data-obj'))),
        tarName = picker.children('.name').html(),
        tarPlace = picker.children('.place').html(),
        tarHr = picker.attr("data-hr"),
        tarCosHr = picker.attr("data-coshr"),
        tarLocate = picker.attr("data-locate"),
        tarLat = picker.attr("data-lat"),
        tarLng = picker.attr("data-lng"),
        tarId = picker.attr("data-id"),
        tarNote = picker.attr("data-note"),
        ingPutEq = -1,
        tarHeight = tarCosHr * 2 * 26,
        tarPrice = picker.attr("data-price"),
        tarLink = picker.attr("data-link"),
        tarCosHr = picker.attr("data-coshr");

    for (var tarPutCoun = 0; tarPut.eq(tarPutCoun).length > 0; tarPutCoun++) {
        if (tarPut.eq(tarPutCoun).hasClass('over') && tarPut.eq(tarPutCoun).hasClass('empty')) {
            var downCheck = 1;
            for (var i = tarPutCoun; i < tarPutCoun + tarCosHr * 2; i++) {
                if (tarPut.eq(i).hasClass('infoin')) {
                    downCheck = 0;
                }
                if (tarPut.eq(i).hasClass('duration')) {
                    downCheck = 0;
                }
                if (tarPut.eq(i).hasClass('added')) {
                    downCheck = 0;
                }
            }

            if (!tarPut.eq(tarPutCoun + tarCosHr * 2).length > 0) {
                downCheck = 0;
            }

            if (downCheck == 1) {
                ingPutEq = tarPutCoun;
            }
        }
    }
    // console.log(ingPutEq);
    // if (picker.attr('data-obj') != "tour" && ingPutEq >= 0) {

    //     var cosHr = parseFloat(tarCancel.attr('data-coshr')),
    //         min = parseFloat(tarCancel.attr('data-startmoment')),
    //         max = min + cosHr - 0.5;
    //     var fillCon = getPutCon(min, max);
    //     tarCancel.replaceWith(fillCon);
    // }
    if (ingPutEq < 0) {
        var startMoment = picker.attr('data-startmoment');
        ingPutEq = getTarPutEqByMoment(startMoment);
    } else {
        var startMoment = tarPut.eq(ingPutEq).attr('data-moment');
    }

    var putCon = getPutInfoCon(tarHeight, tarId, tarHr, tarImgUrl, tarName, tarPlace, tarNote, tarPrice, tarLink, tarCosHr, tarLocate, startMoment, tarLat, tarLng);

    tarPut.eq(ingPutEq).replaceWith(putCon);
    for (var cancelCoun = ingPutEq + 1; cancelCoun < ingPutEq + tarCosHr * 2; cancelCoun++) {
        tarPut.eq(cancelCoun).replaceWith("");
    }



    pickerEmptify();
    tourBlkReNew();
    editDetailShow();
}

// NOTE 放入時刻 @Q@ davidturtle
function NotePutInfoSet(tarPut, picker) {
    var tarCosHr = picker.attr("data-coshr"),
        tarNote = picker.html(),
        ingPutEq = -1,
        tarHeight = tarCosHr * 2 * 26;

    for (var tarPutCoun = 0; tarPut.eq(tarPutCoun).length > 0; tarPutCoun++) {
        if (tarPut.eq(tarPutCoun).hasClass('over') && tarPut.eq(tarPutCoun).hasClass('empty')) {

            var downCheck = 1;

            for (var i = tarPutCoun; i < tarPutCoun + tarCosHr * 2; i++) {
                if (tarPut.eq(i).hasClass('infoin')) {
                    downCheck = 0;
                }
                if (tarPut.eq(i).hasClass('duration')) {
                    downCheck = 0;
                }
                if (tarPut.eq(i).hasClass('added')) {
                    downCheck = 0;
                }
            }

            if (!tarPut.eq(tarPutCoun + tarCosHr * 2).length > 0) {

                downCheck = 0;
            }

            if (downCheck == 1) {

                ingPutEq = tarPutCoun;
            }
        }
    }

    if (ingPutEq < 0) {
        var startMoment = picker.attr('data-startmoment');
        ingPutEq = getTarPutEqByMoment(startMoment);
    } else {
        var startMoment = tarPut.eq(ingPutEq).attr('data-moment');
    }
    var putCon = getNoteBlkCon(startMoment, tarCosHr, tarNote);

    tarPut.eq(ingPutEq).replaceWith(putCon);

    for (var cancelCoun = ingPutEq + 1; cancelCoun < ingPutEq + tarCosHr * 2; cancelCoun++) {
        tarPut.eq(cancelCoun).replaceWith("");
    }

    tourBlkReNew();

    editDetailShow();

    pickerEmptify();

}

// 清空 TOUR 的 PICKER
function pickerEmptify() {
    tar = $("#picker");
    tar.children('.name').html("");
    tar.children('.place').html("");
    tar.attr('data-hr', "");
    tar.attr('data-id', "");
    tar.attr('data-link', "");
    tar.attr('data-price', "");
    tar.attr('data-coshr', "");
    tar.attr('data-note', "");
    tar.attr('data-locate', "");
    tar.attr('data-obj', "");
    tar.attr('data-lat', "");
    tar.attr('data-lng', "");
    tar.attr('data-startmoment', "");
}

// 取得放入時刻後HTML @Q@ davidturtle
function getPutInfoCon(height, id, hr, imgUrl, name, place, note, price, link, cosHr, locate, startMoment, lat, lng) {
    var x = [
        "<div class=\"put infoin\" style=\"height:" + height + "px\" data-id=\"" + id + "\" data-hr=\"" + hr + "\" data-coshr=\"" + cosHr + "\" data-price=\"" + price + "\" data-link=\"" + link + "\" data-locate=\"" + locate + "\" data-startMoment=\"" + startMoment + "\" data-lat=\"" + lat + "\" data-lng=\"" + lng + "\">",
        "<div class=\"photo\" style=\"background-image:url(" + imgUrl + ");\"></div>",
        "<div class=\"info\">",
        "<div class=\"name\">" + name + "</div>",
        "<div class=\"place\">",
        "<span class=\"place_icon icon-location2\"></span>",
        "<p class=\"content\">" + place + "</p>",
        "</div>",
        "<div class=\"note\">",
        "<span class=\"note_icon icon-pen\"></span>",
        "<p class=\"content\">" + note + "</p>",
        "</div>",
        "</div>",
        "<div class=\"drag_line top\">",
        "<div class=\"drag_btn icon-drag\">",
        "</div>",
        "</div>",
        "<div class=\"drag_line bottom\">",
        "<div class=\"drag_btn icon-drag\">",
        "</div>",
        "</div>",
        "<div class=\"cancel_btn icon-cancel\"></div>",
        "<div class=\"block\"></div>",
        "</div>"
    ].join("");
    return x;
}

// TOUR 地址輸入 GOOGLE自動完成
function tourAddressType() {
    var tour = {};
    tour.sendData = {};

    var addressInput = (document.getElementById('tourAddressType'));
    var addressAutocomplete = new google.maps.places.Autocomplete(addressInput);
    addressAutocomplete.addListener('place_changed', function() {

        var place = addressAutocomplete.getPlace();
        if (!place.geometry) {
            //未獲得地點資訊
            return;
        }
        $(".infoin.put.open").attr('data-locate', $("#tourAddressType").val());
        $(".infoin.put.open").attr('data-lat', place.geometry.location.lat);
        $(".infoin.put.open").attr('data-lng', place.geometry.location.lng);
        jsonEditRenew();
        tourBlkReNew();;
    });
}

// TOUR 地址檢查 產生交通時間
function addressCheck() {
    var tourNum = 0,
        duraNum = 0,
        infoinOb = ".put.infoin";
    durationEmptify();

    for (var j = 0; $(".put.infoin").eq(j).length > 0; j++) {
        tourNum++;
    }
    for (var k = 0; k < tourNum - 1; k++) {
        var startLat = $(".put.infoin").eq(k).attr('data-lat'),
            startLng = $(".put.infoin").eq(k).attr('data-lng');
        toLat = $(".put.infoin").eq(k + 1).attr('data-lat');
        toLng = $(".put.infoin").eq(k + 1).attr('data-lng');
        if (startLat != "" && startLng != "" && startLat != undefined && startLng != undefined && toLat != "" && toLng != "" && toLat != undefined && toLng != undefined) {
            var infoEq = k;
            durationSet(startLat, startLng, toLat, toLng, "TRANSIT", infoEq);
        }
    }
}

// 交通時間設置
function durationSet(startLat, startLng, toLat, toLng, transitWay, infoEq) {


    var directionsService = new google.maps.DirectionsService();
    var start = startLat + "," + startLng;
    var end = toLat + "," + toLng;
    var request = {
        origin: start,
        destination: end,
        travelMode: transitWay,
        provideRouteAlternatives: true,
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var routes = response.routes;
            var blkTake = Math.ceil(routes[0].legs[0].duration.value / 1800);
            var bump = false;
            var nextPutEq = $(".put.infoin").eq(infoEq).index('.puts>.put') + 1;
            var replceNum = 0;

            for (var i = nextPutEq; i < nextPutEq + blkTake; i++) {

                if ($(".put").eq(i).hasClass('added') || $(".put").eq(i).hasClass('infoin')) {
                    bump = true;
                    break;
                }
                replceNum++;
            }
            var timeText = routes[0].legs[0].duration.text;
            var tarDurationCon = durationCon(transitWay, replceNum, timeText, startLat, startLng, toLat, toLng, bump);
            $(".put.infoin").eq(infoEq).after(tarDurationCon);
            var startCancelEq = $(".put.infoin").eq(infoEq).index('.put') + 2;
            for (var ingEq = startCancelEq; ingEq < startCancelEq + replceNum; ingEq++) {
                $(".put").eq(startCancelEq).replaceWith("");
            }
            durationClickAct();
        }
    });
}

// 交通時間 CLICK 啟動
function durationClickAct() {
    $(".put.duration").off();
    $(".put.duration").click(function(event) {
        var startLat = $(this).attr('data-startlat'),
            startlng = $(this).attr('data-startlng'),
            endlat = $(this).attr('data-endlat'),
            endlng = $(this).attr('data-endlng'),
            transitWay = $(this).attr('data-transitway');
        routeSet(startLat, startlng, endlat, endlng, transitWay);

        var points = [];
        for (var i = 0; $(".put.infoin").eq(i).length > 0; i++) {
            points[i] = [];
            points[i].lat = $(".put.infoin").eq(i).attr('data-lat');
            points[i].lng = $(".put.infoin").eq(i).attr('data-lng');
        }

        var linkPoints = [];
        linkPoints.start = [];
        linkPoints.end = [];
        linkPoints.start.lat = $(this).attr('data-startlat');
        linkPoints.start.lng = $(this).attr('data-startlng');
        linkPoints.end.lat = $(this).attr('data-endlat');
        linkPoints.end.lng = $(this).attr('data-endlng');
        mapSet(points, linkPoints);


        $("#tourBlk").hide();
        $("#mapBlk").removeClass('back');
        transitBtnClickAct(startLat, startlng, endlat, endlng);
    });
}

// 路線 設置
function routeSet(startLat, startLng, endLat, endLng, transitWay) {

    var directionsService = new google.maps.DirectionsService();
    var start = startLat + "," + startLng;
    var end = endLat + "," + endLng;
    var request = {
        origin: start,
        destination: end,
        travelMode: transitWay,
        provideRouteAlternatives: true,
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var routes = response.routes;
            var routeCon = "";
            for (var i = 0; i < routes.length; i++) {
                var tarCon = getRouteCon(routes[i].legs[0].duration.text);
                routeCon += tarCon;
            }
            $("#routesBlk").html(routeCon);
            routeClickAct(routes);
        }
    });
    // $.getJSON(getJsonUrl, function(jsonResp) {
    //     var routes = jsonResp['routes'];
    //     var routeCon = "";
    //     for (var i = 0; i < routes.length; i++) {
    //         var tarCon = getRouteCon(routes[i].legs[0].duration.text);
    //         routeCon += tarCon;
    //     }
    //     $("#routesBlk").html(routeCon);
    //     routeClickAct(routes);
    // });
}

// GOOGLE MAP 刷新
function mapSet(points, linkPoints) {

    var styles = mapStyle();

    var mapOptions = {
        zoom: 12,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        center: new google.maps.LatLng(55.6468, 37.581),
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    };
    var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });


    var map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    var bounds = new google.maps.LatLngBounds();


    for (var i = 0; i < points.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(points[i].lat, points[i].lng),
            map: map,
            zIndex: 1000,
            icon: '../static/img/map_icon.png',
        });
        bounds.extend(marker.position);
    }
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4,
        strokeColor: "#228e9c",
    };
    var lineStartLat = parseFloat(linkPoints.start.lat),
        lineStartLng = parseFloat(linkPoints.start.lng),
        lineEndLat = parseFloat(linkPoints.end.lat),
        lineEndLng = parseFloat(linkPoints.end.lng);
    var line = new google.maps.Polyline({
        path: [{ lat: lineStartLat, lng: lineStartLng }, { lat: lineEndLat, lng: lineEndLng }],
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px',
        }],
        map: map
    });


    map.fitBounds(bounds);

    var listener = google.maps.event.addListener(map, "idle", function() {
        map.setZoom(8);
        google.maps.event.removeListener(listener);
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
}

// 交通時間 HTML 產生
function durationCon(transWay, replceNum, timeText, startLat, startLng, toLat, toLng, bump) {
    var transWayIconName = "";
    if (transWay == "WALKING") {
        transWayIconName = "icon-walking";
    }
    if (transWay == "TRANSIT") {
        transWayIconName = "icon-transit";
    }
    if (transWay == "DRIVING") {
        transWayIconName = "icon-driving";
    }

    var longClass = "";
    if (bump == true) {
        longClass = " long";
    }

    var tarHeight = replceNum * 26;

    var x = [
        "<div class=\"put duration" + longClass + "\" style=\"height:" + tarHeight + ";\" data-transitway=\"" + transWay + "\" data-startlat=\"" + startLat + "\" data-startlng=\"" + startLng + "\" data-endlat=\"" + toLat + "\" data-endlng=\"" + toLng + "\">",
        "<span class=\"transit_way " + transWayIconName + "\"></span>",
        "<span class=\"time\">" + timeText + "</span>",
        "</div>",
    ].join("");
    return x;
}

// tour 編輯操作動作
function extendDrag() {

    var perHeight = 26,
        extDragging = 0,
        tarTopY = -1,
        tarBottomY = -1,
        ingHeight = -1,
        ingEq = -1,
        preEq = -1,
        putIngEq = -1,
        nextEq = -1,
        preMoment = -1,
        ingMoment = -1;
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.infoin>.drag_line.top").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.infoin>.drag_line.bottom").off();
    $("body").off();
    $(document).off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.empty").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added>.cancel_btn").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added>.drag_line.top").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added>.drag_line.bottom").off();
    $(".tour_pick").off();
    $("#picker").off();
    $(".put.infoin").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.infoin>.cancel_btn").off();


    var dragging = 0;
    var tarPick = $("#picker");
    $(".tour_pick").mousedown(function(event) {
        if (!event.target.matches(".tour_pick>.card>.read_more_btn") && !event.target.matches(".tour_pick>.card>.read_more_btn *")) {
            dragging = 1;
            var mouseX = event.pageX,
                mouseY = event.pageY;
            $(this).css('opacity', '0.5');
            setPickerOri($(this), tarPick, mouseX, mouseY);
        }

    });

    tarPick.mouseup(function(event) {
        $(".put.infoin").css('opacity', '1');

    });

    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.infoin>.cancel_btn").click(function(event) {
        tourCancel($(this).parent());
    });
    $(".put.infoin").mousedown(function(event) {
        if (!event.target.matches(".drag_line") && !event.target.matches(".drag_line *") && !event.target.matches(".cancel_btn") && !event.target.matches(".cancel_btn *")) {
            dragging = 1;
            var mouseX = event.pageX,
                mouseY = event.pageY;
            $(this).css('opacity', '0.5');
            setPickerPut($(this), tarPick, mouseX, mouseY);
            tourCancel($(this));
        }
    });
    $(document).mousemove(function(event) {
        if (dragging == 1) {
            var mouseX = event.pageX,
                mouseY = event.pageY;
            pickerMove($("#picker"), mouseX, mouseY);
            putOverCheck($("#picker"));
        }
    });
    $(document).mouseup(function(event) {
        if (dragging == 1) {

            dragging = 0;
            $("#picker").hide();
            $(".tour_pick").css('opacity', '1');
            putInfoSet($(".puts .put"), $("#picker"));
            $(".puts .put").removeClass('over');
        }
    });

    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.infoin>.drag_line.top").mousedown(function(event) {
        extDragging = 1;
        ingHeight = parseInt($(".put.infoin.open").height());
        ingEq = $(this).parent().index('.put.infoin');
        tarTopY = $(".put.infoin.open").offset().top;
        $("body").addClass('dragging');
    });
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.infoin>.drag_line.bottom").mousedown(function(event) {
        extDragging = 2;
        ingHeight = parseInt($(".put.infoin.open").height());
        ingEq = $(this).parent().index('.put.infoin');
        tarBottomY = parseInt($(".put.infoin.open").offset().top) + parseInt($(".put.infoin.open").height());
        $("body").addClass('dragging');
    });
    $("body").mouseup(function(event) {
        if (extDragging == 1 || extDragging == 2) {

            extDragging = 0;
            tarTopY = -1;
            tarBottomY = -1;
            ingHeight = -1;
            ingEq = -1;
            $("body").removeClass('dragging');
            tourBlkReNew();
        }
    });
    $(document).mousemove(function(event) {

        var mouseY = event.pageY;
        // 拉上面
        if (extDragging == 1) {
            var topToUp = tarTopY - perHeight;
            var topToDown = tarTopY + perHeight;
            // 往上拉
            if (mouseY < topToUp) {
                preEq = $(".put.infoin").eq(ingEq).index('.put') - 1;
                if (preEq >= 0) {
                    ingMoment = parseFloat($(".put.infoin").eq(ingEq).attr('data-startmoment'));
                    if (!$(".put").eq(preEq).hasClass('infoin') && !$(".put").eq(preEq).hasClass('duration') && !$(".put").eq(preEq).hasClass('added')) {
                        var heightTo = ingHeight + perHeight;
                        $(".put.infoin").eq(ingEq).css('height', heightTo);
                        ingHeight = heightTo;
                        tarTopY = tarTopY - perHeight;
                        $(".put").eq(preEq).replaceWith('');
                        var coshr = parseFloat($(".put.infoin").eq(ingEq).attr('data-coshr'));
                        var tohr = coshr + 0.5;
                        $(".put.infoin").eq(ingEq).attr('data-coshr', tohr);
                        var toMoment = ingMoment - 0.5;
                        $(".put.infoin").eq(ingEq).attr('data-startmoment', toMoment);
                    }
                }

            }
            // 往下拉
            else if (mouseY > topToDown) {
                if (ingHeight - perHeight > 0) {
                    ingMoment = parseFloat($(".put.infoin").eq(ingEq).attr('data-startmoment'));
                    var heightTo = ingHeight - perHeight;
                    $(".put.infoin").eq(ingEq).css('height', heightTo);
                    ingHeight = heightTo;
                    tarTopY = tarTopY + perHeight;
                    preEq = $(".put.infoin").eq(ingEq).index('.put') - 1;

                    // var preMoment = parseFloat($(".put").eq(preEq).attr('data-moment'));

                    // var tarMoment = preMoment + 0.5;
                    var tarHtml = getPutCon(ingMoment, ingMoment);
                    $(".put.infoin").eq(ingEq).before(tarHtml);
                    var coshr = parseFloat($(".put.infoin").eq(ingEq).attr('data-coshr'));
                    var tohr = coshr - 0.5;
                    $(".put.infoin").eq(ingEq).attr('data-coshr', tohr);
                    var toMoment = ingMoment + 0.5;

                    $(".put.infoin").eq(ingEq).attr('data-startmoment', toMoment);
                }
            }
        }
        // 拉下面
        if (extDragging == 2) {

            var bottomToUp = tarBottomY - perHeight;
            var bottomToDown = tarBottomY + perHeight;
            // 往上拉
            if (mouseY < bottomToUp) {
                var heightTo = ingHeight - perHeight;
                if (heightTo > 0) {
                    $(".put.infoin").eq(ingEq).css('height', heightTo);
                    ingHeight = heightTo;
                    tarBottomY = tarBottomY - perHeight;
                    nextEq = $(".put.infoin").eq(ingEq).index('.put') + 1;

                    var coshr = parseFloat($(".put.infoin").eq(ingEq).attr('data-coshr'));

                    var tohr = coshr - 0.5;
                    $(".put.infoin").eq(ingEq).attr('data-coshr', tohr);

                    if ($(".put").eq(nextEq).hasClass('duration')) {
                        var startMoment = parseFloat($(".put.infoin").eq(ingEq).attr('data-startmoment'));
                        var durationTime = parseInt($(".put").eq(nextEq).css('height')) / 26;
                        var tarMoment = startMoment + coshr + durationTime - 0.5;

                        var tarHtml = getPutCon(tarMoment, tarMoment);
                        $(".put").eq(nextEq).after(tarHtml);

                    } else {
                        var tarMoment = parseFloat($(".put.infoin").eq(ingEq).attr('data-startmoment')) + coshr - 0.5;

                        var tarHtml = getPutCon(tarMoment, tarMoment);
                        $(".put.infoin").eq(ingEq).after(tarHtml);
                    }
                }

            }
            // 往下拉
            else if (mouseY > bottomToDown) {
                nextEq = $(".put.infoin").eq(ingEq).index('.put') + 1;
                if (!$(".put").eq(nextEq).hasClass('infoin')) {
                    if ($(".put").eq(nextEq).hasClass('duration')) {
                        var tarCancelEq = nextEq + 1;

                        if (!$(".put").eq(tarCancelEq).hasClass('infoin') && !$(".put").eq(tarCancelEq).hasClass('added')) {

                            var heightTo = ingHeight + perHeight;
                            $(".put.infoin").eq(ingEq).css('height', heightTo);
                            ingHeight = heightTo;
                            tarBottomY = tarBottomY + perHeight;
                            $(".put").eq(tarCancelEq).replaceWith('');
                            var coshr = parseFloat($(".put.infoin").eq(ingEq).attr('data-coshr'));
                            var tohr = coshr + 0.5;
                            $(".put.infoin").eq(ingEq).attr('data-coshr', tohr);
                        }
                    } else {
                        if ($(".put").eq(nextEq).length > 0 && !$(".put").eq(nextEq).hasClass('added')) {
                            var heightTo = ingHeight + perHeight;
                            $(".put.infoin").eq(ingEq).css('height', heightTo);
                            ingHeight = heightTo;
                            tarBottomY = tarBottomY + perHeight;
                            $(".put").eq(nextEq).replaceWith('');
                            var coshr = parseFloat($(".put.infoin").eq(ingEq).attr('data-coshr'));
                            var tohr = coshr + 0.5;
                            $(".put.infoin").eq(ingEq).attr('data-coshr', tohr);
                        }

                    }

                }
            }

        } else {}

        emptyInputSet();
    });

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

    emptyInputSet();

    $("body").mousemove(function(event) {
        if (!event.target.matches("#addNoteBlk") && !event.target.matches("#addNoteBlk *") && !event.target.matches(".put.note") && !event.target.matches(".put.note *")) {
            $("#addNoteBlk").hide();
            $(".note.adding.put").removeClass('note');
            $(".adding.put").removeClass('adding');
            $("#addNoteBlk").attr('data-ingnoteeq', "-1");

        }
    });
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added").mouseover(function(event) {
        addNoteRefresh($(this));
        $("#addNoteArea").focus();
    });

    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added>.cancel_btn").click(function(event) {
        noteCancel($(this).parent());
        extendDrag();
    });

    var notePerHeight = 26,
        noteExtDragging = 0,
        noteTarTopY = -1,
        noteTarBottomY = -1,
        noteIngHeight = -1,
        noteIngEq = -1,
        notePreEq = -1,
        noteNextEq = -1,
        noteIngMoment = -1;
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added>.drag_line.top").mousedown(function(event) {
        noteExtDragging = 1;
        noteIngHeight = parseInt($(this).parent().height());
        noteIngEq = $(this).parent().index('.put.note');
        noteTarTopY = $(this).parent().offset().top;
        $("body").addClass('note_dragging');
    });
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.added>.drag_line.bottom").mousedown(function(event) {
        noteExtDragging = 2;
        noteIngHeight = parseInt($(this).parent().height());
        noteIngEq = $(this).parent().index('.put.note');
        tarBottomY = $(this).parent().offset().top + noteIngHeight;
        $("body").addClass('note_dragging');
    });
    $("body").mouseup(function(event) {
        if (noteExtDragging == 1 || noteExtDragging == 2) {
            noteExtDragging = 0;
            noteTarTopY = -1;
            tarBottomY = -1;
            noteIngHeight = -1;
            noteIngEq = -1;
            $("body").removeClass('note_dragging');
            tourBlkReNew();
        }
    });
    $(document).mousemove(function(event) {
        var mouseY = event.pageY;
        // 拉上面
        if (noteExtDragging == 1) {
            var topToUp = noteTarTopY - notePerHeight;
            var topToDown = noteTarTopY + notePerHeight;
            // 往上拉
            if (mouseY < topToUp) {
                notePreEq = $(".put.note").eq(noteIngEq).index('.put') - 1;
                if (notePreEq >= 0 && $(".put").eq(notePreEq).hasClass('empty')) {

                    noteIngMoment = parseFloat($(".put.note").eq(noteIngEq).attr('data-startmoment'));
                    var heightTo = noteIngHeight + notePerHeight;
                    $(".put.note").eq(noteIngEq).css('height', heightTo);
                    noteIngHeight = heightTo;
                    noteTarTopY = noteTarTopY - notePerHeight;
                    $(".put").eq(notePreEq).replaceWith('');
                    var coshr = parseFloat($(".put.note").eq(noteIngEq).attr('data-coshr'));
                    var tohr = coshr + 0.5;
                    $(".put.note").eq(noteIngEq).attr('data-coshr', tohr);
                    var toMoment = noteIngMoment - 0.5;
                    $(".put.note").eq(noteIngEq).attr('data-startmoment', toMoment);
                }
            }
            // 往下拉
            else if (mouseY > topToDown) {
                if (noteIngHeight - notePerHeight > 0) {
                    noteIngMoment = parseFloat($(".put.note").eq(noteIngEq).attr('data-startmoment'));
                    var heightTo = noteIngHeight - notePerHeight;
                    $(".put.note").eq(noteIngEq).css('height', heightTo);
                    noteIngHeight = heightTo;
                    noteTarTopY = noteTarTopY + notePerHeight;
                    notePreEq = $(".put.note").eq(noteIngEq).index('.put') - 1;

                    // var preMoment = parseFloat($(".put").eq(notePreEq).attr('data-moment'));

                    // var tarMoment = preMoment + 0.5;
                    var tarHtml = getPutCon(noteIngMoment, noteIngMoment);
                    $(".put.note").eq(noteIngEq).before(tarHtml);
                    var coshr = parseFloat($(".put.note").eq(noteIngEq).attr('data-coshr'));
                    var tohr = coshr - 0.5;
                    $(".put.note").eq(noteIngEq).attr('data-coshr', tohr);
                    var toMoment = noteIngMoment + 0.5;

                    $(".put.note").eq(noteIngEq).attr('data-startmoment', toMoment);
                }
            }
        }
        // 拉下面
        if (noteExtDragging == 2) {

            var bottomToUp = tarBottomY - notePerHeight;
            var bottomToDown = tarBottomY + notePerHeight;
            // 往上拉
            if (mouseY < bottomToUp) {
                var heightTo = noteIngHeight - notePerHeight;
                if (heightTo > 0) {
                    $(".put.note").eq(noteIngEq).css('height', heightTo);
                    noteIngHeight = heightTo;
                    tarBottomY = tarBottomY - notePerHeight;
                    noteNextEq = $(".put.note").eq(noteIngEq).index('.put') + 1;

                    var coshr = parseFloat($(".put.note").eq(noteIngEq).attr('data-coshr'));

                    var tohr = coshr - 0.5;
                    $(".put.note").eq(noteIngEq).attr('data-coshr', tohr);
                    var tarMoment = parseFloat($(".put.note").eq(noteIngEq).attr('data-startmoment')) + coshr - 0.5;

                    var tarHtml = getPutCon(tarMoment, tarMoment);
                    $(".put.note").eq(noteIngEq).after(tarHtml);
                }

            }
            // 往下拉
            else if (mouseY > bottomToDown) {
                noteNextEq = $(".put.note").eq(noteIngEq).index('.put') + 1;
                if (!$(".put").eq(noteNextEq).hasClass('infoin')) {
                    if ($(".put").eq(noteNextEq).hasClass('duration')) {
                        var tarCancelEq = noteNextEq + 1;

                        if (!$(".put").eq(tarCancelEq).hasClass('infoin')) {

                            var heightTo = noteIngHeight + notePerHeight;
                            $(".put.note").eq(noteIngEq).css('height', heightTo);
                            noteIngHeight = heightTo;
                            tarBottomY = tarBottomY + notePerHeight;
                            $(".put").eq(tarCancelEq).replaceWith('');
                            var coshr = parseFloat($(".put.note").eq(noteIngEq).attr('data-coshr'));
                            var tohr = coshr + 0.5;
                            $(".put.note").eq(noteIngEq).attr('data-coshr', tohr);
                        }
                    } else {
                        if ($(".put").eq(noteNextEq).length > 0) {
                            var heightTo = noteIngHeight + notePerHeight;
                            $(".put.note").eq(noteIngEq).css('height', heightTo);
                            noteIngHeight = heightTo;
                            tarBottomY = tarBottomY + notePerHeight;
                            $(".put").eq(noteNextEq).replaceWith('');
                            var coshr = parseFloat($(".put.note").eq(noteIngEq).attr('data-coshr'));
                            var tohr = coshr + 0.5;
                            $(".put.note").eq(noteIngEq).attr('data-coshr', tohr);
                        }

                    }

                }
            }

        } else {}

        emptyInputSet();
    });

    var noteDragging = 0;
    $(".put.added").mousedown(function(event) {
        if (!event.target.matches(".drag_line") && !event.target.matches(".drag_line *") && !event.target.matches(".cancel_btn") && !event.target.matches(".cancel_btn *")) {
            noteDragging = 1;
            var mouseX = event.pageX,
                mouseY = event.pageY;
            $(this).css('opacity', '0.5');
            setNotePickerPut($(this), $("#notePicker"), mouseX, mouseY);
            $("#notePicker").show();
            noteCancel($(this));
        }
    });
    $(document).mousemove(function(event) {
        if (noteDragging == 1) {
            var mouseX = event.pageX,
                mouseY = event.pageY;
            pickerMove($("#notePicker"), mouseX, mouseY);
            putOverCheck($("#notePicker"));
        }
    });
    $(document).mouseup(function(event) {
        if (noteDragging == 1) {

            noteDragging = 0;
            $("#notePicker").hide();
            $(".put.added").css('opacity', '1');
            NotePutInfoSet($(".puts .put"), $("#notePicker"));
            $(".puts .put").removeClass('over');
        }
    });
}

// 路線 產生
function getRouteCon(time) {
    var x = [
        "<div class=\"route\">",
        "<div class=\"time\">" + time + "</div>",
        "<div class=\"icon-expand\"></div>",
        "<div class=\"routes_info\">",
        "<div class=\"hori_sep\"></div>",
        "<div class=\"steps\" id=\"stepsBlk\"></div>",
        "</div>",
        "</div>",
    ].join("");
    return x;
}

// 路線 STEP 設置
function stepSet(routes, tar) {

    var stepCon = "",
        tarEq = tar.index();
    for (var i = 0; i < routes[tarEq].legs[0].steps.length; i++) {
        var tarCon = getStepCon(routes[tarEq].legs[0].steps[i]);
        stepCon += tarCon;
    }

    tar.children('.routes_info').children('.steps').html(stepCon);
}

// 路線 STEP 產生
function getStepCon(step) {

    var transWay = "",
        transWayIconName = "",
        time = "",
        detailCon = "";


    transWay = step.travel_mode;
    if (transWay == "WALKING") {
        transWayIconName = "icon-walking";
    }
    if (transWay == "TRANSIT") {
        transWayIconName = "icon-transit";
    }
    if (transWay == "DRIVING") {
        transWayIconName = "icon-driving";
    }
    time = step.duration.text;
    detailCon = step.html_instructions;

    var x = [
        "<div class=\"step\">",
        "<div class=\"step_icon " + transWayIconName + "\"></div>",
        "<div class=\"time\">" + time + "</div>",
        "<div class=\"detail\">" + detailCon + "</div>",
        "</div>",
    ].join("");
    return x;
}

// 地圖樣式
function mapStyle() {
    var styles = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#ebe3cd"
        }]
    }, {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#523735"
        }]
    }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#f5f1e6"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#c9b2a6"
        }]
    }, {
        "featureType": "administrative.land_parcel",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#dcd2be"
        }]
    }, {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ae9e90"
        }]
    }, {
        "featureType": "administrative.neighborhood",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dfd2ae"
        }]
    }, {
        "featureType": "poi",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dfd2ae"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#93817c"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#a5b076"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#447530"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f5f1e6"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#fdfcf8"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f8c967"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#e9bc62"
        }]
    }, {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e98d58"
        }]
    }, {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#db8555"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#806b63"
        }]
    }, {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dfd2ae"
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#8f7d77"
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ebe3cd"
        }]
    }, {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dfd2ae"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#b9d3c2"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#92998d"
        }]
    }];
    return styles;
}

// 回到TOUR CLICK 啟動
function backToTourBtnClickAct() {
    $("#backToTourBtn").click(function(event) {
        $("#mapBlk").addClass('back');
        $("#tourBlk").show();
    });
}

// 路線CLICK啟動
function routeClickAct(routes) {

    $(".route").off();
    $(".route>.time").click(function(event) {
        if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
            $(this).parent().children('.icon-expand_open').addClass('icon-expand');
            $(this).parent().children('.icon-expand_open').removeClass('icon-expand_open');
            $(".route").removeClass('hide');
        } else {
            $(this).parent().children('.icon-expand').addClass('icon-expand_open');
            $(this).parent().children('.icon-expand').removeClass('icon-expand');
            $(".route").removeClass('active');
            $(".route").addClass('hide');
            $(this).parent().addClass('active');
            $(this).parent().removeClass('hide');
            stepSet(routes, $(this).parent());
        }
    });
}

// 交通ICON點擊啟動
function transitBtnClickAct(startLat, startlng, endlat, endlng) {
    $(".transit_btn").click(function(event) {
        $(".transit_btn").removeClass('active');
        $(this).addClass('active');

        if ($(this).hasClass('icon-transit')) {
            routeSet(startLat, startlng, endlat, endlng, "TRANSIT")
        }
        if ($(this).hasClass('icon-driving')) {
            routeSet(startLat, startlng, endlat, endlng, "DRIVING");
        }
        if ($(this).hasClass('icon-walking')) {
            routeSet(startLat, startlng, endlat, endlng, "WALKING");
        }

    });
}

function addNoteAct() {}

// add note 跟著螢幕動並刷新
function addNoteRefresh(tarInfo) {
    var tarOb = $("#addNoteBlk"),
        tarTop = tarInfo.offset().top,
        ingEq = tarInfo.index('.put.note'),
        tarHeight = tarInfo.height(),
        limitTop = $("#momentPutBlk").offset().top;
    if (tarInfo.hasClass('empty')) {
        $("#addNoteBlk>.note_blk>.note").val("");
    } else {
        $("#addNoteBlk>.note_blk>.note").val(tarInfo.children('.note').html());
    }
    if (limitTop < tarTop) {
        tarOb.css({
            top: tarTop - 47 + tarHeight / 2,
        });
    } else {
        tarOb.css({
            top: limitTop,
        });
    }
    $("#addNoteBlk").attr('data-ingnoteeq', ingEq);
    $("#addNoteBlk").show();
}

// tour 的note輸入時同步更新
function noteAreaTyping() {
    $('#noteArea').on('input', function() {
        $(".put.infoin.open").children('.info').children('.note').children('.content').html($(this).val());

        jsonEditRenew();
    });
}

// add note 輸入時動作
function addNoteTyping() {
    $("#addNoteArea").on('input', function() {
        var tarblkEq = parseInt($(this).parent().parent().attr('data-ingnoteeq'));
        if ($(".put.note").eq(tarblkEq).hasClass('adding')) {
            var startMoment = $(".put.note").eq(tarblkEq).attr('data-moment'),
                cosHr = 0.5,
                note = $(this).val(),
                tarHtml = getNoteBlkCon(startMoment, cosHr, note);
            $(".put.note").eq(tarblkEq).replaceWith(tarHtml);

            extendDrag();
        } else if ($(".put.note").eq(tarblkEq).hasClass('added')) {
            var note = $(this).val();
            $(".put.note").eq(tarblkEq).children('.note').html(note);
        }
        if ($(this).val() == "") {

        }
        jsonEditRenew();
    });
}

// 空白項目點擊功能
function emptyInputSet() {
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.empty").off();
    $(".edit_blk>.inner_blk>.date_blk>.put_blk>.inner_blk>.puts>.put.empty").click(function(event) {
        $(this).addClass('note');
        $(this).addClass('adding');
        addNoteRefresh($(this));
        $("#addNoteArea").focus();
    });
}

// 已放入TOUR 刪除
function tourCancel(tar) {
    var suppleCon = "",
        ingEq = tar.index('.puts .put'),
        cosHr = parseFloat(tar.attr('data-coshr')),
        suppleMomMin = parseFloat(tar.attr('data-startmoment')),
        suppleMomMax = suppleMomMin + cosHr - 0.5;

    if ($(".puts .put").eq(ingEq + 1).hasClass('duration')) {
        suppleMomMax += parseFloat($(".puts .put").eq(ingEq + 1).css('height')) / 52;
        $(".puts .put").eq(ingEq + 1).replaceWith("");
    }
    suppleCon = getPutCon(suppleMomMin, suppleMomMax);
    tar.replaceWith(suppleCon);
}

// duration 刪除
function durationCancel(tar) {
    var ingEq = tar.index('.puts>.put');
    var nextEq = ingEq + 1;
    var tarPutEq = $(".put").eq(nextEq);
    var tarMoment = parseFloat(tarPutEq.attr('data-moment'));
    var hr = parseInt(tar.height()) / 52;
    var max = tarMoment - 0.5;
    var min = max - hr + 0.5;

    var fillCon = getPutCon(min, max);
    tar.after(fillCon);
    tar.replaceWith("");
}

// note刪除
function noteCancel(tar) {
    var cosHr = parseFloat(tar.attr('data-coshr')),
        min = parseFloat(tar.attr('data-startmoment')),
        max = min + cosHr - 0.5,
        fillCon = getPutCon(min, max);
    tar.replaceWith(fillCon);
}

// 已放入TOUR 清空
function tourEmptify() {
    var tourNum = 0;
    for (var i = 0; $(".put.infoin").eq(i).length > 0; i++) {
        tourNum++;
    }
    for (var i = 0; i < tourNum; i++) {
        tourCancel($(".put.infoin").eq(0));
    }
}

// DURATION 清空
function durationEmptify() {
    var duraNum = 0;
    for (var j = 0; $(".put.duration").eq(j).length > 0; j++) {
        duraNum++;
    }
    for (var i = 0; i < duraNum; i++) {
        durationCancel($(".put.duration").eq(0));
    }
}

// NOTE 清空
function noteEmptify() {
    var noteNum = 0;
    for (var i = 0; $(".put.added").eq(i).length > 0; i++) {
        noteNum++;
    }
    for (var i = 0; i < noteNum; i++) {
        noteCancel($(".put.added").eq(0));
    }
}

// 空白時刻 產生
function getPutCon(momMin, momMax) {
    var x = "",
        addClass;
    if (momMin > momMax) {
        for (var putCoun = momMin; putCoun < 24; putCoun = putCoun + 0.5) {
            if (putCoun % 1 == 0) {
                addClass = "full";
            } else if (putCoun % 1 == 0.5) {
                addClass = "half";
            }
            x += "<div class=\"put empty " + addClass + "\" data-moment=\"" + putCoun + "\"></div>";
        }
        for (var putCoun = 0; putCoun <= momMax; putCoun = putCoun + 0.5) {
            if (putCoun % 1 == 0) {
                addClass = "full";
            } else if (putCoun % 1 == 0.5) {
                addClass = "half";
            }
            x += "<div class=\"put empty " + addClass + "\" data-moment=\"" + putCoun + "\"></div>";
        }
    } else if (momMin < momMax) {
        for (var putCoun = momMin; putCoun <= momMax; putCoun = putCoun + 0.5) {
            if (putCoun % 1 == 0) {
                addClass = "full";
            } else if (putCoun % 1 == 0.5) {
                addClass = "half";
            }
            x += "<div class=\"put empty " + addClass + "\" data-moment=\"" + putCoun + "\"></div>";
        }
    } else if (momMin == momMax) {
        var putCoun = momMin;
        if (putCoun % 1 == 0) {
            addClass = "full";
        } else if (putCoun % 1 == 0.5) {
            addClass = "half";
        }
        x += "<div class=\"put empty " + addClass + "\" data-moment=\"" + putCoun + "\"></div>";
    } else {
        console.log("momMin,momMax set wrong");
    }
    return x;
}

// 還沒射日期點擊
function goSetDateClick() {
    $(".not_set_yet").click(function(event) {
        $('html,body').animate({
            scrollTop: $(".plan_set_blk").offset().top
        }, 400);
    });
}

// 檢查日期是否輸入完成
function dateInputCheck() {
    var startText = $("#startDate").val();
    var toText = $("#toDate").val();
    var daysBetween = daydiff(parseDate(startText), parseDate(toText));
    if (startText == "" || toText == "" || daysBetween < 0) {
        $(".not_set_yet").show();
        $(".date_show_blk").hide();
    } else if (startText != "" && toText != "" && daysBetween >= 0) {
        $(".not_set_yet").hide();
        $(".date_show_blk").show();

    }
}

// 選擇日期後檢查
function dateTypeCheck() {
    $('#startDate').on("change paste keyup", function() {
        dateInputCheck();
        jsonDateRenew();
        planIng.ingDay = 0;
        dateShowBlkCheck();
        tourEmptify();
        noteEmptify();
        planTourInitSet();
        planNoteInitSet();
        addressCheck();
        extendDrag();
    });
    $('#toDate').on("change paste keyup", function() {
        dateInputCheck();
        jsonDateRenew();
        planIng.ingDay = 0;
        dateShowBlkCheck();
        tourEmptify();
        noteEmptify();
        planTourInitSet();
        planNoteInitSet();
        addressCheck();
        extendDrag();
    });
}

// 行程內 TOUR 初始化
function planTourInitSet() {
    var tarDay,
        inputCon,
        tarDay = planIng.days[planIng.ingDay];
    for (var i = tarDay.tours.length - 1; i >= 0; i--) {
        var tarImgUrl = tarDay.tours[i].photoUrl,
            tarName = tarDay.tours[i].name,
            tarPlace = tarDay.tours[i].place,
            tarHr = tarDay.tours[i].hr,
            tarCosHr = tarDay.tours[i].cosHr,
            tarLocate = tarDay.tours[i].locate,
            tarId = tarDay.tours[i].id,
            tarNote = tarDay.tours[i].note,
            tarHeight = tarCosHr * 2 * 26,
            tarPrice = tarDay.tours[i].price,
            tarLink = tarDay.tours[i].link,
            tarStartMoment = tarDay.tours[i].startMoment,
            tarLat = tarDay.tours[i].lat,
            tarLng = tarDay.tours[i].lng,
            tarPutEq = tarStartMoment * 2;
        inputCon = getPutInfoCon(tarHeight, tarId, tarHr, tarImgUrl, tarName, tarPlace, tarNote, tarPrice, tarLink, tarCosHr, tarLocate, tarStartMoment, tarLat, tarLng);

        for (var cancelEq = tarPutEq; cancelEq < tarPutEq + tarCosHr * 2; cancelEq++) {
            $(".put").eq(tarPutEq).replaceWith("");
        }
        $(".put").eq(tarPutEq - 1).after(inputCon);
    }
}

// 行程內 NOTE 初始化
function planNoteInitSet() {
    var notes = planIng.days[planIng.ingDay].notes;
    var tarCon = "";
    for (var i = 0; i < notes.length; i++) {
        tarCon = getNoteBlkCon(notes[i].startmoment, notes[i].coshr, notes[i].content);
        PutByMoment(tarCon, notes[i].startmoment, notes[i].coshr);
    }
}

// 用 MOMENT 刪除 PUT
function PutByMoment(tarCon, startMoment, coshr) {
    var tarPutEq = getTarPutEqByMoment(startMoment);
    $(".puts>.put").eq(tarPutEq).before(tarCon);
    var cancelTimes = coshr * 2;
    for (var i = 0; i < cancelTimes; i++) {
        $(".puts>.put").eq(tarPutEq + 1).replaceWith("");
    }
}

// 用 MOMENT 找出 目標PUT EQ值
function getTarPutEqByMoment(moment) {
    var tarPutEq = -1;
    for (var i = 0; $(".puts>.put").eq(i).length > 0; i++) {
        if ($(".puts>.put").eq(i).attr('data-moment') == moment) {
            tarPutEq = i;
        }
    }
    if (tarPutEq < 0) {
        return "find no put or already used";
    } else {
        return tarPutEq;
    }
}

// 產生note html
function getNoteBlkCon(startMoment, cosHr, note) {
    var x = [
        "<div class=\"note put added\" data-startmoment=\"" + startMoment + "\" data-coshr=\"" + cosHr + "\" style=\"height:" + cosHr * 2 * 26 + "\">",
        "<div class=\"note\">" + note + "</div>",
        '<div class="drag_line top">',
        '<div class="drag_btn icon-drag"></div>',
        '</div>',
        '<div class="drag_line bottom">',
        '<div class="drag_btn icon-drag"></div>',
        '</div>',
        '<div class="cancel_btn icon-cancel"></div>',
        "</div>",
    ].join("");
    return x;
}

// 切換日子點擊初始化
function daySwitchClick() {
    $(".date_show_blk>.switch_btn").off();
    $(".date_show_blk>.switch_btn").click(function(event) {

        if ($(this).hasClass('left')) {
            planIng.ingDay--;

            tourEmptify();
            noteEmptify();
            planTourInitSet();
            planNoteInitSet();
            addressCheck();
            extendDrag(planIng);

            dateShowBlkCheck();
        }
        if ($(this).hasClass('right')) {
            planIng.ingDay++;

            tourEmptify();
            noteEmptify();
            planTourInitSet();
            planNoteInitSet();
            addressCheck();
            extendDrag(planIng);
            dateShowBlkCheck();

        }
    });
}

// 切換日子區域按鈕確認
function dateShowBlkCheck() {
    $("#dateShowBlk>.day>.number").html(planIng.ingDay + 1);
    $("#dateShowBlk>.date").html(planIng.days[planIng.ingDay].date);

    if (planIng.days[planIng.ingDay - 1] == undefined) {
        $(".date_show_blk>.switch_btn.left").hide();
    } else {
        $(".date_show_blk>.switch_btn.left").show();

    }
    if (planIng.days[planIng.ingDay + 1] == undefined) {
        $(".date_show_blk>.switch_btn.right").hide();
    } else {
        $(".date_show_blk>.switch_btn.right").show();

    }
}

// 編輯 PLAN 名稱 按鈕點擊
function planNameEdit() {
    var confirmBtn = $(".rename_plan_blk>.content_blk>.ripple_blk>.ripple");
    var closeBtn = $(".rename_plan_blk>.content_blk>.close_btn");
    var closeBg = $(".rename_plan_blk>.blur_bg");
    var valBlk = $(".rename_plan_blk>.content_blk>input");
    $("#planNameEditBtn").click(function(event) {
        $(".rename_plan_blk").show();
    });
    closeBtn.click(function(event) {
        $(".rename_plan_blk").hide();
    });
    closeBg.click(function(event) {
        $(".rename_plan_blk").hide();
    });
    confirmBtn.click(function(event) {
        $(".rename_plan_blk").hide();
        if (valBlk.val() == "") {
            $("#planName").html("NEW PLAN");
        } else if (valBlk.val() != "" && valBlk.val() != "NaN") {
            $("#planName").html(valBlk.val());
        }
        jsonPlanNameRenew();
    });
}

// 搜尋 WISH 輸入
function wishListSearchType() {
    $("#wishListSearch").on('input', function() {
        wishListSearch($(this).val());
    });
}

// 搜尋 WISH
function wishListSearch(input) {
    var wish = $(".edit_blk>.inner_blk>.tour_blk>.tours>.tour_pick_blk>.tour_pick");
    var tourNum = 0;
    for (var i = 0; wish.eq(i).length > 0; i++) {
        var show = 0;
        if (wish.eq(i).children('.card').children('.name').children('p').html().toLowerCase().indexOf(input) >= 0) {
            show = 1;
        }
        if (wish.eq(i).children('.card').children('.place').html().toLowerCase().indexOf(input) >= 0) {
            show = 1;
        }
        if (wish.eq(i).children('.card').children('.duration').html().toLowerCase().indexOf(input) >= 0) {
            show = 1;
        }
        if (wish.eq(i).children('.card').children('.price').children('.country').html().toLowerCase().indexOf(input) >= 0) {
            show = 1;
        }
        if (wish.eq(i).children('.card').children('.price').children('.number').html().toLowerCase().indexOf(input) >= 0) {
            show = 1;
        }
        if (show == 1) {
            wish.eq(i).show();
        } else {
            wish.eq(i).hide();
        }
    }

    if (input == "") {
        wish.show();
    }
}

// CHECKLIST 新增
function addNewTask() {
    $("#newTask").keypress(function(event) {
        var key = event.which;
        if (key == 13 && $(this).val() != "") {
            var tarBlk = $(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists");
            var tarVal = newChecklist($(this).val());
            tarBlk.append(tarVal);
            $(this).val("");
            checkboxClick();
            checkListCancel();

            jsonCheckListRenew();
        }
    });
}

// CHECKLIST 產生
function newChecklist(val) {
    var emptyUrl = "/static/img/addfriend_s.png";
    var x = [
        "<div class=\"checklist\">",
        "<span class=\"checkbox icon-tick\"></span>",
        "<input type=\"text\" class=\"content\" value=\"" + val + "\">",
        "<span class=\"date_set\"></span>",
        "<span class=\"assign\"></span>",
        "<span class=\"cancel icon-cancel\"></span>",
        "<span class=\"friend\" style=\"background-image: url(" + emptyUrl + ");\"></span>",
        "</div>",
    ].join("");
    return x;
}

// CHECKLIST 勾選
function checkboxClick() {
    $(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists>.checklist>.checkbox").off();
    $(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists>.checklist>.checkbox").click(function(event) {
        $(this).toggleClass('done');
        jsonCheckListRenew();
    });
}

// CHECKLIST 刪除
function checkListCancel() {
    $(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists>.checklist>.cancel").off();
    $(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists>.checklist>.cancel").click(function(event) {
        $(this).parent('.checklist').remove();
        jsonCheckListRenew();
    });
}

// JSON PLAN 日期 更新
function jsonDateRenew() {
    var oriStart = planIng.startDay;
    var oriEnd = planIng.endDay;
    var toStart = $("#startDate").val();
    var toEnd = $("#toDate").val();
    var oriDays = planIng.days;

    planIng.startDay = toStart;
    planIng.endDay = toEnd;
    planIng.days = [];

    var fullStartDay = dateToFullYear(toStart);
    var fullEndDay = dateToFullYear(toEnd);
    var ingDay = fullStartDay;
    var dayNum = 1;

    for (var i = 0; ingDay != fullEndDay && i < 500; i++) {
        ingDay = getNextFullYear(ingDay, 1);
        dayNum++;
    }

    for (var i = 0; i < dayNum; i++) {
        planIng.days[i] = [];
        planIng.days[i].date = getNextFullYear(fullStartDay, i);
        planIng.days[i].notes = [];
        planIng.days[i].tours = [];
    }

    for (var i = 0; i < oriDays.length; i++) {
        for (var j = 0; j < planIng.days.length; j++) {
            if (planIng.days[j].date == oriDays[i].date) {
                planIng.days[j] = oriDays[i];
            }
        }
    }
}

// JSON CHECKLIST 更新
function jsonCheckListRenew() {
    planIng.checkList = [];
    var checkList = $(".plan_set_blk>.inner_blk>.checklist_blk>.info>.checklists>.checklist");
    var num = 0;
    for (var i = 0; checkList.eq(i).length > 0; i++) {
        num++;
    }
    for (var i = 0; i < num; i++) {
        planIng.checkList[i] = [];
        if (checkList.eq(i).children('.checkbox').hasClass('done')) {
            planIng.checkList[i].finish = true;
        } else {
            planIng.checkList[i].finish = false;
        }

        planIng.checkList[i].content = checkList.eq(i).children('.content').val();

        planIng.checkList[i].assignId = checkList.eq(i).children('.friend').attr('data-id');


    }
}

// JSON 名稱 更新
function jsonPlanNameRenew() {
    planIng.planName = $("#planName").html();
}

// JSON 編輯區域 更新
function jsonEditRenew() {
    planIng.days[planIng.ingDay].notes = [];
    var addedNum = 0;
    for (var i = 0; $(".put.added").eq(i).length > 0; i++) {
        addedNum++;
    }
    for (var i = 0; i < addedNum; i++) {
        var tarAdded = $(".put.added").eq(i);
        planIng.days[planIng.ingDay].notes[i] = [];
        planIng.days[planIng.ingDay].notes[i].startmoment = tarAdded.attr('data-startmoment');
        planIng.days[planIng.ingDay].notes[i].coshr = tarAdded.attr('data-coshr');
        planIng.days[planIng.ingDay].notes[i].content = tarAdded.children('').html();
    }



    planIng.days[planIng.ingDay].tours = [];
    var tourNum = 0;
    for (var i = 0; $(".put.infoin").eq(i).length > 0; i++) {
        tourNum++;
    }
    for (var i = 0; i < tourNum; i++) {
        var tarTour = $(".put.infoin").eq(i);
        planIng.days[planIng.ingDay].tours[i] = [];
        planIng.days[planIng.ingDay].tours[i].id = tarTour.attr('data-id');
        planIng.days[planIng.ingDay].tours[i].hr = tarTour.attr('data-hr');
        planIng.days[planIng.ingDay].tours[i].cosHr = tarTour.attr('data-coshr');
        planIng.days[planIng.ingDay].tours[i].price = tarTour.attr('data-price');
        planIng.days[planIng.ingDay].tours[i].link = tarTour.attr('data-link');
        planIng.days[planIng.ingDay].tours[i].locate = tarTour.attr('data-locate');
        var photoUrl = tarTour.children('.photo').css('background-image');
        photoUrl = photoUrl.replace('url("', '').replace('")', '');
        planIng.days[planIng.ingDay].tours[i].photoUrl = photoUrl;
        planIng.days[planIng.ingDay].tours[i].name = tarTour.children('.info').children('.name').html();
        planIng.days[planIng.ingDay].tours[i].place = tarTour.children('.info').children('.place').children('.content').html();
        planIng.days[planIng.ingDay].tours[i].note = tarTour.children('.info').children('.note').children('.content').html();
        planIng.days[planIng.ingDay].tours[i].startMoment = tarTour.attr('data-startmoment');
        planIng.days[planIng.ingDay].tours[i].lat = tarTour.attr('data-lat');
        planIng.days[planIng.ingDay].tours[i].lng = tarTour.attr('data-lng');

    }
}

// 測試按鈕
jQuery(document).ready(function($) {
    $("#testBtn").click(function(event) {
        console.log(dateToFullYear("12/25/2015"));
    });
    $("#testBtn2").click(function(event) {
        console.log(planIng);
    });
});
