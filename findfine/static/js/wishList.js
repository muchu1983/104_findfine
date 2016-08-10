(function($){
    $(document).ready(initWishList);
    function initWishList(){
        
        
        
        
        
        
        
        
        var strFilterQueryUrl = "/trip/filter?1=1"; //TODO 需加入帳號 才能篩選 wish list
        
        $.getJSON(strFilterQueryUrl, function(jsonResp){
        //console.log(jsonResp);
            $(".content ul").html("");
        
            var strUserCurrency = $("#moneySelect").val();
            $("div.userCurrencySpan").html(strUserCurrency);
        //trip data
            var lstDicTripData = jsonResp["trip"];
            for (i = 0; i < lstDicTripData.length; i++) {
                var dicTripData = lstDicTripData[i];
                var strTripDataHtml = getTripDataHtml(strUserCurrency, dicTripData["strTitle"], dicTripData["intUserCurrencyCost"], dicTripData["strIntroduction"], dicTripData["strLocation"], dicTripData["intDurationHour"], dicTripData["strOriginUrl"], dicTripData["strImageUrl"], dicTripData["intReviewStar"], dicTripData["intReviewVisitor"] );
                $(".content ul").append(strTripDataHtml);
            };
            
            /*
        //page data
            var dicPageData = jsonResp["page"];
            console.log(dicPageData);
            $("#current_page").html(dicPageData["current_page"]);
            if (dicPageData["current_page"]-1 < 1){
                $("#prev_page_link").hide();
            }else{
                $("#prev_page_link").show();
                $("#prev_page_link").attr("page_value", dicPageData["current_page"]-1);
            }
            if (dicPageData["current_page"]+1 > dicPageData["total_page"]){
                $("#next_page_link").hide();
            }else{
                $("#next_page_link").show();
            $("#next_page_link").attr("page_value", dicPageData["current_page"]+1);
            }
            */
            
        });
        
        
        
        
        
        
        
        
        
        
        //組出單組查詢結果出來的html字串
    function getTripDataHtml(strUserCurrency, strTitle, intUserCurrencyCost, strIntroduction, strLocation, intDurationHour, strOriginUrl, strImageUrl, intReviewStar, intReviewVisitor ){
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
            //"<div>",
                    //"<div>",
                    //    "<img src=\""+strImageUrl+"\"/>",
                    //"</div>",
                    //"<div>",
                        "<div>",
                            "<p><img src=\""+strImageUrl+"\"/><p>",
                            "<p><span style=\"color:orange\">"+strTitle+"</span></p>",
                            "<p><a href="+strOriginUrl+" target=\"_blank\"> read more</a><p>",
                            "<p><span> Duration:"+intDurationHour+"</span></p>",
                            "<p><span style=\"color:red\">Stars:"+reviewStar+"</span></p>",
                            "<p><span>review:"+intReviewVisitor+"</span></p>",
                            "<p><button>delete</button><button>add my trip</button></p>",
                        "</div>",
                    //"</div>",
                    //"<div>",
                        //"<span style=\"color:red\">"+intUserCurrencyCost+" "+strUserCurrency+"</span></br>",
                    //"</div>",
            //"</div>",
        "</li>"
        ].join("");
        return strTripDataHtml;
    };
        
        
        
        
        
        
        
        
        
        
    };
})(jQuery);
