(function($){
    $(document).ready(initTripEdit);
    function initTripEdit(){
        

        
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
        //在执行之前加
        $.ajaxSettings.async = false;
        
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
        //执行你的代码之后及时恢复为
        $.ajaxSettings.async = true;


        
        
        $('.fc-event').each(function() {
            alert($(this).text());
            $(this).data('event', {
                title: $.trim($(this).text()), 
                stick: true 
            });
            $(this).draggable({
                zIndex: 999,
                revert: true,
                revertDuration: 0
            });
            //將 trip 加入 my plans 中
            //http://127.0.0.1:8000/trip/addTripPlanItem?intPlanId=3&strComment=%2277%22
            
            //var addTripPlanItem = "/trip/addTripPlanItem?intPlanId="+intId;
            //$.getJSON(addTripPlanItem, function(jsonResp){
            //    alert("jsonResp"+jsonResp);
            //    });
            
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

            
            var strTripDataHtml = [
            "<li id="+intId+" style=\"list-style-type:none;\">",
                        "<div class='fc-event'>",
                            "<p><img src=\""+strImageUrl+"\"/><p>",
                            "<p><span style=\"color:orange\">"+strTitle+"</span></p>",
                            "<p><a href="+strOriginUrl+" target=\"_blank\"> read more</a><p>",
                            "<p><span> Duration:"+intDurationHour+"</span></p>",
                            "<p><span> strUserCurrency:"+strUserCurrency+"</span></p>",
                            "<p><span> intUserCurrencyCost:"+intUserCurrencyCost+"</span></p>",
                            "<p><span> strLocation:"+strLocation+"</span></p>",
                            "<p><span> strOriginUrl:"+strOriginUrl+"</span></p>",
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
