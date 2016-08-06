(function($){
    $(document).ready(initMyTrip);
    function initMyTrip(){
        $('#addTrip').click(function(){
            var trip="<div class='list'>trip<button>delete</button><button>edit</button></div>"
            $('.content').append(trip);
        })
    };
})(jQuery);
