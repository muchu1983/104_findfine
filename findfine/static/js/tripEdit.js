(function($){
    $(document).ready(initTripEdit);
    function initTripEdit(){
        
        var intId ;

        
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            droppable: true,
            eventClick: function(calEvent, jsEvent, view) {
                            $(this).remove();
                            $(this).css('visibility','hidden');
                            
                            //取得intPlanId
                            var intPlanId = (location.href).substring( (location.href).indexOf("=")+1 , (location.href).length )

                          //將 trip 移除 my plans 中
                            var removeTripPlanItem = "/trip/removeTripPlanItem?intPlanId="+intPlanId+"&intPlanItemId="+intId ;
                            $.getJSON(removeTripPlanItem, function(jsonResp){
                            });
                        },

            drop: function() {
                

                    
                    //處理this物件的字串
                    var a = $(this).html().substring( $(this).html().indexOf("||")+2);
                    var strUserCurrency = a.substring( 0 , a.indexOf("||"));
                    
                    var b = a.substring( a.indexOf("||")+2);
                    var strTitle = b.substring( 0 , b.indexOf("||"));
                    
                    var c = b.substring( b.indexOf("||")+2);
                    var intUserCurrencyCost = c.substring( 0 , c.indexOf("||"));
                    
                    var d = c.substring( c.indexOf("||")+2);
                    var strIntroduction = d.substring( 0 , d.indexOf("||"));
                    
                    var e = d.substring( d.indexOf("||")+2);
                    var strLocation = e.substring( 0 , e.indexOf("||"));
                    
                    var f = e.substring( e.indexOf("||")+2);
                    var intDurationHour = f.substring( 0 , f.indexOf("||"));
                    
                    var g = f.substring( f.indexOf("||")+2);
                    var strOriginUrl = g.substring( 0 , g.indexOf("||"));
                    
                    var h = g.substring( g.indexOf("||")+2);
                    var strImageUrl = h.substring( 0 , h.indexOf("||"));
                    
                    var i = h.substring( h.indexOf("||")+2);
                    var intReviewStar = i.substring( 0 , i.indexOf("||"));
                    
                    var j = i.substring( i.indexOf("||")+2);
                    var intReviewVisitor = j.substring( 0 , j.indexOf("||"));
                    
                    var k = j.substring( j.indexOf("||")+2);
                    intId = k.substring( 0 , k.indexOf("||"));
                    
                    //取得intPlanId
                    var intPlanId = (location.href).substring( (location.href).indexOf("=")+1 , (location.href).length )
                    
                    //將 trip 加入 my plans 中
                    var addTripPlanItem = "/trip/addTripPlanItem?intPlanId="+intPlanId+"&intTripId="+intId+"&intReviewVisitor="+intReviewVisitor+"&intReviewStar="+intReviewStar+"&strImageUrl="+strImageUrl+"&strOriginUrl="+strOriginUrl+"&intDurationHour="+intDurationHour+"&strLocation="+strLocation+"&strIntroduction="+strIntroduction+"&intUserCurrencyCost="+intUserCurrencyCost+"&strTitle="+strTitle+"&strUserCurrency="+strUserCurrency ;
                    $.getJSON(addTripPlanItem, function(jsonResp){
                    });
                    $('#calendar').fullCalendar( 'refetchEvents' );
                    $('#calendar').fullCalendar( 'refresh' );
                    
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

            var strHidden = "||"+strUserCurrency+"||"+strTitle+"||"+intUserCurrencyCost+"||"+strIntroduction+"||"+strLocation+"||"+intDurationHour+"||"+strOriginUrl+"||"+strImageUrl+"||"+intReviewStar+"||"+intReviewVisitor+"||"+intId+"||" ;
            
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
                            "<p><input type='hidden' value='hidden:"+strHidden+"'><p>",
                        "</div>",
            "</li>"
            ].join("");
            return strTripDataHtml;
        };
        
    };
})(jQuery);
