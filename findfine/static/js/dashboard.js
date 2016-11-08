(function($){
    
    $(document).ready(initDashboard);
    
    function initDashboard(){
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
    
})(jQuery);
