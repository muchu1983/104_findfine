(function($){
    
    $(document).ready(initWishList);
    function initWishList(){
        
        //TODO 需加入帳號 才能篩選 wish list
        
        $.getJSON("/trip/getFavoriteTrip", function(jsonResp){

            $(".content ul").html("");
        
            var strUserCurrency = $("#moneySelect").val();
            $("div.userCurrencySpan").html(strUserCurrency);
        //trip data
            var lstDicTripData = jsonResp["trip"];
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];
                var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"], dicTripData["intId"] );
                $(".content ul").append(strTripDataHtml);
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
            "<li style=\"list-style-type:none;\">",
                        "<div>",
                            //TODO 需要每個TOUR的KEY
                            "<p><img src=\""+strImageUrl+"\"/><p>",
                            "<p><span style=\"color:orange\">"+strTitle+"</span></p>",
                            "<p><a href="+strOriginUrl+" target=\"_blank\"> read more</a><p>",
                            "<p><span> Duration:"+intDurationHour+"</span></p>",
                            "<p><span style=\"color:red\">Stars:"+reviewStar+"</span></p>",
                            "<p><span>review:"+intReviewVisitor+"</span></p>",
                            //"<p><button id=\"deleteTour\">delete</button><button id=\"addPlan\">add my plan</button></p>",
                            "<p><div class=\"favorite\" onclick=\"addPlan("+intId+")\">add plan</div><div class=\"favorite\" onclick=\"removeFavoriteTrip("+intId+")\">remove</div></p>",
                        "</div>",
            "</li>"
            ].join("");
            return strTripDataHtml;
        };
    };
})(jQuery);


    function addPlan( intId ){
        //若無plan 導頁至 myPlan
        
        //若有plan 下拉選單展示myPlan 選其一後 導頁至 editPlan
    }

    function removeFavoriteTrip( intId ){
        var strAddFavoriteTripUrl = "/trip/removeFavoriteTrip?intTripId="+intId ;
        $.getJSON(strAddFavoriteTripUrl, function(jsonResp){
            var status = jsonResp["delete_favorite_trip_status"];
            alert(status);
        });
        //initWishList();
        window.location.reload();
    }







