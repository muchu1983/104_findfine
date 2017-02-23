jQuery(document).ready(function($) {
    var tarBg = $("#movingBg");
    var body = document.body,
        html = document.documentElement;

    var pageHeight = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    var sHeight = window.innerHeight;

    var moveBgHeight = tarBg.height();

    var scrollingScale = moveBgHeight / (pageHeight + sHeight + 1000);

    $(window).scroll(function(event) {
    	$("#paragraph").addClass('active');
        var x = $(window).scrollTop();
        var move = x * scrollingScale * (-1);
        tarBg.css('top', move);
    });

    $("body").delay(700).queue(function(next) {
        $("#monthTitle").addClass('active');
        next();
    });


});
