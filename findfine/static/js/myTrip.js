(function($){
    $(document).ready(initMyTrip);
    function initMyTrip(){
        
        //取得plan清單  /trip/getTripPlan
        var strGetTripPlanUrl = "/trip/getTripPlan";
        $.getJSON(strGetTripPlanUrl, function(jsonResp){
            var lstDicPlanData = jsonResp["plan"];
            for (i = 0; i < lstDicPlanData.length; i++) {
                var dicPlanData = lstDicPlanData[i];
                var strPlanDataHtml = getPlanDataHtml( dicPlanData["strName"] , dicPlanData["intId"]);
                $('.content').append(strPlanDataHtml);
            };
        });
        
        
        function getPlanDataHtml(strName , intId ){
            var strTripDataHtml = [
            "<li id="+intId+">",
                "<p><span style=\"color:orange\">"+strName+"</span></p>",
                "<button onclick=\"deletePlan('"+intId+"')\">delete</button>",
                "<button onclick=\"editPlan('"+intId+"')\">edit</button>",
            "</li>"
            ].join("");
            return strTripDataHtml;
        }
        
        //新增plan      /trip/addTripPlan?strPlanName=SSSSSS
        $('#addTrip').click(function(){
            //var trip="<div class='list'>trip<button>delete</button><button>edit</button></div>"
            //$('.content').append(trip);
            var planName =$('#planName').val().trim();
            
            if(planName.length>0){
                var strAddTripPlanUrl = "/trip/addTripPlan?strPlanName="+planName;
                $.getJSON(strAddTripPlanUrl, function(jsonResp){
                    console.log("jsonResp"+jsonResp);
                    alert("jsonResp"+jsonResp);
                });
                $('.content').append(getPlanDataHtml(planName));
            }
        })
        
        //刪除plan      /trip/removeTripPlan?intPlanId=NNN
        
    };
})(jQuery);

function deletePlan( intId ){
    alert("deletePlan");
    var strRemoveTripPlanUrl = "/trip/removeTripPlan?intPlanId="+intId;
    $.getJSON(strRemoveTripPlanUrl, function(jsonResp){
    });
    $('#'+intId+'').remove();
}

function editPlan( intId ){
    alert("editPlan");
    window.location = "/trip/getTripPlanItem?intPlanId="+intId;
}
