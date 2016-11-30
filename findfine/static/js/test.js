jQuery(document).ready(function($) {
    var dragging = 0,
        topAj = 0,
        leftAj = 0,
        oriTop = 0,
        oriLeft = 0;
    $(".drag_ele").mousedown(function(event) {
        if ($(this).hasClass('dragging')) {

        } else {
            $(this).addClass('dragging');
            oriTop = $(this).offset().top;
            oriLeft = $(this).offset().left;
            topAj = event.pageY - oriTop;
            leftAj = event.pageX - oriLeft;
        }
    });
    $(".drag_ele").mousemove(function(event) {
        if ($(this).hasClass('dragging')) {
            $(this).css({
                top: event.pageY - topAj,
                left: event.pageX - leftAj,
                "z-index": 500,
            });
            var overTar = $(".put_get_blk");
            for (var putGetEq = 0; overTar.eq(putGetEq).length > 0; putGetEq++) {
                var overBoo = centerColidCheck($(this), overTar.eq(putGetEq));
                if (overBoo == true) {
                    // console.log(putGetEq,"over");
                    overTar.eq(putGetEq).addClass('over');
                } else {
                    overTar.eq(putGetEq).removeClass('over');
                }
            }

        }
    });
    $(".drag_ele").mouseup(function(event) {

        $(this).removeClass('dragging');
        $(this).addClass('backing');
        $(this).css({
            top: oriTop + "px",
            left: oriLeft + "px",
            "z-index": 0,
        });
        $(this).delay(300).queue(function(next) {
            $(this).removeClass('backing');
            next();
        });

        var overTar = $(".put_get_blk");
        overTar.removeClass('over');
        for (var putGetEq = 0; overTar.eq(putGetEq).length > 0; putGetEq++) {
            var overBoo = centerColidCheck($(this), overTar.eq(putGetEq));
            if (overBoo == true) {
                // console.log(putGetEq,"over");
                console.log("replace");
                infoPutIn($(this),overTar.eq(putGetEq));
            } else {
                
            }
        }
    });
});

function centerColidCheck(upperObj, backObj) {
    var ucX = upperObj.offset().left + upperObj.outerWidth() / 2,
        ucY = upperObj.offset().top + upperObj.outerHeight() / 2,
        bLowX = backObj.offset().left,
        bTopX = backObj.offset().left + backObj.outerWidth(),
        bLowY = backObj.offset().top,
        bTopY = backObj.offset().top + backObj.outerHeight();
    if (bTopX > ucX && ucX > bLowX && bTopY > ucY && ucY > bLowY) {
        return true;
    } else {
        return false;
    }
}

function infoPutIn(infoObj,tarObj){
	var tarCon = infoObj.html();
	tarObj.html(tarCon);
}