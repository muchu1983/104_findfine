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
    };
})(jQuery);
