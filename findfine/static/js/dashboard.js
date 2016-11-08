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
            var strCurrentMonthImgUrl = $("#currentMonthImgUrl").val();
            var strCurrentMonthTitle = $("#currentMonthTitle").val();
            var strCurrentMonthContent = $("#currentMonthContent").val();
            dicConfigData = {
                "current_month_img_url":strCurrentMonthImgUrl,
                "current_month_title":strCurrentMonthTitle,
                "current_month_content":strCurrentMonthContent,
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
        $("#searchTripBtn").click(function(){
            searchKeyword();
        });
    };
    
    //搜尋含有 keyword 的 trip
    function searchKeyword() {
        //
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
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];
                strTripOptionHtml = getTripOptionHtml(dicTripData["strTitle"], dicTripData["intId"]);
                $("#searchResultSelect").append(strTripOptionHtml);
            };
        });
    };
    
    //組成 select option 的 html 字串
    function getTripOptionHtml(strTitle, intId){
        var strTripOptionHtml = [
            "<option value=\"" + intId + "\">",
            strTitle,
            "</option>"
        ].join("");
        return strTripOptionHtml;
    };
    
})(jQuery);
