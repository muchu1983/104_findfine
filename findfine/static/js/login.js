(function($){
    
    $(document).ready(initLogin);
    
    function initLogin(){
        $("#registerBtn").click(function(){
            window.location = "/account/register"
        });
    };
    
})(jQuery);
