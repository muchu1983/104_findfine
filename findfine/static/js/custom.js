// 自定js
var tour = {
    QueryString: function() {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }
};
$(function() {
    tour.$body = $('body');
    tour.$body
        //調用bs affix
        .find('#mainNav').affix({
            offset: {
                top: 100
            }
        });

    if ($('.bs_range').length) {
        $('.bs_range').daterangepicker({
                "autoUpdateInput": false,
                "autoApply": true,
                "locale": {
                    "format": "YYYY/MM/DD",
                    "separator": " - ",
                    "applyLabel": "Apply",
                    "cancelLabel": "Cancel",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "Custom",
                    "daysOfWeek": [
                        "日",
                        "一",
                        "二",
                        "三",
                        "四",
                        "五",
                        "六"
                    ],
                    "monthNames": [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月"
                    ],
                    "firstDay": 1
                }
            },
            function(start, end, label) {
                // console.log(start.format('YYYYMMDD') + ' to ' + end.format('YYYYMMDD'));
            });

        //自動帶入日期
        $('.bs_range').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
        });
    }
    $('.bsSelect').selectpicker();

});
