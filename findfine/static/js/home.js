//初始化autocomplate place_chenged event
tour.sendData = {};
function initMap() {
    var input =(document.getElementById('autocomplete'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            //未獲得地點資訊
            return;
        }
        tour.sendData = {
            keyword: document.getElementById('autocomplete').value,
            lat:place.geometry.location.lat(),
            lng:place.geometry.location.lng()
        };
    });
}

$(function() {
    $('#btnFindTrip').on('click', function() {
        //暫時改丟靜態頁,之後改後端接
        //若無googlemap資訊 將值帶到下一頁
        if(typeof tour.sendData.keyword =='undefined'){
            var input =($('#autocomplete')).val();
            location.href = '/page/find?keyword='+input+'&lat='+tour.sendData.lat+'&lng='+tour.sendData.lng;
        }else{
            location.href = '/page/find?keyword='+tour.sendData.keyword+'&lat='+tour.sendData.lat+'&lng='+tour.sendData.lng;
        }
    });

    //圖片展示區塊
    $('.portfolio-link').on('click',function(e){
        e.preventDefault();
        var url = '/page/find?keyword='+$(this).data('place')+'&lat='+$(this).data('lat')+'&lng='+$(this).data('lng');
        location.href = url;
    });
});

(function($){
    
    $(document).ready(initHome);
    
    function initHome(){
        initCurrencySelect()
    };
    
    //幣別
    function initCurrencySelect(){
        //設定目前幣別
        var strUserCurrencyUrl = "/trip/userCurrency";
        $.getJSON(strUserCurrencyUrl, function(jsonResp){
            strUserCurrency = jsonResp["strUserCurrency"];
            $("#moneySelect").val(strUserCurrency);
            $("#moneySelect").selectpicker("refresh")
            console.log("init user currency selection: " + strUserCurrency);
        });
        //切換目前幣別
        $("#moneySelect").change(function(){
            var strSelectedCurrencyVal = $("#moneySelect").find(":selected").val();
            var strChangeUserCurrencyUrl = strUserCurrencyUrl + "?user_currency=" + strSelectedCurrencyVal;
            $.getJSON(strChangeUserCurrencyUrl, function(jsonResp){
                strUserCurrency = jsonResp["strUserCurrency"];
                console.log("switch user currency to: " + strUserCurrency);
            });
        });
        
    };
    
})(jQuery);
