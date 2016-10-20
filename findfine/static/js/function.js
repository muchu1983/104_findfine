

// 飛機飛呀飛
function planeFly(sec){
    var ms = document.querySelectorAll('.flying_plane');
    var defaultTiming = {
        duration: sec,
        iterations: 1,
        fill: 'both',
        easing: 'ease-in-out'
    };

    if (ms[0].style.motionOffset !== undefined) {
        var easing = 'cubic-bezier(.645,.045,0.355,1)';

        ms[0].animate([{
            motionOffset: 0,
            motionRotation: 'auto'
        }, {
            motionOffset: '100%',
            motionRotation: 'auto'
        }], defaultTiming);
    } else {
        document.documentElement.className = 'no-motionpath'
    }
}

// 加至wishlist按鈕點擊
function addToWishlistBtnClick(){
    $(".add_wish_btn").click(function(event) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else{
            $(this).addClass('active');
        }
    });
}

function topNavDown(distance){
        $(window).scroll(function() {
        var top_position = $(window).scrollTop();
        if (top_position > distance) {
            $("#page-top .navbar-custom").addClass('down');
        }else{
            $("#page-top .navbar-custom").removeClass('down');

        }
    });
}