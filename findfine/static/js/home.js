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

function keywordToFindPage(place){

    if(place=='Beijing'){
        location.href = 'find?keyword=Beijing&lat=39.904211&lng=116.40739499999995';
    }
    if(place=='Caribbean'){
        location.href = 'find?keyword=Caribbean&lat=14.5401107&lng=-74.96763650000003';
    }
    if(place=='Greece'){
        location.href = 'find?keyword=Greece&lat=39.074208&lng=21.824311999999964';
    }
    if(place=='Kyoto'){
        location.href = 'find?keyword=Kyoto&lat=35.0116363&lng=135.76802939999993';
    }
    if(place=='London'){
        location.href = 'find?keyword=London&lat=51.5073509&lng=-0.12775829999998223';
    }
    if(place=='NewYork'){
        location.href = 'find?keyword=New York&lat=40.7127837&lng=-74.00594130000002';
    }
    if(place=='Paris'){
        location.href = 'find?keyword=Paris&lat=48.856614&lng=2.3522219000000177';
    }
    if(place=='Rome'){
        location.href = 'find?keyword=Rome&lat=41.9027835&lng=12.496365500000024';
    }
    if(place=='Taipei'){
        location.href = 'find?keyword=Taipei&lat=25.0329636&lng=121.56542680000007';
    }
    

}

$(function() {
    $('#btnFindTrip').on('click', function() {
        //暫時改丟靜態頁,之後改後端接
        //若無googlemap資訊 將值帶到下一頁
        if(typeof tour.sendData.keyword =='undefined'){
            var input =($('#autocomplete')).val();
            location.href = 'find?keyword='+input+'&lat='+tour.sendData.lat+'&lng='+tour.sendData.lng;
        }else{
            location.href = 'find?keyword='+tour.sendData.keyword+'&lat='+tour.sendData.lat+'&lng='+tour.sendData.lng;
        }
    });
});


