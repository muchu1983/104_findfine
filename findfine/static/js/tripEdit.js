(function($){
    $(document).ready(initTripEdit);
    function initTripEdit(){
        
        $('#external-events .fc-event').each(function() {
            $(this).data('event', {
                title: $.trim($(this).text()), 
                stick: true 
            });
            $(this).draggable({
                zIndex: 999,
                revert: true,
                revertDuration: 0
            });
        });
        
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            droppable: true,
            drop: function() {
                if ($('#drop-remove').is(':checked')) {
                    $(this).remove();
                }
            }
        });
        
        //顯示wishList
        $.getJSON("/trip/getFavoriteTrip", function(jsonResp){
            $(".right ul").html("");
            var strUserCurrency = $("#moneySelect").val();
            $("div.userCurrencySpan").html(strUserCurrency);
        //trip data
            var lstDicTripData = jsonResp["trip"];
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];

                var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"] );
                $(".right ul").append(strTripDataHtml);
            };

        });
        
        //組出單組查詢結果出來的html字串
        function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor, intId ){
            var reviewStar;
            if(intReviewStar==0){
                reviewStar='☆☆☆☆☆';
            }
            if(intReviewStar==1){
                reviewStar='★☆☆☆☆';
            }
            if(intReviewStar==2){
                reviewStar='★★☆☆☆';
            }
            if(intReviewStar==3){
                reviewStar='★★★☆☆';
            }
            if(intReviewStar==4){
                reviewStar='★★★★☆';
            }
            if(intReviewStar==5){
                reviewStar='★★★★★';
            }
    
            var strIntroduction=strIntroduction.substr( 0 , 135 );
    
            var strTripDataHtml = [
            "<li id="+intId+" style=\"list-style-type:none;\">",
                        "<div>",
                            "<p><img src=\""+strImageUrl+"\"/><p>",
                            "<p><span style=\"color:orange\">"+strTitle+"</span></p>",
                            "<p><a href="+strOriginUrl+" target=\"_blank\"> read more</a><p>",
                            "<p><span> Duration:"+intDurationHour+"</span></p>",
                            "<p><span style=\"color:red\">Stars:"+reviewStar+"</span></p>",
                            "<p><span>review:"+intReviewVisitor+"</span></p>",
                        "</div>",
            "</li>"
            ].join("");
            return strTripDataHtml;
        };
        
    };
})(jQuery);
