(function($){
    
    $(document).ready(initLogin);
    
    function initLogin(){
        $("#registerBtn").click(function(){
            window.location = "/account/register"
        });
        $("#loginBtn").click(function(){
            //收集登入資料
            var strUserEmail = $("#user_email").val();
            var strUserPassword = $("#user_password").val();
            dicLoginData = {
                "user_email":strUserEmail,
                "user_password":strUserPassword,
                "csrfmiddlewaretoken":strCsrfToken
            };
            //送出登入資料
            $.post("/account/login", dicLoginData, function(jsonResp){
                console.log(jsonResp)
                $("div.loginStatusDiv").html(jsonResp["login_status"])
                if (jsonResp["login_status"] == "login success."){
                    window.location = "/account/userinfo"
                }
            }, "json");
        });
    };
    
})(jQuery);
