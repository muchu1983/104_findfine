(function($) {

    $(document).ready(initLogin);

    function initLogin() {

        $(".waiting_fullblk").hide();
        $('#register').show();
        $("#headBtn").hide();
        $("#registerBtn").click(function() {
            window.location = "/account/register"
        });
        $("#register").click(function() {
            window.location = "/account/register"
        });
        $('#noLogHeadBtn').click(function(event) {
            window.location = "/account/login";
        });
        $('#logoTop').click(function(event) {
            window.location = "/";
        });

        // remember點選 @TODO 後台功能要接上
        $("#rememberBtn").click(function(event) {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }

        });
        initTopSearch();
        $("#loginBtn").click(function() {

            $(".waiting_fullblk").show();            
            $("body").addClass('waiting_body');

            //收集登入資料
            var strUserEmail = $("#user_email").val();
            var strUserPassword = $("#user_password").val();
            dicLoginData = {
                "user_email": strUserEmail,
                "user_password": strUserPassword,
                "csrfmiddlewaretoken": strCsrfToken
            };
            //送出登入資料
            $.post("/account/login", dicLoginData, function(jsonResp) {


                console.log(jsonResp)
                $("div.loginStatusDiv").html(jsonResp["login_status"])
                if (jsonResp["login_status"] == "login success.") {
                    window.location = "/"
                }else{

                    alert(jsonResp["login_status"]);
                    
                    $(".waiting_fullblk").hide();            
                    $("body").removeClass('waiting_body');
                }
            }, "json");
        });


    };

})(jQuery);
