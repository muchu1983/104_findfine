(function($) {

    $(document).ready(initRegister);

    function initRegister() {

        $('#loginBtn').show();
        $("#headBtn").hide();
        birthLiSet();
        $('#loginBtn').click(function(event) {
            window.location = "/account/login";
        });
        $('#noLogHeadBtn').click(function(event) {
            window.location = "/account/login";
        });
        $('#logoTop').click(function(event) {
            window.location = "/";
        });


        // 單選按鈕點擊 @Q@ davidturtle
        // singleSelClick("select");

        cusSingleSelClick("#titleBlk", "title");
        cusSingleSelClick("#genedrBlk", "gender");
        cusSingleSelClick("#yearBlk", "year");
        cusSingleSelClick("#monthBlk", "month");
        cusSingleSelClick("#dayBlk", "day");

        // $("#user_birthday").datepicker({
        //     dateFormat: "yy-mm-dd"
        // });
        $("#registreBtn").click(function() {
            //收集註冊資料
            var strUserEmail = $("#user_email").val();
            var strUserPassword = $("#user_password").val();
            var strUserTitle = $("#user_title").val();
            var strUserFamilyName = $("#user_family_name").val();
            var strUserGivenName = $("#user_given_name").val();
            var strUserGender = $("#user_gender").val();
            var strUserBirthday = $("#user_birthday").val();
            var strUserNationality = $("#user_nationality").val();
            var strUserContactNumber = $("#user_contact_number").val();
            var dicRegisterData = {
                "user_email": strUserEmail,
                "user_password": strUserPassword,
                "user_title": strUserTitle,
                "user_family_name": strUserFamilyName,
                "user_given_name": strUserGivenName,
                "user_gender": strUserGender,
                "user_birthday": strUserBirthday,
                "user_nationality": strUserNationality,
                "user_contact_number": strUserContactNumber,
                "csrfmiddlewaretoken": strCsrfToken
            };
            //送出註冊資料
            $.post("/account/register", dicRegisterData, function(jsonResp) {
                console.log(jsonResp)
                $("div.registerStatusDiv").html(jsonResp["register_status"])
                if (jsonResp["register_status"] == "register success.") {
                    window.location = "/account/login"
                }
            }, "json");
        });

        initTopSearch();
    };

})(jQuery);


function birthLiSet() {
    var yearCon = "",
        monthCon = "",
        dayCon = "";

    yearCon = numberLiGernerate(1900, 2016);
    monthCon = numberLiGernerate(1, 12);
    dayCon = numberLiGernerate(1, 31);

    $("#yearBlk .menu").append(yearCon);
    $("#monthBlk .menu").append(monthCon);
    $("#dayBlk .menu").append(dayCon);

    $("#monthBlk .value").bind("DOMSubtreeModified", function() {
        tarVal = dayBlkReset($("#yearBlk .value").html(), $("#monthBlk .value").html());
        $("#dayBlk>.menu>li").replaceWith("");
        $("#dayBlk>.menu").append(tarVal);
        cusSingleSelClick("#dayBlk", "day");
    });
    $("#yearBlk .value").bind("DOMSubtreeModified", function() {
        tarVal = dayBlkReset($("#yearBlk .value").html(), $("#monthBlk .value").html());
        $("#dayBlk>.menu>li").replaceWith("");
        $("#dayBlk>.menu").append(tarVal);
        cusSingleSelClick("#dayBlk", "day");

    });
}

function numberLiGernerate(from, to) {
    var x = ""
    for (var i = from; i <= to; i++) {
        x += "<li>" + i + "</li>";
    }
    return x;
}

function dayBlkReset(year, month) {
    var x = "";
    switch (month) {
        case "1":
            x = numberLiGernerate(1, 31);
            break;
        case "2":
            x = numberLiGernerate(1, 28);
            break;
        case "3":
            x = numberLiGernerate(1, 31);
            break;
        case "4":
            x = numberLiGernerate(1, 30);
            break;
        case "5":
            x = numberLiGernerate(1, 31);
            break;
        case "6":
            x = numberLiGernerate(1, 30);
            break;
        case "7":
            x = numberLiGernerate(1, 31);
            break;
        case "8":
            x = numberLiGernerate(1, 31);
            break;
        case "9":
            x = numberLiGernerate(1, 30);
            break;
        case "10":
            x = numberLiGernerate(1, 31);
            break;
        case "11":
            x = numberLiGernerate(1, 30);
            break;
        case "12":
            x = numberLiGernerate(1, 31);
            break;
    }
    if (month == 2 && year % 4 == 0) {
        x = numberLiGernerate(1, 29);
    }
    return x;
}
