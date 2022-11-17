angular.module("fmccwebportal")
    .controller('newDashboardController', ['$scope', 'reportSrvs', 'spineService', function ($scope, reportSrvs, spineService) {
        $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMM YYYY');
        $scope.powerDashboardData = {
            HistoricPeakPower: null,
            HistoricAveragePeakPower: null,
            PowerYesterdayValue: null,
            PowerDayBeforeYesterdayValue: null,
            HistoricPeakPowerIncreasePercentage: null,
            PowerDayNdayValue: null,
            PowerDayNDates: null,
            HistoricPeakPowerBill: null,
            HistoricAveragePeakPowerBill: null,
            PowerYesterdayValueBill: null,
            PowerDayBeforeYesterdayValueBill: null,
            HistoricPeakPowerBillIncreasePercentage: null,
            PowerYesterDaySeriesColor: null,
            PowerAverageSeriesColor: null,
            PowerDayBeforeYesterdaySeriesColor: null,
            PowerYesterDaySeriesColorBill: null,
            PowerAverageSeriesColorBill: null,
            PowerDayBeforeYesterdaySeriesColorBill: null,
            PowerBillDayNdayValue: null,
            PowerBillDayNDates: null,

            HistoricPeakWater: null,
            WaterYesterdayValue: null,
            WaterDayBeforeYesterdayValue: null,
            HistoricPeakWaterIncreasePercentage: null,
            HistoricPeakWaterBill: null,
            WaterYesterdayValueBill: null,
            WaterDayBeforeYesterdayValueBill: null,
            HistoricPeakWaterBillIncreasePercentage: null,
            WaterYesterDaySeriesColor: null,
            WaterDayBeforeYesterdaySeriesColor: null,
            WaterYesterDaySeriesColorBill: null,
            WaterDayBeforeYesterdaySeriesColorBill: null,


            HistoricPeakCO2: null,
            CO2YesterdayValue: null,
            CO2DayBeforeYesterdayValue: null,
            HistoricPeakCO2IncreasePercentage: null,
            HistoricPeakCO2Bill: null,
            CO2YesterdayValueBill: null,
            CO2DayBeforeYesterdayValueBill: null,
            HistoricPeakCO2BillIncreasePercentage: null,
            CO2YesterDaySeriesColor: null,
            CO2DayBeforeYesterdaySeriesColor: null,
            CO2YesterDaySeriesColorBill: null,
            CO2DayBeforeYesterdaySeriesColorBill: null,
        };

        $scope.numberWithCommas = function (x) {
            if (x === null) {
                return "0";
            }
            if (x >= 1000) {
                x = x.toFixed(0);
            }
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        $scope.powerDashClicked = function () {
            window.location.href = "/NewHome/Index#/amrpowerconsumption/HT";
        }
        
        $scope.billDashClicked = function () {
            window.location.href = "/NewHome/Index#/amrbill/HT";
        }
        
        $scope.CO2DashClicked = function () {
            window.location.href = "/NewHome/Index#/amremission/HT";
        }


        // date model its watcher
        $scope.date = 'lastweek';
        var dateEnds = {};
        var previous = {};
        var previousBackUp = {};
        var previousBackUpType2 = {};
        var last = {};
        var lastBackUp = {};
        var lastBackUpType2 = {};


        // previous day
        dateEnds.previousStart = moment().subtract(2, 'days').startOf('day');
        dateEnds.previousEnd = moment().subtract(2, 'days').endOf('day');

        // current day
        dateEnds.lastStart = moment().subtract(1, 'days').startOf('day');
        dateEnds.lastEnd = moment().subtract(1, 'days').endOf('day');

        previous.name = "" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMMM') + "";
        last.name = "" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMMM') + "";

        $scope.dayClick = function () {
            $(".previewButton").removeClass("activeButton");
            var myEl = angular.element(document.querySelector('#btnDay'));
            myEl.addClass('activeButton');

            // previous day
            dateEnds.previousStart = moment().subtract(2, 'days').startOf('day');
            dateEnds.previousEnd = moment().subtract(2, 'days').endOf('day');

            // current day
            dateEnds.lastStart = moment().subtract(1, 'days').startOf('day');
            dateEnds.lastEnd = moment().subtract(1, 'days').endOf('day');

            previous.name = "" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMMM') + "";
            last.name = "" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMMM') + "";

            createReport();
        }

        $scope.weekClick = function () {
            $(".previewButton").removeClass("activeButton");
            var myEl = angular.element(document.querySelector('#btnWeek'));
            myEl.addClass('activeButton');
            // previous week
            dateEnds.previousStart = moment().startOf('isoWeek').isoWeekday(1).subtract(7, 'days'); //moment().subtract(14, 'days');
            dateEnds.previousEnd = moment().startOf('isoWeek').isoWeekday(1).subtract(1, 'days'); //moment().subtract(8, 'days');

            // current week
            dateEnds.lastStart = moment().startOf('isoWeek').isoWeekday(1); //moment().subtract(7, 'days');
            dateEnds.lastEnd = moment().startOf('isoWeek').isoWeekday(1).add(6, 'days');

            previous.name = "Previous Week";
            last.name = "Last Week";

            createReport();
        }

        $scope.monthClick = function () {
            $(".previewButton").removeClass("activeButton");
            var myEl = angular.element(document.querySelector('#btnMonth'));
            myEl.addClass('activeButton');

            // previous month
            dateEnds.previousStart = moment().subtract(1, 'months').startOf('month'); //moment().subtract(60, 'days');
            dateEnds.previousEnd = moment().subtract(1, 'months').endOf('month'); //moment().subtract(31, 'days');

            // current month
            dateEnds.lastStart = moment().startOf('month'); //moment().subtract(30, 'days');
            dateEnds.lastEnd = moment();

            previous.name = "Previous Month (" + dateEnds.previousStart.format('MMMM') + ")";
            last.name = "Last Month (" + dateEnds.lastStart.format('MMMM') + ")";

            createReport();
        }

        $scope.customClick = function () {
            $(".previewButton").removeClass("activeButton");
            var myEl = angular.element(document.querySelector('#btnCustom'));
            myEl.addClass('activeButton');
            //debugger;
            $('#customDate').daterangepicker(
                {
                    linkedCalendars: false,
                    changeYear: true,
                    locale: {
                        format: 'YYYY-MM-DD'
                    },
                    startDate: moment().format("YYYY-MM-DD"),
                    endDate: moment().format("YYYY-MM-DD"),
                    ranges: {
                        'Today': [
                        moment(),
                        moment()],
                        'Yesterday': [
                        moment().add(-1, 'days'),
                        moment().add(-1, 'days')],
                        'This Week': [
                          moment().startOf('isoweek').isoWeekday(1),
                          moment()],
                        'Last Week': [
                        moment().startOf('isoweek').add(-7, 'days').isoWeekday(1),
                        moment().startOf('isoweek').add(-7, 'days').isoWeekday(7)],
                        'This Month': [
                        moment().date(1),
                        moment()],
                        'Last Month': [
                        moment().subtract(1, 'months').date(1),
                        moment().date(1).subtract(1, 'days')],
                        'Last Year': [
                        moment().subtract(1, 'years').startOf('year'),
                        moment().subtract(1, 'years').endOf('year')]
                    },
                    separator: '-'
                }
        );
            $('#customDate').focus();
        }

        $scope.yearClick = function () {
            $(".previewButton").removeClass("activeButton");
            var myEl = angular.element(document.querySelector('#btnYear'));
            myEl.addClass('activeButton');

            // previous month
            dateEnds.previousStart = moment().subtract(1, 'years').startOf('year'); //moment().subtract(60, 'days');
            dateEnds.previousEnd = moment().subtract(1, 'years').endOf('year'); //moment().subtract(31, 'days');

            // current month
            dateEnds.lastStart = moment().startOf('year'); //moment().subtract(30, 'days');
            dateEnds.lastEnd = moment();

            previous.name = "Previous Year (" + dateEnds.previousStart.format('YYYY') + ")";
            last.name = "Last Year (" + dateEnds.lastStart.format('YYYY') + ")";

            createReport();
        }



        $scope.$watch('customDate', function () {
            //debugger;
            if ($scope.customDate !== undefined && ($scope.customDate !== "") && (($scope.customDate !== ((dateEnds.lastStart.format('YYYY-MM-DD')) + ' - ' + (dateEnds.lastEnd.format('YYYY-MM-DD')))))) {
                //console.log($('#customDate').data('daterangepicker').endDate.format('YYYY-MM-DD')); //$scope.customDate);
                //console.log(moment($scope.customDate, "MM-DD-YYYY").format("YYYY-MM-DD hh:mm A"));
                //console.log($scope.customDate);
                //console.log(((dateEnds.lastStart.format('YYYY-MM-DD')) + ' - ' + (dateEnds.lastEnd.format('YYYY-MM-DD'))));
                //debugger;

                // current day
                dateEnds.lastStart = moment($('#customDate').data('daterangepicker').startDate, "MM-DD-YYYY").startOf('day');
                dateEnds.lastEnd = moment($('#customDate').data('daterangepicker').endDate, "MM-DD-YYYY").endOf('day');

                //console.log(dateEnds.lastStart); //$scope.customDate);
                //console.log(dateEnds.lastEnd);

                var dateDiff = dateEnds.lastEnd.diff(dateEnds.lastStart, 'days') + 1;

                // previous day
                dateEnds.previousStart = moment($('#customDate').data('daterangepicker').startDate, "MM-DD-YYYY").subtract(dateDiff, 'days').startOf('day');
                dateEnds.previousEnd = moment($('#customDate').data('daterangepicker').startDate, "MM-DD-YYYY").subtract(1, 'days').endOf('day');

                //console.log(dateEnds.previousStart); //$scope.customDate);
                //console.log(dateEnds.previousEnd);

                previous.name = "date before (" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMM') + " to " + dateEnds.previousEnd.format('D') + " " + dateEnds.previousEnd.format('MMM') + ")";
                last.name = "Date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

                //$('#customDate').daterangepicker("hide");

                createReport();
            }
        });

        var createReport = function () {
            spineService.CreateLoadingSpine('#containerTotalPower');
            spineService.CreateLoadingSpine('#containerTotalWater');
            spineService.CreateLoadingSpine('#containerTotalCO2');
            spineService.CreateLoadingSpine('#containerTotalPowerBill');
            spineService.CreateLoadingSpine('#containerTotalWaterBill');
            spineService.CreateLoadingSpine('#containerTotalCO2Bill');

            spineService.CreateLoadingSpine('#containerTotalPowerLastN');

            reportSrvs.GetAMRDashBoardData(
                dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
                dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
                dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
                dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss')).then(function (res) {

                    console.log(res.data);

                if (res.data && res.data != null) {
                    //debugger;

                    $scope.powerDashboardData.HistoricPeakPower = res.data.HistoricPeakPower;
                    $scope.powerDashboardData.HistoricAveragePeakPower = res.data.HistoricAveragePeakPower > 999 ? parseInt(res.data.HistoricAveragePeakPower) : res.data.HistoricAveragePeakPower;
                    $scope.powerDashboardData.PowerYesterdayValue = res.data.PowerYesterdayValue > 999 ? parseInt(res.data.PowerYesterdayValue) : res.data.PowerYesterdayValue;
                    $scope.powerDashboardData.PowerDayBeforeYesterdayValue = res.data.PowerDayBeforeYesterdayValue;
                    $scope.powerDashboardData.HistoricPeakPowerIncreasePercentage = res.data.HistoricPeakPowerIncreasePercentage.toFixed(1);
                    $scope.powerDashboardData.HistoricPeakPowerBill = res.data.HistoricPeakPowerBill;
                    $scope.powerDashboardData.PowerYesterdayValueBill = res.data.PowerYesterdayValueBill > 999 ? parseInt(res.data.PowerYesterdayValueBill) : res.data.PowerYesterdayValueBill;
                    $scope.powerDashboardData.HistoricAveragePeakPowerBill = res.data.HistoricAveragePeakPowerBill > 999 ? parseInt(res.data.HistoricAveragePeakPowerBill) : res.data.HistoricAveragePeakPowerBill;
                    $scope.powerDashboardData.PowerDayBeforeYesterdayValueBill = res.data.PowerDayBeforeYesterdayValueBill;
                    $scope.powerDashboardData.HistoricPeakPowerBillIncreasePercentage = res.data.HistoricPeakPowerBillIncreasePercentage.toFixed(1);

                    $scope.powerDashboardData.PowerDayNdayValue = res.data.PowerDayNdayValue;
                    $scope.powerDashboardData.PowerDayNDates = res.data.PowerDayNDates;
                    $scope.powerDashboardData.PowerBillDayNdayValue = res.data.PowerBillDayNdayValue;
                    $scope.powerDashboardData.PowerBillDayNDates = res.data.PowerBillDayNDates;


                    if ($scope.powerDashboardData.HistoricPeakPower >= res.data.PowerYesterdayValue) {
                        $scope.powerDashboardData.PowerYesterDaySeriesColor = '#7CB5EC';
                    } else {
                        $scope.powerDashboardData.PowerYesterDaySeriesColor = '#FF0000';
                    }
                    if ($scope.powerDashboardData.HistoricPeakPower >= res.data.HistoricAveragePeakPower) {
                        $scope.powerDashboardData.PowerAverageSeriesColor = '#90ED7D';
                    } else {
                        $scope.powerDashboardData.PowerAverageSeriesColor = '#FF0000';
                    }

                    if ($scope.powerDashboardData.HistoricPeakPower >= $scope.powerDashboardData.PowerDayBeforeYesterdayValue) {
                        $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColor = '#434348';
                    } else {
                        $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColor = '#FF0000';
                    }

                    if ($scope.powerDashboardData.HistoricPeakPowerBill >= res.data.PowerYesterdayValueBill) {
                        $scope.powerDashboardData.PowerYesterDaySeriesColorBill = '#7CB5EC';
                    } else {
                        $scope.powerDashboardData.PowerYesterDaySeriesColorBill = '#FF0000';
                    }

                    if ($scope.powerDashboardData.HistoricPeakPowerBill >= res.data.HistoricAveragePeakPowerBill) {
                        $scope.powerDashboardData.PowerAverageSeriesColorBill = '#90ED7D';
                    } else {
                        $scope.powerDashboardData.PowerAverageSeriesColorBill = '#FF0000';
                    }
                    if ($scope.powerDashboardData.HistoricPeakPowerBill >= $scope.powerDashboardData.PowerDayBeforeYesterdayValueBill) {
                        $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColorBill = '#434348';
                    } else {
                        $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColorBill = '#FF0000';
                    }



                    $scope.powerDashboardData.HistoricPeakWater = res.data.HistoricPeakWater;
                    $scope.powerDashboardData.WaterYesterdayValue = res.data.WaterYesterdayValue;
                    $scope.powerDashboardData.WaterDayBeforeYesterdayValue = res.data.WaterDayBeforeYesterdayValue;
                    $scope.powerDashboardData.HistoricPeakWaterIncreasePercentage = res.data.HistoricPeakWaterIncreasePercentage;
                    $scope.powerDashboardData.HistoricPeakWaterBill = res.data.HistoricPeakWaterBill;
                    $scope.powerDashboardData.WaterYesterdayValueBill = res.data.WaterYesterdayValueBill;
                    $scope.powerDashboardData.WaterDayBeforeYesterdayValueBill = res.data.WaterDayBeforeYesterdayValueBill;
                    $scope.powerDashboardData.HistoricPeakWaterBillIncreasePercentage = res.data.HistoricPeakWaterBillIncreasePercentage;

                    $scope.powerDashboardData.HistoricPeakCO2 = res.data.HistoricPeakCO2;
                    $scope.powerDashboardData.CO2YesterdayValue = res.data.CO2YesterdayValue;
                    $scope.powerDashboardData.CO2DayBeforeYesterdayValue = res.data.CO2DayBeforeYesterdayValue;
                    $scope.powerDashboardData.HistoricPeakCO2IncreasePercentage = res.data.HistoricPeakCO2IncreasePercentage;
                    $scope.powerDashboardData.HistoricPeakCO2Bill = res.data.HistoricPeakCO2Bill;
                    $scope.powerDashboardData.CO2YesterdayValueBill = res.data.CO2YesterdayValueBill;
                    $scope.powerDashboardData.CO2DayBeforeYesterdayValueBill = res.data.CO2DayBeforeYesterdayValueBill;
                    $scope.powerDashboardData.HistoricPeakCO2BillIncreasePercentage = res.data.HistoricPeakCO2BillIncreasePercentage;
                }

                // begin: Total Power 
                $('#containerTotalPower').highcharts({

                    chart: {
                        type: 'solidgauge'
                    },

                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '10px',
                            display: 'none'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: 105 - labelWidth / 2,
                                y: 130
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: $scope.powerDashboardData.HistoricPeakPower,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return '<span style="text-weight:bold;"> ' + this.name + '</span>';
                        },
                        symbolWidth: 0
                    },
                    series: [{
                        marker: {
                            symbol: 'circle',
                            fillColor: $scope.powerDashboardData.PowerYesterDaySeriesColor
                        },
                        name: last.name,//'Yesterday',
                        data: [{
                            color: $scope.powerDashboardData.PowerYesterDaySeriesColor, //Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: $scope.powerDashboardData.PowerYesterdayValue
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColor
                        },
                        name: previous.name,//'Day Before Yesterday',
                        data: [{
                            color: $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColor,//Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: $scope.powerDashboardData.PowerDayBeforeYesterdayValue
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: $scope.powerDashboardData.PowerAverageSeriesColor
                        },
                        name: 'Average',
                        data: [{
                            color: $scope.powerDashboardData.PowerAverageSeriesColor,
                            radius: '62%',
                            innerRadius: '38%',
                            y: $scope.powerDashboardData.HistoricAveragePeakPower
                        }],
                        showInLegend: true
                    }]

                });
                // end: Total Power

                // begin: Total Power Last N days
                $('#containerTotalPowerLastN').highcharts({

                    chart: {
                        renderTo: 'container',
                        type: 'column',
                        margin: [0, 0, 0, 0],
                        padding: [0, 0, 0, 0]
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Rainfall',
                        style: {
                            display: 'none'
                        }
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        style: {
                            display: 'none'
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        gridLineWidth: 0,
                        categories: $scope.powerDashboardData.PowerDayNDates,
                        labels: {
                            style: {
                                display: 'none',
                                enabled: false
                            }
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: 'Rainfall (mm)'
                        },
                        labels: {
                            style: {
                                display: 'none'
                            }
                        },
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        //footerFormat: '</table>',
                        //shared: true,
                        //useHTML: true,
                        style: {
                            display: 'none'
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name: 'Consumption',
                        data: $scope.powerDashboardData.PowerDayNdayValue,//[265, 71.5, 106.4, 129.2, 144.0, 250],
                        color: '#FFCA2F'
                    }]

                });
                // end: Total Power Last N days

                // begin: Total Power Bill
                $('#containerTotalPowerBill').highcharts({

                    chart: {
                        type: 'solidgauge'
                    },

                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px',
                            display: 'none'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: 200 - labelWidth / 2,
                                y: 180
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: $scope.powerDashboardData.HistoricPeakPowerBill,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return '<span style="text-weight:bold;"> ' + this.name + '</span>';
                        },
                        symbolWidth: 0
                    },
                    series: [{
                        marker: {
                            symbol: 'circle',
                            fillColor: $scope.powerDashboardData.PowerYesterDaySeriesColorBill
                        },
                        name: last.name,//'Yesterday',
                        data: [{
                            color: $scope.powerDashboardData.PowerYesterDaySeriesColorBill, //Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: $scope.powerDashboardData.PowerYesterdayValueBill
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColorBill
                        },
                        name: previous.name,//'Day Before Yesterday',
                        data: [{
                            color: $scope.powerDashboardData.PowerDayBeforeYesterdaySeriesColorBill, //Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: $scope.powerDashboardData.PowerDayBeforeYesterdayValueBill
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: $scope.powerDashboardData.PowerAverageSeriesColorBill
                        },
                        name: 'Average',
                        data: [{
                            color: $scope.powerDashboardData.PowerAverageSeriesColorBill,
                            radius: '62%',
                            innerRadius: '38%',
                            y: $scope.powerDashboardData.HistoricAveragePeakPowerBill
                        }],
                        showInLegend: true
                    }]

                });
                // end: Total Power Bill

                // begin: Total Power Bill Last N days
                $('#containerTotalPowerBillLastN').highcharts({

                    chart: {
                        renderTo: 'container',
                        type: 'column',
                        margin: [0, 0, 0, 0],
                        padding: [0, 0, 0, 0]
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Rainfall',
                        style: {
                            display: 'none'
                        }
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        style: {
                            display: 'none'
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        gridLineWidth: 0,
                        categories: $scope.powerDashboardData.PowerBillDayNDates ,

                        //    [
                        //    'Jan',
                        //    'Feb',
                        //    'Mar',
                        //    'Apr',
                        //    'May'
                        //],
                        labels: {
                            style: {
                                display: 'none',
                                enabled: false
                            }
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: 'Rainfall (mm)'
                        },
                        labels: {
                            style: {
                                display: 'none'
                            }
                        },
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        //footerFormat: '</table>',
                        //shared: true,
                        //useHTML: true,
                        style: {
                            display: 'none'
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name: 'Consumption',
                        data: $scope.powerDashboardData.PowerBillDayNdayValue, //[265, 71.5, 106.4, 129.2, 144.0, 250],
                        color: '#FFCA2F'
                    }]

                });
                // end: Total Power Bill Last N days


                // begin: Total Water
                $('#containerTotalWater').highcharts({

                    chart: {
                        type: 'solidgauge'
                    },

                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px',
                            display: 'none'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: 200 - labelWidth / 2,
                                y: 180
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return '<span style="text-weight:bold;"> ' + this.name + '</span>';
                        },
                        symbolWidth: 0
                    },
                    series: [{
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[0]
                        },
                        name: 'Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: 80
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[1]
                        },
                        name: 'Day Before Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: 65
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[2]
                        },
                        name: 'Average',
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '62%',
                            innerRadius: '38%',
                            y: 65
                        }],
                        showInLegend: true
                    }]

                });
                // end: Total Water

                // begin: Total Water Last N days
                $('#containerTotalWaterLastN').highcharts({

                    chart: {
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Rainfall',
                        style: {
                            display: 'none'
                        }
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        style: {
                            display: 'none'
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        gridLineWidth: 0,
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May'
                        ],
                        labels: {
                            style: {
                                display: 'none',
                                enabled: false
                            }
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: 'Rainfall (mm)'
                        },
                        labels: {
                            style: {
                                display: 'none'
                            }
                        },
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        //footerFormat: '</table>',
                        //shared: true,
                        //useHTML: true,
                        style: {
                            display: 'none'
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name: 'Consumption',
                        data: [265, 71.5, 106.4, 129.2, 144.0, 250],
                        color: '#FFCA2F'
                    }]

                });
                // end: Total Water Last N days

                // begin: Total Water Bill
                $('#containerTotalWaterBill').highcharts({

                    chart: {
                        type: 'solidgauge'
                    },

                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px',
                            display: 'none'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: 200 - labelWidth / 2,
                                y: 180
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return '<span style="text-weight:bold;"> ' + this.name + '</span>';
                        },
                        symbolWidth: 0
                    },
                    series: [{
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[0]
                        },
                        name: 'Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: 80
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[1]
                        },
                        name: 'Day Before Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: 65
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[2]
                        },
                        name: 'Average',
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '62%',
                            innerRadius: '38%',
                            y: 65
                        }],
                        showInLegend: true
                    }]

                });
                // end: Total Water Bill

                // begin: Total Water Bill Last N days
                $('#containerTotalWaterBillLastN').highcharts({

                    chart: {
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Rainfall',
                        style: {
                            display: 'none'
                        }
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        style: {
                            display: 'none'
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        gridLineWidth: 0,
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May'
                        ],
                        labels: {
                            style: {
                                display: 'none',
                                enabled: false
                            }
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: 'Rainfall (mm)'
                        },
                        labels: {
                            style: {
                                display: 'none'
                            }
                        },
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        //footerFormat: '</table>',
                        //shared: true,
                        //useHTML: true,
                        style: {
                            display: 'none'
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name: 'Consumption',
                        data: [265, 71.5, 106.4, 129.2, 144.0, 250],
                        color: '#FFCA2F'
                    }]

                });
                // end: Total Water Bill Last N days

                // begin: Total CO2
                $('#containerTotalCO2').highcharts({

                    chart: {
                        type: 'solidgauge'
                    },

                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px',
                            display: 'none'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: 200 - labelWidth / 2,
                                y: 180
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return '<span style="text-weight:bold;"> ' + this.name + '</span>';
                        },
                        symbolWidth: 0
                    },
                    series: [{
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[0]
                        },
                        name: last.name,//'Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: 80
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[1]
                        },
                        name: previous.name,//'Day Before Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: 65
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[2]
                        },
                        name: 'Average',
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '62%',
                            innerRadius: '38%',
                            y: 65
                        }],
                        showInLegend: true
                    }]

                });
                // end: Total CO2

                // begin: Total CO2 Last N days
                $('#containerTotalCO2LastN').highcharts({

                    chart: {
                        renderTo: 'container',
                        type: 'column',
                        margin: [0, 0, 0, 0],
                        padding: [0, 0, 0, 0]
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Rainfall',
                        style: {
                            display: 'none'
                        }
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        style: {
                            display: 'none'
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        gridLineWidth: 0,
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May'
                        ],
                        labels: {
                            style: {
                                display: 'none',
                                enabled: false
                            }
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: 'Rainfall (mm)'
                        },
                        labels: {
                            style: {
                                display: 'none'
                            }
                        },
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        //footerFormat: '</table>',
                        //shared: true,
                        //useHTML: true,
                        style: {
                            display: 'none'
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name: 'Consumption',
                        data: [265, 145, 126.4, 199.2, 144.0, 250],
                        color: '#FFCA2F'
                    }]

                });
                // end: Total CO2 Last N days

                // begin: Total CO2 bill
                $('#containerTotalCO2Bill').highcharts({

                    chart: {
                        type: 'solidgauge'
                    },

                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px',
                            display: 'none'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: 200 - labelWidth / 2,
                                y: 180
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return '<span style="text-weight:bold;"> ' + this.name + '</span>';
                        },
                        symbolWidth: 0
                    },
                    series: [{
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[0]
                        },
                        name: 'Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: 80
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[1]
                        },
                        name: 'Day Before Yesterday',
                        data: [{
                            color: Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: 65
                        }],
                        showInLegend: true
                    }, {
                        marker: {
                            symbol: 'circle',
                            fillColor: Highcharts.getOptions().colors[2]
                        },
                        name: 'Average',
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '62%',
                            innerRadius: '38%',
                            y: 65
                        }],
                        showInLegend: true
                    }]

                });
                // end: Total CO2 bill

                // begin: Total CO2 Bill Last N days
                $('#containerTotalCO2BillLastN').highcharts({

                    chart: {
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Rainfall',
                        style: {
                            display: 'none'
                        }
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com',
                        style: {
                            display: 'none'
                        }
                    },
                    xAxis: {
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'transparent',
                        gridLineWidth: 0,
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May'
                        ],
                        labels: {
                            style: {
                                display: 'none',
                                enabled: false
                            }
                        },
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: 'Rainfall (mm)'
                        },
                        labels: {
                            style: {
                                display: 'none'
                            }
                        },
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        //footerFormat: '</table>',
                        //shared: true,
                        //useHTML: true,
                        style: {
                            display: 'none'
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name: 'Consumption',
                        data: [265, 145, 106.4, 129.2, 144.0, 250],
                        color: '#FFCA2F'
                    }]

                });
                // end: Total CO2 Bill Last N days

                $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMMM YYYY');
            });
        }

        createReport();
}]);