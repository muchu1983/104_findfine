
(function($) {

    $(document).ready(initLogin);

    function initLogin() {


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
    };

})(jQuery);
