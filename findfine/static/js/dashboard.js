(function($){
    
    $(document).ready(initDashboard);
    
    //初始化 dashboard
    function initDashboard(){
        initRecommendedTrip();
        //nav tab
        $("#nav_tabs").tabs();
        $("#nav_tabs li").removeClass("ui-corner-top");
        //儲存設定
        $("#saveConfigBtn").click(function(){
            //收集管理資料
            var strAdminPassword = $("#admin_password").val();
            //收集每月文章資料
            var strCurrentMonthImgUrl = $("#currentMonthImgUrl").val();
            var strCurrentMonthTitle = $("#currentMonthTitle").val();
            var strCurrentMonthContent = $("#currentMonthContent").val();
            //收集推薦行程資料
            var strRecommendedTripId = "";
            $("select#pickedResultSelect option").each(function() {
                strIntId = $(this).val();
                strRecommendedTripId += strIntId + ",";
            });
            //組合設定資料
            dicConfigData = {
                "current_month_img_url":strCurrentMonthImgUrl,
                "current_month_title":strCurrentMonthTitle,
                "current_month_content":strCurrentMonthContent,
                "recommended_trip_id":strRecommendedTripId,
                "admin_password":strAdminPassword,
                "csrfmiddlewaretoken":strCsrfToken
            };
            //送出管理資料
            $.post("/dashboard/config", dicConfigData, function(jsonResp){
                console.log(jsonResp)
                $("div.dashboardStatusDiv").html(jsonResp["config_status"])
            }, "json");
        });
    };
    
    //初始化 推薦行程
    function initRecommendedTrip(){
        //搜尋
        $("#searchTripBtn").click(function(){
            searchKeyword();
        });
        //選取
        $("#pickBtn").click(function(){
            $("select#searchResultSelect option:selected").each(function() {
                strTitle = $(this).text();
                strIntId = $(this).val();
                strPickedOptionHtml = getTripOptionHtml(strTitle, strIntId);
                console.log(strPickedOptionHtml);
                //加入右方 option
                $("#pickedResultSelect").append(strPickedOptionHtml);
                //移除左方 option
                $(this).remove()
            });
        });
        //取消選取
        $("#unpickBtn").click(function(){
            $("select#pickedResultSelect option:selected").each(function() {
                strTitle = $(this).text();
                strIntId = $(this).val();
                strUnpickedOptionHtml = getTripOptionHtml(strTitle, strIntId);
                console.log(strUnpickedOptionHtml);
                //加入右方 option
                $("#searchResultSelect").append(strUnpickedOptionHtml);
                //移除左方 option
                $(this).remove()
            });
        });
    };
    
    //搜尋含有 keyword 的 trip
    function searchKeyword() {
        //filter api
        var strKeyword = $("#keywordInput").val();
        var strFilterQueryUrl = "/trip/filter?";
        //keyword
        if (strKeyword != "") {
            strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + strKeyword;
        };
        console.log(strFilterQueryUrl);
        $.getJSON(strFilterQueryUrl, function(jsonResp) {
            console.log(jsonResp);
            //trip data
            var lstDicTripData = jsonResp["trip"];
            $("#searchResultSelect").html("");
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];
                strTripOptionHtml = getTripOptionHtml(dicTripData["strTitle"], dicTripData["intId"]);
                $("#searchResultSelect").append(strTripOptionHtml);
            };
        });
    };
    
    //讀取目前的推薦行程
    function loadRecommended() {
        //filter api
        var strKeyword = $("#keywordInput").val();
        var strFilterQueryUrl = "/trip/filter?";
        //keyword
        if (strKeyword != "") {
            strFilterQueryUrl = strFilterQueryUrl + "&keyword=" + strKeyword;
        };
        console.log(strFilterQueryUrl);
        $.getJSON(strFilterQueryUrl, function(jsonResp) {
            console.log(jsonResp);
            //trip data
            var lstDicTripData = jsonResp["trip"];
            $("#searchResultSelect").html("");
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];
                strTripOptionHtml = getTripOptionHtml(dicTripData["strTitle"], dicTripData["intId"]);
                $("#searchResultSelect").append(strTripOptionHtml);
            };
        });
    };
    
    //組成 select option 的 html 字串
    function getTripOptionHtml(strTitle, strIntId){
        var strTripOptionHtml = [
            "<option value=\"" + strIntId + "\">",
            strTitle,
            "</option>"
        ].join("");
        return strTripOptionHtml;
    };
    
})(jQuery);
