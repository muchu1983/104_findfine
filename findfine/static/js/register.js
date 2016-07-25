(function($){
    
    $(document).ready(initRegister);
    
    function initRegister(){
        $("#user_birthday").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $("#registreBtn").click(function(){
            //收集註冊資料
            var strUserEmail = $("#user_email").val();
            var strUserPassword = $("#user_password").val();
            var strUserTitle = $("input[name=user_title]:checked").val();
            var strUserFamilyName = $("#user_family_name").val();
            var strUserGivenName = $("#user_given_name").val();
            var strUserGender = $("input[name=user_gender]:checked").val();
            var strUserBirthday = $("#user_birthday").val();
            var strUserNationality = $("#user_nationality").val();
            var strUserContactNumber = $("#user_contact_number").val();
            var dicRegisterData = {
                "user_email":strUserEmail,
                "user_password":strUserPassword,
                "user_title":strUserTitle,
                "user_family_name":strUserFamilyName,
                "user_given_name":strUserGivenName,
                "user_gender":strUserGender,
                "user_birthday":strUserBirthday,
                "user_nationality":strUserNationality,
                "user_contact_number":strUserContactNumber,
                "csrfmiddlewaretoken":strCsrfToken
            };
            //送出註冊資料
            $.post("/account/register", dicRegisterData, function(jsonResp){
                console.log(jsonResp)
                $("div.registerStatusDiv").html(jsonResp["register_status"])
                if (jsonResp["register_status"] == "register success."){
                    window.location = "/account/login"
                }
            }, "json");
        });
    };
    
})(jQuery);
