angular.module("fmccwebportal").factory("HiChart", function () {
    return {
        chart: {
            zoomType: 'x',
            renderTo: 'chart-body',
            type: 'line'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'DateTime'
            },
        },
        yAxis: {
            title: {
                text: 'Values'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>Date:{point.x:%Y-%m-%d %H:%M}</b><br>',
            pointFormat: '<b>Value: {point.y:.2f}</b>'
        },
        series: [{
            data: data
        }]
    }
    //new Highcharts.Chart(options);
    //seriesData.push([Date.UTC(data[i].YY, data[i].MM, data[i].DD, data[i].hh, data[i].mm), data[i].value]);
});