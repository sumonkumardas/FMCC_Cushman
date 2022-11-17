angular.module("fmccwebportal")
.controller('amrpowerConsumptionCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.powerUpgradeSummaryType2 = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;
    $scope.tensionName = "HT";
    $scope.IsHT = true;
    if (typeof $routeParams.tensionName != 'undefined') {
        //alert($routeParams.tensionName);
        $scope.tensionName = $routeParams.tensionName;
    }
    if ($scope.tensionName === "HT") {
        $scope.IsHT = true;
    } else {
        $scope.IsHT = false;
    }
    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
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


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMMM YYYY');

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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');
        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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

        loadData();
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
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }


    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        updatedData.LastType2 = lastBackUpType2.data;
        updatedData.PreviousType2 = previousBackUpType2.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        last.data = angular.copy(lastBackUpType2.data);
        previous.data = angular.copy(previousBackUpType2.data);

        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            last.data[i].y = (lastBackUpType2.data[i].y / lastBackUpType2.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            previous.data[i].y = (previousBackUpType2.data[i].y / previousBackUpType2.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.LastType2 = last.data;
        updatedData.PreviousType2 = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        last.data = angular.copy(lastBackUpType2.data);
        previous.data = angular.copy(previousBackUpType2.data);

        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            last.data[i].y = (lastBackUpType2.data[i].y / lastBackUpType2.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            previous.data[i].y = (previousBackUpType2.data[i].y / previousBackUpType2.data[i].BedNo).toFixed(2) / 1;
        }
        updatedData.LastType2 = last.data;
        updatedData.PreviousType2 = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMMM YYYY');
    }

    var createCompareChart = function (updatedData) {

        spineService.CreateLoadingSpine('#armpowerconsumptioncomparison');
        spineService.CreateLoadingSpine('#armpowerconsumptioncomparisonType2');

        reportSrvs.GetAMRPowerConsumptionReportData(
            $scope.block,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 1).then(function (res) {
                //console.log(res.data);
                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        console.log(res.data);
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);//res.data.Previous;
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);//res.data.Last;
                        last.categories = res.data.XCategories;

                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;

                        //console.log($scope.powerUpgradeSummary);

                    } else {
                        var unit = '';
                    }
                } else {
                    previous.data = updatedData.Previous;
                    last.data = updatedData.Last;
                }


                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };

                    Highcharts.setOptions({
                        lang: {
                            thousandsSep: ','
                        }
                    });
                    $('#armpowerconsumptioncomparison').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: last.categories,

                            //['NUH1', 'TTSH', 'NSC', 'AHS', 'KTPH', 'NUH2', 'NHGP1', 'NHGP2', 'NHGP3', 'NUH3', 'NHGP4', 'TTSH2', 'NHGP5', 'NHGP6', 'NHGP7'],
                            crosshair: true,
                            labels: {
                                rotation: 0
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'Consumption (kWh)',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} kWh',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId + "/" + this.category + "/" + dateEnds.lastStart.format('YYYY-MM-DD') + "/" + dateEnds.lastEnd.format('YYYY-MM-DD') + "/" + dateEnds.previousStart.format('YYYY-MM-DD') + "/" + dateEnds.previousEnd.format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c'
                        }
                        //, {
                        //    // Series that mimics the plot line
                        //    color: '#ee8176',
                        //    name: 'daily average',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(averagePlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(averagePlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}, {
                        //    // Series that mimics the plot line
                        //    color: '#9fa7b1',
                        //    name: 'historical peak load',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(peakPlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}
                        ]
                    });
                });
            });

        // for building type 2

        reportSrvs.GetAMRPowerConsumptionReportData(
            $scope.block,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 2).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUpType2.data = [];
                    last.data = [];
                    lastBackUpType2.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        console.log('second');
                        console.log(res.data);
                        previous.data = res.data.Previous;
                        previousBackUpType2.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUpType2.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;

                        $scope.powerUpgradeSummaryType2.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummaryType2.LastAverage = res.data.LastAverage;

                    } else {
                        var unit = '';
                    }
                } else {
                    previous.data = updatedData.PreviousType2;
                    last.data = updatedData.LastType2;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLineType2 = 'peakPlotLine'; // To identify for removal
                    averagePlotLineType2 = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOptionType2 = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummaryType2.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLineType2
                    };
                    averagePlotLineOptionType2 = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummaryType2.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLineType2
                    };


                    $('#armpowerconsumptioncomparisonType2').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: last.categories,

                            //['NUH1', 'TTSH', 'NSC', 'AHS', 'KTPH', 'NUH2', 'NHGP1', 'NHGP2', 'NHGP3', 'NUH3', 'NHGP4', 'TTSH2', 'NHGP5', 'NHGP6', 'NHGP7'],
                            crosshair: true,
                            labels: {
                                rotation: 0
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOptionType2, averagePlotLineOptionType2],
                            title: {
                                text: 'Consumption (kWh)',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} kWh',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId + "/" + this.category + "/" + dateEnds.lastStart.format('YYYY-MM-DD') + "/" + dateEnds.lastEnd.format('YYYY-MM-DD') + "/" + dateEnds.previousStart.format('YYYY-MM-DD') + "/" + dateEnds.previousEnd.format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c'
                        }
                        //, {
                        //    // Series that mimics the plot line
                        //    color: '#ee8176',
                        //    name: 'daily average',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(averagePlotLineType2);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(averagePlotLineOptionType2);
                        //            }
                        //        }
                        //    }
                        //}, {
                        //    // Series that mimics the plot line
                        //    color: '#9fa7b1',
                        //    name: 'historical peak load',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(peakPlotLineType2);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(peakPlotLineOptionType2);
                        //            }
                        //        }
                        //    }
                        //}
                        ]
                    });
                });
            });



    }
}])
.controller('amrpowerConsumptionblockviewCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };

    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;

    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.blockId = '-1';
    $scope.blockName = '';


    if (typeof $routeParams.blockId != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockId = $routeParams.blockId;
    }

    if (typeof $routeParams.blockName != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockName = $routeParams.blockName;
    }

    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
    }

    // date model its watcher
    $scope.date = 'lastweek';
    var dateEnds = {};
    var previous = {};
    var previousBackUp = {};
    var last = {};
    var lastBackUp = {};


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMM YYYY');

    // previous day
    dateEnds.previousStart = moment().subtract(2, 'days').startOf('day');
    dateEnds.previousEnd = moment().subtract(2, 'days').endOf('day');

    // current day
    dateEnds.lastStart = moment().subtract(1, 'days').startOf('day');
    dateEnds.lastEnd = moment().subtract(1, 'days').endOf('day');


    if (typeof $routeParams.lastFromDate != 'undefined'
        && typeof $routeParams.lastToDate != 'undefined'
        && typeof $routeParams.prevFromDate != 'undefined'
        && typeof $routeParams.prevToDate != 'undefined') {

        // current day
        dateEnds.lastStart = moment($routeParams.lastFromDate, "YYYY-MM-DD");
        dateEnds.lastEnd = moment($routeParams.lastToDate, "YYYY-MM-DD");

        // previous day
        dateEnds.previousStart = moment($routeParams.prevFromDate, "YYYY-MM-DD");
        dateEnds.previousEnd = moment($routeParams.prevToDate, "YYYY-MM-DD");
    }



    previous.name = "date before (" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMM') + " to " + dateEnds.previousEnd.format('D') + " " + dateEnds.previousEnd.format('MMM') + ")";
    last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');

        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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

        loadData();
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
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.viewDetailsClick = function () {
        window.location.href = "/NewHome/Index#/amrpowerconsumptiondetailview/" + $scope.blockId + "/" + $scope.blockName;
    }

    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMM YYYY');
    }

    var createCompareChart = function (updatedData) {

        spineService.CreateLoadingSpine('#armpowerconsumptioncomparison');

        reportSrvs.GetAMRPowerConsumptionBlockViewReportData(
            $scope.blockId,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 0).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;

                        angular.forEach(last.data, function (value, key) {
                            var check = moment(value.bId, 'YYYY/MM/DD HH:mm:ss');

                            var month = (parseInt(check.format('M')) - 1).toString();
                            var day = check.format('D');
                            var year = check.format('YYYY');
                            var hour = check.hour();
                            console.log(month, day, year, hour);
                            value.x = Date.UTC(year, month, day, hour);
                        });

                        angular.forEach(previous.data, function (value, key) {
                            var check = moment(value.bId, 'YYYY/MM/DD HH:mm:ss');

                            var month = (parseInt(check.format('M')) - 1).toString();
                            var day = check.format('D');
                            var year = check.format('YYYY');
                            var hour = check.hour();
                            console.log(month, day, year, hour);

                            value.x = Date.UTC(year, month, day, hour);
                        });

                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;


                    } else {
                        var unit = '';
                    }
                } else {
                    last.data = updatedData.Last;
                    previous.data = updatedData.Previous;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };

                    $('#armpowerconsumptioncomparison').highcharts({
                        chart: {
                            zoomType: 'xy',
                            events: {
                                load: function () {
                                    this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                                }
                            }
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        useUTC: false,
                        xAxis: [{
                            type: 'datetime',
                            //max: Date.UTC(dateEnds.lastEnd.format('YYYY'), dateEnds.lastEnd.format('M'), dateEnds.lastEnd.format('D'), 23, 59),//Date.parse("2017-07-03"),//Date.UTC(2017, 6, 2),
                            dateTimeLabelFormats: {
                                day: '%e %b',
                                hour: '%I:%M %P'
                            }
                            //categories: last.categories, //['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'], 
                            //crosshair: true,
                            //labels: {
                            //    rotation: 0,
                            //    formatter: function () {
                            //        if (
                            //                '8 am' === this.value ||
                            //                '9 am' === this.value ||
                            //                '10 am' === this.value ||
                            //                '11 am' === this.value ||
                            //                '12 pm' === this.value ||
                            //                '1 pm' === this.value ||
                            //                '2 pm' === this.value ||
                            //                '3 pm' === this.value ||
                            //                '4 pm' === this.value ||
                            //                '5 pm' === this.value ||
                            //                '6 pm' === this.value ||
                            //                '7 pm' === this.value ||
                            //                '8 pm' === this.value
                            //            ) {
                            //            return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                            //        } else {
                            //            return this.value;
                            //        }
                            //    }
                            //}
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'Consumption (kWh)',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} kWh',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                pointStart: moment.utc(dateEnds.lastStart.startOf('day')),//Date.UTC(2017, 6, 2),//Date.parse("2017-07-02"),//Date.UTC(2017, 6, 2),
                                pointInterval: 1 * 3600 * 1000, // one hour
                                cursor: 'pointer',
                                stickyTracking: false,
                                events: {
                                    click: function (evt) {
                                        //debugger;
                                        var points = this.chart.series.map(function (d) {
                                            return d.searchPoint(evt, true)
                                        });
                                        this.chart.myTooltip.refresh([points[0], points[1]], evt);
                                    },
                                    mouseOut: function () {
                                        this.chart.myTooltip.hide();
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true,
                            enabled: false
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            /* [
                             { x: Date.UTC(2017, 6, 2, 0), y: 49.9, low: 10, high: 100, bId: 1 },
                             { x: Date.UTC(2017, 6, 2, 1), y: 71.5, low: 10, high: 100, bId: 2 },
                             { x: Date.UTC(2017, 6, 2, 2), y: 106.4, low: 10, high: 100, bId: 3 },
                             { x: Date.UTC(2017, 6, 2, 3), y: 129.2, low: 10, high: 100, bId: 4 },
                             { x: Date.UTC(2017, 6, 2, 4), y: 144.0, low: 10, high: 100, bId: 5 },
                             { x: Date.UTC(2017, 6, 2, 5), y: 176.0, low: 10, high: 100, bId: 6 },
                             { x: Date.UTC(2017, 6, 2, 6), y: 135.6, low: 10, high: 100, bId: 7 },
                             { x: Date.UTC(2017, 6, 2, 7), y: 148.5, low: 10, high: 100, bId: 8 },
                             { x: Date.UTC(2017, 6, 2, 8), y: 216.4, low: 10, high: 100, bId: 9 },
                             { x: Date.UTC(2017, 6, 2, 9), y: 194.1, low: 10, high: 100, bId: 10 },
                             { x: Date.UTC(2017, 6, 2, 10), y: 95.6, low: 10, high: 100, bId: 11 },
                             { x: Date.UTC(2017, 6, 2, 11), y: 54.4, low: 10, high: 100, bId: 12 },
                             { x: Date.UTC(2017, 6, 2, 12), y: 45, low: 10, high: 100, bId: 13 },
                             { x: Date.UTC(2017, 6, 2, 13), y: 62, low: 10, high: 100, bId: 14 },
                             { x: Date.UTC(2017, 6, 2, 14), y: 35, low: 10, high: 100, bId: 15 }
                             ], */
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#bddaf5',
                            yAxis: 0

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            /*[
                            { x: Date.UTC(2017, 6, 2, 0), y: 49.9, low: 10, high: 100, bId: 1 },
                            { x: Date.UTC(2017, 6, 2, 1), y: 71.5, low: 10, high: 100, bId: 2 },
                            { x: Date.UTC(2017, 6, 2, 2), y: 106.4, low: 10, high: 100, bId: 3 },
                            { x: Date.UTC(2017, 6, 2, 3), y: 129.2, low: 10, high: 100, bId: 4 },
                            { x: Date.UTC(2017, 6, 2, 4), y: 144.0, low: 10, high: 100, bId: 5 },
                            { x: Date.UTC(2017, 6, 2, 5), y: 176.0, low: 10, high: 100, bId: 6 },
                            { x: Date.UTC(2017, 6, 2, 6), y: 135.6, low: 10, high: 100, bId: 7 },
                            { x: Date.UTC(2017, 6, 2, 7), y: 148.5, low: 10, high: 100, bId: 8 },
                            { x: Date.UTC(2017, 6, 2, 8), y: 216.4, low: 10, high: 100, bId: 9 },
                            { x: Date.UTC(2017, 6, 2, 9), y: 194.1, low: 10, high: 100, bId: 10 },
                            { x: Date.UTC(2017, 6, 2, 10), y: 95.6, low: 10, high: 100, bId: 11 },
                            { x: Date.UTC(2017, 6, 2, 11), y: 54.4, low: 10, high: 100, bId: 12 },
                            { x: Date.UTC(2017, 6, 2, 12), y: 45, low: 10, high: 100, bId: 13 },
                            { x: Date.UTC(2017, 6, 2, 13), y: 62, low: 10, high: 100, bId: 14 },
                            { x: Date.UTC(2017, 6, 2, 14), y: 35, low: 10, high: 100, bId: 15 }
                            ],*/
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0
                        }, {
                            // Series that mimics the plot line
                            color: '#ee8176',
                            name: 'contract capacity',
                            dashStyle: 'Solid',
                            marker: {
                                enabled: false
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (this.visible) {
                                        this.chart.yAxis[0].removePlotLine(averagePlotLine);
                                    }
                                    else {
                                        this.chart.yAxis[0].addPlotLine(averagePlotLineOption);
                                    }
                                }
                            },
                            yAxis: 0
                        }, {
                            // Series that mimics the plot line
                            color: '#9fa7b1',
                            name: 'max demand',
                            dashStyle: 'Solid',
                            marker: {
                                enabled: false
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (this.visible) {
                                        this.chart.yAxis[0].removePlotLine(peakPlotLine);
                                    }
                                    else {
                                        this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                                    }
                                }
                            },
                            yAxis: 0
                        }]
                    });
                });
            });
    }
}])
.controller('amremissionCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.powerUpgradeSummaryType2 = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;
    $scope.tensionName = "HT";
    $scope.IsHT = true;
    if (typeof $routeParams.tensionName != 'undefined') {
        //alert($routeParams.tensionName);
        $scope.tensionName = $routeParams.tensionName;
    }
    if ($scope.tensionName === "HT") {
        $scope.IsHT = true;
    } else {
        $scope.IsHT = false;
    }
    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
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


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMMM YYYY');

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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');
        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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

        loadData();
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
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }


    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        updatedData.LastType2 = lastBackUpType2.data;
        updatedData.PreviousType2 = previousBackUpType2.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        last.data = angular.copy(lastBackUpType2.data);
        previous.data = angular.copy(previousBackUpType2.data);

        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            last.data[i].y = (lastBackUpType2.data[i].y / lastBackUpType2.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            previous.data[i].y = (previousBackUpType2.data[i].y / previousBackUpType2.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.LastType2 = last.data;
        updatedData.PreviousType2 = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        last.data = angular.copy(lastBackUpType2.data);
        previous.data = angular.copy(previousBackUpType2.data);

        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            last.data[i].y = (lastBackUpType2.data[i].y / lastBackUpType2.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            previous.data[i].y = (previousBackUpType2.data[i].y / previousBackUpType2.data[i].BedNo).toFixed(2) / 1;
        }
        updatedData.LastType2 = last.data;
        updatedData.PreviousType2 = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMMM YYYY');
    }

    var createCompareChart = function (updatedData) {

        spineService.CreateLoadingSpine('#armpowerconsumptioncomparison');
        spineService.CreateLoadingSpine('#armpowerconsumptioncomparisonType2');

        reportSrvs.GetAMRPowerConsumptionReportData(
            $scope.block,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 1).then(function (res) {
                //console.log(res.data);
                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        console.log(res.data);
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);//res.data.Previous;
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);//res.data.Last;
                        last.categories = res.data.XCategories;

                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;

                        //console.log($scope.powerUpgradeSummary);

                    } else {
                        var unit = '';
                    }
                } else {
                    previous.data = updatedData.Previous;
                    last.data = updatedData.Last;
                }


                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };

                    Highcharts.setOptions({
                        lang: {
                            thousandsSep: ','
                        }
                    });
                    $('#armpowerconsumptioncomparison').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: last.categories,

                            //['NUH1', 'TTSH', 'NSC', 'AHS', 'KTPH', 'NUH2', 'NHGP1', 'NHGP2', 'NHGP3', 'NUH3', 'NHGP4', 'TTSH2', 'NHGP5', 'NHGP6', 'NHGP7'],
                            crosshair: true,
                            labels: {
                                rotation: 0
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                useHTML: true,
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                useHTML: true,
                                text: 'Consumption (CO<sub>2</sub>)',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                useHTML: true,
                                format: '{value} CO<sub>2</sub>',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            window.location.href = "/NewHome/Index#/amremissionblockview/" + this.bId + "/" + this.category + "/" + dateEnds.lastStart.format('YYYY-MM-DD') + "/" + dateEnds.lastEnd.format('YYYY-MM-DD') + "/" + dateEnds.previousStart.format('YYYY-MM-DD') + "/" + dateEnds.previousEnd.format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            useHTML: true,
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                useHTML: true,
                                valueSuffix: ' CO<sub>2</sub>'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                useHTML: true,
                                valueSuffix: ' CO<sub>2</sub>'
                            },
                            color: '#f7a35c'
                        }
                        //, {
                        //    // Series that mimics the plot line
                        //    color: '#ee8176',
                        //    name: 'daily average',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(averagePlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(averagePlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}, {
                        //    // Series that mimics the plot line
                        //    color: '#9fa7b1',
                        //    name: 'historical peak load',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(peakPlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}
                        ]
                    });
                });
            });

        // for building type 2

        reportSrvs.GetAMRPowerConsumptionReportData(
            $scope.block,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 2).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUpType2.data = [];
                    last.data = [];
                    lastBackUpType2.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        console.log('second');
                        console.log(res.data);
                        previous.data = res.data.Previous;
                        previousBackUpType2.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUpType2.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;

                        $scope.powerUpgradeSummaryType2.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummaryType2.LastAverage = res.data.LastAverage;

                    } else {
                        var unit = '';
                    }
                } else {
                    previous.data = updatedData.PreviousType2;
                    last.data = updatedData.LastType2;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLineType2 = 'peakPlotLine'; // To identify for removal
                    averagePlotLineType2 = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOptionType2 = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummaryType2.LastPeak,
                        label: { text: 'peak', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLineType2
                    };
                    averagePlotLineOptionType2 = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummaryType2.LastAverage,
                        label: { text: 'average', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLineType2
                    };


                    $('#armpowerconsumptioncomparisonType2').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: last.categories,

                            //['NUH1', 'TTSH', 'NSC', 'AHS', 'KTPH', 'NUH2', 'NHGP1', 'NHGP2', 'NHGP3', 'NUH3', 'NHGP4', 'TTSH2', 'NHGP5', 'NHGP6', 'NHGP7'],
                            crosshair: true,
                            labels: {
                                rotation: 0
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOptionType2, averagePlotLineOptionType2],
                            title: {
                                text: 'Consumption (kWh)',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} kWh',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId + "/" + this.category + "/" + dateEnds.lastStart.format('YYYY-MM-DD') + "/" + dateEnds.lastEnd.format('YYYY-MM-DD') + "/" + dateEnds.previousStart.format('YYYY-MM-DD') + "/" + dateEnds.previousEnd.format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c'
                        }
                        //, {
                        //    // Series that mimics the plot line
                        //    color: '#ee8176',
                        //    name: 'daily average',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(averagePlotLineType2);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(averagePlotLineOptionType2);
                        //            }
                        //        }
                        //    }
                        //}, {
                        //    // Series that mimics the plot line
                        //    color: '#9fa7b1',
                        //    name: 'historical peak load',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(peakPlotLineType2);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(peakPlotLineOptionType2);
                        //            }
                        //        }
                        //    }
                        //}
                        ]
                    });
                });
            });



    }
}])
.controller('amremissionblockviewCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };

    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;

    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.blockId = '-1';
    $scope.blockName = '';


    if (typeof $routeParams.blockId != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockId = $routeParams.blockId;
    }

    if (typeof $routeParams.blockName != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockName = $routeParams.blockName;
    }

    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
    }

    // date model its watcher
    $scope.date = 'lastweek';
    var dateEnds = {};
    var previous = {};
    var previousBackUp = {};
    var last = {};
    var lastBackUp = {};


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMM YYYY');

    // previous day
    dateEnds.previousStart = moment().subtract(2, 'days').startOf('day');
    dateEnds.previousEnd = moment().subtract(2, 'days').endOf('day');

    // current day
    dateEnds.lastStart = moment().subtract(1, 'days').startOf('day');
    dateEnds.lastEnd = moment().subtract(1, 'days').endOf('day');


    if (typeof $routeParams.lastFromDate != 'undefined'
        && typeof $routeParams.lastToDate != 'undefined'
        && typeof $routeParams.prevFromDate != 'undefined'
        && typeof $routeParams.prevToDate != 'undefined') {

        // current day
        dateEnds.lastStart = moment($routeParams.lastFromDate, "YYYY-MM-DD");
        dateEnds.lastEnd = moment($routeParams.lastToDate, "YYYY-MM-DD");

        // previous day
        dateEnds.previousStart = moment($routeParams.prevFromDate, "YYYY-MM-DD");
        dateEnds.previousEnd = moment($routeParams.prevToDate, "YYYY-MM-DD");
    }



    previous.name = "date before (" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMM') + " to " + dateEnds.previousEnd.format('D') + " " + dateEnds.previousEnd.format('MMM') + ")";
    last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');

        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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

        loadData();
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
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.viewDetailsClick = function () {
        window.location.href = "/NewHome/Index#/amrpowerconsumptiondetailview/" + $scope.blockId + "/" + $scope.blockName;
    }

    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMM YYYY');
    }

    var createCompareChart = function (updatedData) {

        spineService.CreateLoadingSpine('#armpowerconsumptioncomparison');

        reportSrvs.GetAMRPowerConsumptionBlockViewReportData(
            $scope.blockId,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 0).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;




                        angular.forEach(last.data, function (value, key) {

                            var check = moment(value.bId, 'YYYY/MM/DD HH:mm:ss');

                            var month = (parseInt(check.format('M')) - 1).toString();
                            var day = check.format('D');
                            var year = check.format('YYYY');
                            var hour = check.hour();
                            console.log(month, day, year, hour);
                            value.x = Date.UTC(year, month, day, hour);
                        });

                        angular.forEach(previous.data, function (value, key) {
                            var check = moment(value.bId, 'YYYY/MM/DD HH:mm:ss');

                            var month = (parseInt(check.format('M')) - 1).toString();
                            var day = check.format('D');
                            var year = check.format('YYYY');
                            var hour = check.hour();
                            console.log(month, day, year, hour);

                            value.x = Date.UTC(year, month, day, hour);
                        });

                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;


                    } else {
                        var unit = '';
                    }
                } else {
                    last.data = updatedData.Last;
                    previous.data = updatedData.Previous;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };

                    $('#armpowerconsumptioncomparison').highcharts({
                        chart: {
                            zoomType: 'xy',
                            events: {
                                load: function () {
                                    this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                                }
                            }
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        useUTC: false,
                        xAxis: [{
                            type: 'datetime',
                            //max: Date.UTC(dateEnds.lastEnd.format('YYYY'), dateEnds.lastEnd.format('M'), dateEnds.lastEnd.format('D'), 23, 59),//Date.parse("2017-07-03"),//Date.UTC(2017, 6, 2),
                            dateTimeLabelFormats: {
                                day: '%e %b',
                                hour: '%I:%M %P'
                            }
                            //categories: last.categories, //['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'], 
                            //crosshair: true,
                            //labels: {
                            //    rotation: 0,
                            //    formatter: function () {
                            //        if (
                            //                '8 am' === this.value ||
                            //                '9 am' === this.value ||
                            //                '10 am' === this.value ||
                            //                '11 am' === this.value ||
                            //                '12 pm' === this.value ||
                            //                '1 pm' === this.value ||
                            //                '2 pm' === this.value ||
                            //                '3 pm' === this.value ||
                            //                '4 pm' === this.value ||
                            //                '5 pm' === this.value ||
                            //                '6 pm' === this.value ||
                            //                '7 pm' === this.value ||
                            //                '8 pm' === this.value
                            //            ) {
                            //            return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                            //        } else {
                            //            return this.value;
                            //        }
                            //    }
                            //}
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'Consumption (kWh)',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} kWh',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                pointStart: moment.utc(dateEnds.lastStart.startOf('day')),//Date.UTC(2017, 6, 2),//Date.parse("2017-07-02"),//Date.UTC(2017, 6, 2),
                                pointInterval: 1 * 3600 * 1000, // one hour
                                cursor: 'pointer',
                                stickyTracking: false,
                                events: {
                                    click: function (evt) {
                                        //debugger;
                                        var points = this.chart.series.map(function (d) {
                                            return d.searchPoint(evt, true)
                                        });
                                        this.chart.myTooltip.refresh([points[0], points[1]], evt);
                                    },
                                    mouseOut: function () {
                                        this.chart.myTooltip.hide();
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true,
                            enabled: false
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            /* [
                             { x: Date.UTC(2017, 6, 2, 0), y: 49.9, low: 10, high: 100, bId: 1 },
                             { x: Date.UTC(2017, 6, 2, 1), y: 71.5, low: 10, high: 100, bId: 2 },
                             { x: Date.UTC(2017, 6, 2, 2), y: 106.4, low: 10, high: 100, bId: 3 },
                             { x: Date.UTC(2017, 6, 2, 3), y: 129.2, low: 10, high: 100, bId: 4 },
                             { x: Date.UTC(2017, 6, 2, 4), y: 144.0, low: 10, high: 100, bId: 5 },
                             { x: Date.UTC(2017, 6, 2, 5), y: 176.0, low: 10, high: 100, bId: 6 },
                             { x: Date.UTC(2017, 6, 2, 6), y: 135.6, low: 10, high: 100, bId: 7 },
                             { x: Date.UTC(2017, 6, 2, 7), y: 148.5, low: 10, high: 100, bId: 8 },
                             { x: Date.UTC(2017, 6, 2, 8), y: 216.4, low: 10, high: 100, bId: 9 },
                             { x: Date.UTC(2017, 6, 2, 9), y: 194.1, low: 10, high: 100, bId: 10 },
                             { x: Date.UTC(2017, 6, 2, 10), y: 95.6, low: 10, high: 100, bId: 11 },
                             { x: Date.UTC(2017, 6, 2, 11), y: 54.4, low: 10, high: 100, bId: 12 },
                             { x: Date.UTC(2017, 6, 2, 12), y: 45, low: 10, high: 100, bId: 13 },
                             { x: Date.UTC(2017, 6, 2, 13), y: 62, low: 10, high: 100, bId: 14 },
                             { x: Date.UTC(2017, 6, 2, 14), y: 35, low: 10, high: 100, bId: 15 }
                             ], */
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#bddaf5',
                            yAxis: 0

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            /*[
                            { x: Date.UTC(2017, 6, 2, 0), y: 49.9, low: 10, high: 100, bId: 1 },
                            { x: Date.UTC(2017, 6, 2, 1), y: 71.5, low: 10, high: 100, bId: 2 },
                            { x: Date.UTC(2017, 6, 2, 2), y: 106.4, low: 10, high: 100, bId: 3 },
                            { x: Date.UTC(2017, 6, 2, 3), y: 129.2, low: 10, high: 100, bId: 4 },
                            { x: Date.UTC(2017, 6, 2, 4), y: 144.0, low: 10, high: 100, bId: 5 },
                            { x: Date.UTC(2017, 6, 2, 5), y: 176.0, low: 10, high: 100, bId: 6 },
                            { x: Date.UTC(2017, 6, 2, 6), y: 135.6, low: 10, high: 100, bId: 7 },
                            { x: Date.UTC(2017, 6, 2, 7), y: 148.5, low: 10, high: 100, bId: 8 },
                            { x: Date.UTC(2017, 6, 2, 8), y: 216.4, low: 10, high: 100, bId: 9 },
                            { x: Date.UTC(2017, 6, 2, 9), y: 194.1, low: 10, high: 100, bId: 10 },
                            { x: Date.UTC(2017, 6, 2, 10), y: 95.6, low: 10, high: 100, bId: 11 },
                            { x: Date.UTC(2017, 6, 2, 11), y: 54.4, low: 10, high: 100, bId: 12 },
                            { x: Date.UTC(2017, 6, 2, 12), y: 45, low: 10, high: 100, bId: 13 },
                            { x: Date.UTC(2017, 6, 2, 13), y: 62, low: 10, high: 100, bId: 14 },
                            { x: Date.UTC(2017, 6, 2, 14), y: 35, low: 10, high: 100, bId: 15 }
                            ],*/
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0
                        }, {
                            // Series that mimics the plot line
                            color: '#ee8176',
                            name: 'contract capacity',
                            dashStyle: 'Solid',
                            marker: {
                                enabled: false
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (this.visible) {
                                        this.chart.yAxis[0].removePlotLine(averagePlotLine);
                                    }
                                    else {
                                        this.chart.yAxis[0].addPlotLine(averagePlotLineOption);
                                    }
                                }
                            },
                            yAxis: 0
                        }, {
                            // Series that mimics the plot line
                            color: '#9fa7b1',
                            name: 'max demand',
                            dashStyle: 'Solid',
                            marker: {
                                enabled: false
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (this.visible) {
                                        this.chart.yAxis[0].removePlotLine(peakPlotLine);
                                    }
                                    else {
                                        this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                                    }
                                }
                            },
                            yAxis: 0
                        }]
                    });
                });
            });
    }
}])
.controller('amrbillCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.powerUpgradeSummaryType2 = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;
    $scope.tensionName = "HT";
    $scope.IsHT = true;
    if (typeof $routeParams.tensionName != 'undefined') {
        //alert($routeParams.tensionName);
        $scope.tensionName = $routeParams.tensionName;
    }
    if ($scope.tensionName === "HT") {
        $scope.IsHT = true;
    } else {
        $scope.IsHT = false;
    }
    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
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


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMMM YYYY');

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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');
        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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

        loadData();
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
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        updatedData.LastType2 = lastBackUpType2.data;
        updatedData.PreviousType2 = previousBackUpType2.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        last.data = angular.copy(lastBackUpType2.data);
        previous.data = angular.copy(previousBackUpType2.data);

        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            last.data[i].y = (lastBackUpType2.data[i].y / lastBackUpType2.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            previous.data[i].y = (previousBackUpType2.data[i].y / previousBackUpType2.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.LastType2 = last.data;
        updatedData.PreviousType2 = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        last.data = angular.copy(lastBackUpType2.data);
        previous.data = angular.copy(previousBackUpType2.data);

        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            last.data[i].y = (lastBackUpType2.data[i].y / lastBackUpType2.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < lastBackUpType2.data.length; i++) {
            previous.data[i].y = (previousBackUpType2.data[i].y / previousBackUpType2.data[i].BedNo).toFixed(2) / 1;
        }
        updatedData.LastType2 = last.data;
        updatedData.PreviousType2 = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMMM YYYY');
    }

    var createCompareChart = function (updatedData) {

        spineService.CreateLoadingSpine('#armpowerconsumptioncomparison');
        spineService.CreateLoadingSpine('#armpowerconsumptioncomparisonType2');

        reportSrvs.GetAMRBillReportData(
            $scope.block,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 1).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        //console.log(res.data);
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);//res.data.Previous;
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);//res.data.Last;
                        last.categories = res.data.XCategories;
                        //console.log(last.data);
                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;

                    } else {
                        var unit = '';
                    }
                } else {
                    previous.data = updatedData.Previous;
                    last.data = updatedData.Last;
                }


                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumptioncomparison').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: last.categories,

                            //['NUH1', 'TTSH', 'NSC', 'AHS', 'KTPH', 'NUH2', 'NHGP1', 'NHGP2', 'NHGP3', 'NUH3', 'NHGP4', 'TTSH2', 'NHGP5', 'NHGP6', 'NHGP7'],
                            crosshair: true,
                            labels: {
                                rotation: 0
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f} SGD',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'Bill',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} SGD',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            window.location.href = "/NewHome/Index#/amrbillblockview/" + this.bId + "/" + this.category + "/" + dateEnds.lastStart.format('YYYY-MM-DD') + "/" + dateEnds.lastEnd.format('YYYY-MM-DD') + "/" + dateEnds.previousStart.format('YYYY-MM-DD') + "/" + dateEnds.previousEnd.format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' SGD'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' SGD'
                            },
                            color: '#f7a35c'
                        }
                        //, {
                        //    // Series that mimics the plot line
                        //    color: '#ee8176',
                        //    name: 'daily average',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[1].removePlotLine(averagePlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[1].addPlotLine(averagePlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}, {
                        //    // Series that mimics the plot line
                        //    color: '#9fa7b1',
                        //    name: 'historical peak load',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(peakPlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}
                        ]
                    });
                });
            });

        // for building type 2

        reportSrvs.GetAMRBillReportData(
            $scope.block,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 2).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUpType2.data = [];
                    last.data = [];
                    lastBackUpType2.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        previous.data = res.data.Previous;
                        previousBackUpType2.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUpType2.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;

                        $scope.powerUpgradeSummaryType2.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummaryType2.LastAverage = res.data.LastAverage;

                    } else {
                        var unit = '';
                    }
                } else {
                    previous.data = updatedData.PreviousType2;
                    last.data = updatedData.LastType2;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummaryType2.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummaryType2.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumptioncomparisonType2').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: last.categories,

                            //['NUH1', 'TTSH', 'NSC', 'AHS', 'KTPH', 'NUH2', 'NHGP1', 'NHGP2', 'NHGP3', 'NUH3', 'NHGP4', 'TTSH2', 'NHGP5', 'NHGP6', 'NHGP7'],
                            crosshair: true,
                            labels: {
                                rotation: 0
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f} SGD',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'Bill',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} SGD',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId + "/" + this.category + "/" + dateEnds.lastStart + "/" + dateEnds.lastEnd + "/" + dateEnds.previousStart + "/" + dateEnds.previousEnd;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' SGD'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' SGD'
                            },
                            color: '#f7a35c'
                        }
                        //, {
                        //    // Series that mimics the plot line
                        //    color: '#ee8176',
                        //    name: 'daily average',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(averagePlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(averagePlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}, {
                        //    // Series that mimics the plot line
                        //    color: '#9fa7b1',
                        //    name: 'historical peak load',
                        //    dashStyle: 'Solid',
                        //    marker: {
                        //        enabled: false
                        //    },
                        //    events: {
                        //        legendItemClick: function (e) {
                        //            if (this.visible) {
                        //                this.chart.yAxis[0].removePlotLine(peakPlotLine);
                        //            }
                        //            else {
                        //                this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                        //            }
                        //        }
                        //    }
                        //}
                        ]
                    });
                });
            });



    }
}])
.controller('amrbillblockviewCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };

    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;

    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.blockId = '-1';
    $scope.blockName = '';


    if (typeof $routeParams.blockId != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockId = $routeParams.blockId;
    }

    if (typeof $routeParams.blockName != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockName = $routeParams.blockName;
    }

    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
    }

    // date model its watcher
    $scope.date = 'lastweek';
    var dateEnds = {};
    var previous = {};
    var previousBackUp = {};
    var last = {};
    var lastBackUp = {};


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMMM YYYY');

    // previous day
    dateEnds.previousStart = moment().subtract(2, 'days').startOf('day');
    dateEnds.previousEnd = moment().subtract(2, 'days').endOf('day');

    // current day
    dateEnds.lastStart = moment().subtract(1, 'days').startOf('day');
    dateEnds.lastEnd = moment().subtract(1, 'days').endOf('day');


    if (typeof $routeParams.lastFromDate != 'undefined'
        && typeof $routeParams.lastToDate != 'undefined'
        && typeof $routeParams.prevFromDate != 'undefined'
        && typeof $routeParams.prevToDate != 'undefined') {

        // current day
        dateEnds.lastStart = moment($routeParams.lastFromDate, "YYYY-MM-DD");
        dateEnds.lastEnd = moment($routeParams.lastToDate, "YYYY-MM-DD");

        // previous day
        dateEnds.previousStart = moment($routeParams.prevFromDate, "YYYY-MM-DD");
        dateEnds.previousEnd = moment($routeParams.prevToDate, "YYYY-MM-DD");
    }

    previous.name = "date before (" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMM') + " to " + dateEnds.previousEnd.format('D') + " " + dateEnds.previousEnd.format('MMM') + ")";
    last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');

        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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

        loadData();
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
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMMM YYYY');
    }

    var createCompareChart = function (updatedData) {

        spineService.CreateLoadingSpine('#armpowerconsumptioncomparison');

        reportSrvs.GetAMRBillBlockViewReportData(
            $scope.blockId,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 0).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;

                        angular.forEach(last.data, function (value, key) {

                            var check = moment(value.bId, 'YYYY/MM/DD HH:mm:ss');

                            var month = (parseInt(check.format('M')) - 1).toString();
                            var day = check.format('D');
                            var year = check.format('YYYY');
                            var hour = check.hour();
                            console.log(month, day, year, hour);
                            value.x = Date.UTC(year, month, day, hour);
                        });

                        angular.forEach(previous.data, function (value, key) {
                            var check = moment(value.bId, 'YYYY/MM/DD HH:mm:ss');

                            var month = (parseInt(check.format('M')) - 1).toString();
                            var day = check.format('D');
                            var year = check.format('YYYY');
                            var hour = check.hour();
                            console.log(month, day, year, hour);

                            value.x = Date.UTC(year, month, day, hour);
                        });

                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;

                    } else {
                        var unit = '';
                    }
                } else {
                    last.data = updatedData.Last;
                    previous.data = updatedData.Previous;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: $scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumptioncomparison').highcharts({
                        chart: {
                            zoomType: 'xy',
                            events: {
                                load: function () {
                                    this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                                }
                            }
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            type: 'datetime',
                            //max: Date.UTC(dateEnds.lastEnd.format('YYYY'), dateEnds.lastEnd.format('M'), dateEnds.lastEnd.format('D'), 23, 59),//Date.parse("2017-07-03"),//Date.UTC(2017, 6, 2),
                            dateTimeLabelFormats: {
                                day: '%e %b',
                                hour: '%I:%M %P'
                            }
                            //categories: last.categories,//['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'],
                            //crosshair: true,
                            //labels: {
                            //    rotation: 0,
                            //    formatter: function () {
                            //        if (
                            //                '8 am' === this.value ||
                            //                '9 am' === this.value ||
                            //                '10 am' === this.value ||
                            //                '11 am' === this.value ||
                            //                '12 pm' === this.value ||
                            //                '1 pm' === this.value ||
                            //                '2 pm' === this.value ||
                            //                '3 pm' === this.value ||
                            //                '4 pm' === this.value ||
                            //                '5 pm' === this.value ||
                            //                '6 pm' === this.value ||
                            //                '7 pm' === this.value ||
                            //                '8 pm' === this.value
                            //            ) {
                            //            return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                            //        } else {
                            //            return this.value;
                            //        }
                            //    }
                            //}
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f} SGD',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'Bill',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} SGD',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                pointStart: moment.utc(dateEnds.lastStart.startOf('day')),//Date.UTC(2017, 6, 2),//Date.parse("2017-07-02"),//Date.UTC(2017, 6, 2),
                                pointInterval: 1 * 3600 * 1000, // one hour
                                cursor: 'pointer',
                                stickyTracking: false,
                                events: {
                                    click: function (evt) {
                                        //debugger;
                                        var points = this.chart.series.map(function (d) {
                                            return d.searchPoint(evt, true)
                                        });
                                        this.chart.myTooltip.refresh([points[0], points[1]], evt);
                                    },
                                    mouseOut: function () {
                                        this.chart.myTooltip.hide();
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true,
                            enabled: false
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'column',
                            data: last.data,

                            //    [
                            //    { y: 49.9, bId: 1 },
                            //    { y: 71.5, bId: 2 },
                            //    { y: 106.4, bId: 3 },
                            //    { y: 129.2, bId: 4 },
                            //    { y: 144.0, bId: 5 },
                            //    { y: 176.0, bId: 6 },
                            //    { y: 135.6, bId: 7 },
                            //    { y: 148.5, bId: 8 },
                            //    { y: 216.4, bId: 9 },
                            //    { y: 194.1, bId: 10 },
                            //    { y: 95.6, bId: 11 },
                            //    { y: 54.4, bId: 12 },
                            //    { y: 45, bId: 13 },
                            //    { y: 62, bId: 14 },
                            //    { y: 35, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' SGD'
                            },
                            color: '#bddaf5'

                        }, {
                            name: previous.name,
                            type: 'line',
                            data: previous.data,
                            //    [
                            //    { y: 35, bId: 1 },
                            //    { y: 63, bId: 2 },
                            //    { y: 96, bId: 3 },
                            //    { y: 112, bId: 4 },
                            //    { y: 90, bId: 5 },
                            //    { y: 155, bId: 6 },
                            //    { y: 150, bId: 7 },
                            //    { y: 112, bId: 8 },
                            //    { y: 180, bId: 9 },
                            //    { y: 170, bId: 10 },
                            //    { y: 42, bId: 11 },
                            //    { y: 96, bId: 12 },
                            //    { y: 36, bId: 13 },
                            //    { y: 55, bId: 14 },
                            //    { y: 59, bId: 15 }
                            //],
                            tooltip: {
                                valueSuffix: ' SGD'
                            },
                            color: '#f7a35c'
                        }, {
                            // Series that mimics the plot line
                            color: '#ee8176',
                            name: 'contract capacity',
                            dashStyle: 'Solid',
                            marker: {
                                enabled: false
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (this.visible) {
                                        this.chart.yAxis[0].removePlotLine(averagePlotLine);
                                    }
                                    else {
                                        this.chart.yAxis[0].addPlotLine(averagePlotLineOption);
                                    }
                                }
                            }
                        }, {
                            // Series that mimics the plot line
                            color: '#9fa7b1',
                            name: 'max demand',//'historical peak load',
                            dashStyle: 'Solid',
                            marker: {
                                enabled: false
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (this.visible) {
                                        this.chart.yAxis[0].removePlotLine(peakPlotLine);
                                    }
                                    else {
                                        this.chart.yAxis[0].addPlotLine(peakPlotLineOption);
                                    }
                                }
                            }
                        }]
                    });
                });
            });
    }
}])
.controller('amrpowerConsumptiondetailviewCtrl', ['$scope', 'reportSrvs', 'spineService', '$routeParams', function ($scope, reportSrvs, spineService, $routeParams) {
    $scope.numberWithCommas = function (x) {
        if (x === null) {
            return "0";
        }
        if (x >= 1000) {
            x = x.toFixed(0);
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $scope.totalPowerConsumption = {
        timerange: null,
        value: null
    };
    $scope.highestPowerConsumption = {
        block: null,
        value: null
    };
    $scope.lowestPowerConsumption = {
        block: null,
        value: null
    };

    $scope.powerUpgradeSummary = {
        TotalPowerConsumptionLast: null,
        TotalPowerConsumptionUpgradePercentage: null,
        BiggestIncreaseLastLabel: null,
        BiggestIncreaseLast: null,
        BiggestIncreaseUpgradePercentage: null,
        BiggestDecreaseLastLabel: null,
        BiggestDecreaseLast: null,
        BiggestDecreaseUpgradePercentage: null,
        LastPeak: null,
        LastAverage: null
    };
    $scope.totalAlert = 0;

    // flag for block and date change
    var chartLoadCount = 0;

    // get all block
    $scope.blockesList = null;
    reportSrvs.GetAllBlocks().then(function (res) {
        $scope.blockesList = res.data.model;
    });

    // block select model and its watcher
    $scope.block = '-1';
    $scope.blockId = '-1';
    $scope.blockName = '';


    if (typeof $routeParams.blockId != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockId = $routeParams.blockId;
    }

    if (typeof $routeParams.blockName != 'undefined') {
        //alert($routeParams.blockId);
        $scope.blockName = $routeParams.blockName;
    }

    $scope.$watch('block', function () {
        if (chartLoadCount != 1) {
            loadData();
            chartLoadCount++;
        } else {
            chartLoadCount++;
        }

    });

    var initialize = function () {
        // reinitialize
        $scope.totalPowerConsumption = {
            timerange: null,
            value: null
        };
        $scope.highestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.lowestPowerConsumption = {
            block: null,
            value: null
        }
        $scope.totalAlert = 0;
    }

    // date model its watcher
    $scope.date = 'lastweek';
    var dateEnds = {};
    var previous = {};
    var previousBackUp = {};
    var last = {};
    var lastBackUp = {};


    $scope.DisplayTitleDateTime = moment().subtract(1, 'days').startOf('day').format('DD MMM YYYY');

    // previous day
    dateEnds.previousStart = moment().subtract(2, 'days').startOf('day');
    dateEnds.previousEnd = moment().subtract(2, 'days').endOf('day');

    // current day
    dateEnds.lastStart = moment().subtract(1, 'days').startOf('day');
    dateEnds.lastEnd = moment().subtract(1, 'days').endOf('day');


    if (typeof $routeParams.lastFromDate != 'undefined'
        && typeof $routeParams.lastToDate != 'undefined'
        && typeof $routeParams.prevFromDate != 'undefined'
        && typeof $routeParams.prevToDate != 'undefined') {

        // current day
        dateEnds.lastStart = moment($routeParams.lastFromDate, "YYYY-MM-DD");
        dateEnds.lastEnd = moment($routeParams.lastToDate, "YYYY-MM-DD");

        // previous day
        dateEnds.previousStart = moment($routeParams.prevFromDate, "YYYY-MM-DD");
        dateEnds.previousEnd = moment($routeParams.prevToDate, "YYYY-MM-DD");
    }



    previous.name = "date before (" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMM') + " to " + dateEnds.previousEnd.format('D') + " " + dateEnds.previousEnd.format('MMM') + ")";
    last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

    $scope.IsReportVisible = false;
    $scope.goClick = function () {
        $scope.IsReportVisible = true;
        createCompareChart(null);
    }


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

        loadData();
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

        loadData();
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

        loadData();
    }

    $scope.customClick = function () {
        $(".previewButton").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnCustom'));
        myEl.addClass('activeButton');

        //debugger;
        $('#customDate').daterangepicker(
            {
                linkedCalendars: false,
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
                    moment().date(1).subtract(1, 'days')]
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

        loadData();
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
            dateEnds.previousEnd = moment($('#customDate').data('daterangepicker').endDate, "MM-DD-YYYY").subtract(dateDiff, 'days').endOf('day');

            //console.log(dateEnds.previousStart); //$scope.customDate);
            //console.log(dateEnds.previousEnd);

            previous.name = "date before (" + dateEnds.previousStart.format('D') + " " + dateEnds.previousStart.format('MMM') + " to " + dateEnds.previousEnd.format('D') + " " + dateEnds.previousEnd.format('MMM') + ")";
            last.name = "date (" + dateEnds.lastStart.format('D') + " " + dateEnds.lastStart.format('MMM') + " to " + dateEnds.lastEnd.format('D') + " " + dateEnds.lastEnd.format('MMM') + ")";

            //$('#customDate').daterangepicker("hide");

            loadData();
        }
    });

    $scope.nextDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(7, 'days');

            dateEnds.lastStart = moment(dateEnds.lastStart).add(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).add(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).add(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).add(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).add(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.previousDateSlot = function () {
        if ($scope.date == 'lastweek') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(7, 'days');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(7, 'days');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(7, 'days');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(7, 'days');
        }
        else if ($scope.date == 'lastmonth') {
            dateEnds.previousStart = moment(dateEnds.previousStart).subtract(1, 'months').startOf('month');
            dateEnds.previousEnd = moment(dateEnds.previousEnd).subtract(1, 'months').endOf('month');
            dateEnds.lastStart = moment(dateEnds.lastStart).subtract(1, 'months').startOf('month');
            dateEnds.lastEnd = moment(dateEnds.lastEnd).subtract(1, 'months').endOf('month');
        }

        loadData();
    }

    $scope.viewDetailsClick = function () {
        window.location.href = "/NewHome/Index#/amrpowerconsumptiondetailview/";
    }

    $scope.totalClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnTotal'));
        myEl.addClass('activeButton');

        updatedData.Last = lastBackUp.data;
        updatedData.Previous = previousBackUp.data;

        createCompareChart(updatedData);
    }

    $scope.gfaClick = function () {
        //debugger;
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnGFA'));
        myEl.addClass('activeButton');
        //console.log(last);

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].GFA).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].GFA).toFixed(2) / 1;
        }
        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    $scope.bedsClick = function () {
        var updatedData = {};
        $(".previewButtonAvg").removeClass("activeButton");
        var myEl = angular.element(document.querySelector('#btnBeds'));
        myEl.addClass('activeButton');

        last.data = angular.copy(lastBackUp.data);
        previous.data = angular.copy(previousBackUp.data);

        for (var i = 0; i < last.data.length; i++) {
            last.data[i].y = (lastBackUp.data[i].y / lastBackUp.data[i].BedNo).toFixed(2) / 1;
        }
        for (var i = 0; i < previous.data.length; i++) {
            previous.data[i].y = (previousBackUp.data[i].y / previousBackUp.data[i].BedNo).toFixed(2) / 1;
        }

        updatedData.Last = last.data;
        updatedData.Previous = previous.data;

        createCompareChart(updatedData);
    }

    var loadData = function () {
        initialize();
        //loadPowerConsumptionReportDashboardData();
        //createCompareChart(null);
        $scope.DisplayTitleDateTime = dateEnds.lastStart.format('DD MMM YYYY') + ' to ' + dateEnds.lastEnd.format('DD MMM YYYY');
    }

    var createCompareChart = function (updatedData) {
        spineService.CreateLoadingSpine('#armpowerconsumption1');
        spineService.CreateLoadingSpine('#armpowerconsumption2');
        spineService.CreateLoadingSpine('#armpowerconsumption3');
        spineService.CreateLoadingSpine('#armpowerconsumption4');
        spineService.CreateLoadingSpine('#armpowerconsumption5');
        spineService.CreateLoadingSpine('#armpowerconsumption6');




        reportSrvs.GetAMRPowerConsumptionBlockViewReportData(
            $scope.blockId,
            'OverallPowerConsumption',
            dateEnds.previousStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.previousEnd.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastStart.format('YYYY-MM-DDTHH-mm-ss'),
            dateEnds.lastEnd.format('YYYY-MM-DDTHH-mm-ss'), 0).then(function (res) {

                if (updatedData === null) {
                    previous.data = [];
                    previousBackUp.data = [];
                    last.data = [];
                    lastBackUp.data = [];
                    last.categories = [];

                    if (res.data && res.data != null) {
                        var unit = res.data.Unit;
                        previous.data = res.data.Previous;
                        previousBackUp.data = angular.copy(previous.data);
                        last.data = res.data.Last;
                        lastBackUp.data = angular.copy(last.data);
                        last.categories = res.data.XCategories;

                        // dashboard data
                        $scope.powerUpgradeSummary.TotalPowerConsumptionLast = res.data.TotalPowerConsumptionLast;
                        $scope.powerUpgradeSummary.TotalPowerConsumptionUpgradePercentage = res.data.TotalPowerConsumptionUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestIncreaseLastLabel = res.data.BiggestIncreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestIncreaseLast = res.data.BiggestIncreaseLast;
                        $scope.powerUpgradeSummary.BiggestIncreaseUpgradePercentage = res.data.BiggestIncreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.BiggestDecreaseLastLabel = res.data.BiggestDecreaseLastLabel;
                        $scope.powerUpgradeSummary.BiggestDecreaseLast = res.data.BiggestDecreaseLast;
                        $scope.powerUpgradeSummary.BiggestDecreaseUpgradePercentage = res.data.BiggestDecreaseUpgradePercentage;

                        $scope.powerUpgradeSummary.LastPeak = res.data.LastPeak;
                        $scope.powerUpgradeSummary.LastAverage = res.data.LastAverage;


                    } else {
                        var unit = '';
                    }
                } else {
                    last.data = updatedData.Last;
                    previous.data = updatedData.Previous;
                }

                //console.log(res.data.TotalPowerConsumptionLast+' : '+res.data.TotalPowerConsumptionUpgradePercentage);
                //console.log(last.data);
                //console.log(last.categories);

                // begin: power consumption 1
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: 241,//$scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: 236,//$scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumption1').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'], // last.categories, //
                            crosshair: true,
                            labels: {
                                rotation: 0,
                                formatter: function () {
                                    if (
                                            '8:00 am' === this.value ||
                                            '8:30 am' === this.value ||
                                            '9:00 am' === this.value ||
                                            '9:30 am' === this.value ||
                                            '10:00 am' === this.value ||
                                            '10:30 am' === this.value ||
                                            '11:00 am' === this.value ||
                                            '11:30 am' === this.value ||
                                            '12:00 pm' === this.value ||
                                            '12:30 pm' === this.value ||
                                            '1:00 pm' === this.value ||
                                            '1:30 pm' === this.value ||
                                            '2:00 pm' === this.value ||
                                            '2:30 pm' === this.value ||
                                            '3:00 pm' === this.value ||
                                            '3:30 pm' === this.value ||
                                            '4:00 pm' === this.value ||
                                            '4:30 pm' === this.value ||
                                            '5:00 pm' === this.value ||
                                            '5:30 pm' === this.value ||
                                            '6:00 pm' === this.value ||
                                            '6:30 pm' === this.value ||
                                            '7:00 pm' === this.value ||
                                            '7:30 pm' === this.value ||
                                            '8:00 pm' === this.value ||
                                            '8:30 pm' === this.value
                                        ) {
                                        return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'L1 Voltage',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            //window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'line',
                            data: //last.data,

                            [243, 243, 243, 243, 243, 240, 240, 240, 240, 243, 243, 243, 243, 243, 243, 243, 243, 243, 237, 237, 237, 237, 237, 243, 243, 243, 243, 243, 243, 233, 233, 233, 243, 243, 230, 230, 243, 243, 243, 243, 243, 243, 243, 243, 243, 243, 243, 243
                            ],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0

                        }]
                    });
                });
                // end: power consumption 1

                // begin: power consumption 2
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: 241,//$scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: 236,//$scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumption2').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'], // last.categories, //
                            crosshair: true,
                            labels: {
                                rotation: 0,
                                formatter: function () {
                                    if (
                                            '8:00 am' === this.value ||
                                            '8:30 am' === this.value ||
                                            '9:00 am' === this.value ||
                                            '9:30 am' === this.value ||
                                            '10:00 am' === this.value ||
                                            '10:30 am' === this.value ||
                                            '11:00 am' === this.value ||
                                            '11:30 am' === this.value ||
                                            '12:00 pm' === this.value ||
                                            '12:30 pm' === this.value ||
                                            '1:00 pm' === this.value ||
                                            '1:30 pm' === this.value ||
                                            '2:00 pm' === this.value ||
                                            '2:30 pm' === this.value ||
                                            '3:00 pm' === this.value ||
                                            '3:30 pm' === this.value ||
                                            '4:00 pm' === this.value ||
                                            '4:30 pm' === this.value ||
                                            '5:00 pm' === this.value ||
                                            '5:30 pm' === this.value ||
                                            '6:00 pm' === this.value ||
                                            '6:30 pm' === this.value ||
                                            '7:00 pm' === this.value ||
                                            '7:30 pm' === this.value ||
                                            '8:00 pm' === this.value ||
                                            '8:30 pm' === this.value
                                        ) {
                                        return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'L2 Voltage',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            //window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'line',
                            data: //last.data,

                            [240, 240, 240, 240, 240, 241, 241, 241, 241, 241, 241, 240, 240, 240, 240, 240, 240, 235, 235, 235, 235, 235, 235, 240, 240, 240, 240, 240, 240, 240, 240, 241, 241, 241, 241, 241, 241, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240
                            ],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0

                        }]
                    });
                });
                // end: power consumption 2

                // begin: power consumption 3
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: 241,//$scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: 236,//$scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumption3').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'], // last.categories, //
                            crosshair: true,
                            labels: {
                                rotation: 0,
                                formatter: function () {
                                    if (
                                            '8:00 am' === this.value ||
                                            '8:30 am' === this.value ||
                                            '9:00 am' === this.value ||
                                            '9:30 am' === this.value ||
                                            '10:00 am' === this.value ||
                                            '10:30 am' === this.value ||
                                            '11:00 am' === this.value ||
                                            '11:30 am' === this.value ||
                                            '12:00 pm' === this.value ||
                                            '12:30 pm' === this.value ||
                                            '1:00 pm' === this.value ||
                                            '1:30 pm' === this.value ||
                                            '2:00 pm' === this.value ||
                                            '2:30 pm' === this.value ||
                                            '3:00 pm' === this.value ||
                                            '3:30 pm' === this.value ||
                                            '4:00 pm' === this.value ||
                                            '4:30 pm' === this.value ||
                                            '5:00 pm' === this.value ||
                                            '5:30 pm' === this.value ||
                                            '6:00 pm' === this.value ||
                                            '6:30 pm' === this.value ||
                                            '7:00 pm' === this.value ||
                                            '7:30 pm' === this.value ||
                                            '8:00 pm' === this.value ||
                                            '8:30 pm' === this.value
                                        ) {
                                        return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'L3 Voltage',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            //window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'line',
                            data: //last.data,

                            [237, 237, 237, 237, 237, 237, 237, 237, 243, 243, 240, 240, 240, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 240, 240, 240, 241, 241, 237, 237, 237, 237, 237, 237, 237, 233, 233, 233, 243, 243, 230, 237, 237, 237, 237
                            ],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0

                        }]
                    });
                });
                // end: power consumption 3

                // begin: power consumption 4
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: 241,//$scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: 236,//$scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumption4').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'], // last.categories, //
                            crosshair: true,
                            labels: {
                                rotation: 0,
                                formatter: function () {
                                    if (
                                            '8:00 am' === this.value ||
                                            '8:30 am' === this.value ||
                                            '9:00 am' === this.value ||
                                            '9:30 am' === this.value ||
                                            '10:00 am' === this.value ||
                                            '10:30 am' === this.value ||
                                            '11:00 am' === this.value ||
                                            '11:30 am' === this.value ||
                                            '12:00 pm' === this.value ||
                                            '12:30 pm' === this.value ||
                                            '1:00 pm' === this.value ||
                                            '1:30 pm' === this.value ||
                                            '2:00 pm' === this.value ||
                                            '2:30 pm' === this.value ||
                                            '3:00 pm' === this.value ||
                                            '3:30 pm' === this.value ||
                                            '4:00 pm' === this.value ||
                                            '4:30 pm' === this.value ||
                                            '5:00 pm' === this.value ||
                                            '5:30 pm' === this.value ||
                                            '6:00 pm' === this.value ||
                                            '6:30 pm' === this.value ||
                                            '7:00 pm' === this.value ||
                                            '7:30 pm' === this.value ||
                                            '8:00 pm' === this.value ||
                                            '8:30 pm' === this.value
                                        ) {
                                        return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'L1 Current',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            //window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'line',
                            data: //last.data,

                            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 9, 9, 18, 18, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 9, 9, 9, 9, 9, 3, 3, 3, 3, 3
                            ],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0

                        }]
                    });
                });
                // end: power consumption 4

                // begin: power consumption 5
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: 241,//$scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: 236,//$scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumption5').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'], // last.categories, //
                            crosshair: true,
                            labels: {
                                rotation: 0,
                                formatter: function () {
                                    if (
                                            '8:00 am' === this.value ||
                                            '8:30 am' === this.value ||
                                            '9:00 am' === this.value ||
                                            '9:30 am' === this.value ||
                                            '10:00 am' === this.value ||
                                            '10:30 am' === this.value ||
                                            '11:00 am' === this.value ||
                                            '11:30 am' === this.value ||
                                            '12:00 pm' === this.value ||
                                            '12:30 pm' === this.value ||
                                            '1:00 pm' === this.value ||
                                            '1:30 pm' === this.value ||
                                            '2:00 pm' === this.value ||
                                            '2:30 pm' === this.value ||
                                            '3:00 pm' === this.value ||
                                            '3:30 pm' === this.value ||
                                            '4:00 pm' === this.value ||
                                            '4:30 pm' === this.value ||
                                            '5:00 pm' === this.value ||
                                            '5:30 pm' === this.value ||
                                            '6:00 pm' === this.value ||
                                            '6:30 pm' === this.value ||
                                            '7:00 pm' === this.value ||
                                            '7:30 pm' === this.value ||
                                            '8:00 pm' === this.value ||
                                            '8:30 pm' === this.value
                                        ) {
                                        return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'L2 Current',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            //window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'line',
                            data: //last.data,

                            [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 25, 25, 45, 45, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0
                            ],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0

                        }]
                    });
                });
                // end: power consumption 5

                // begin: power consumption 6
                $(function () {
                    peakPlotLine = 'peakPlotLine'; // To identify for removal
                    averagePlotLine = 'averagePlotLine'; // To identify for removal

                    // Plot line options for adding
                    peakPlotLineOption = {
                        color: '#9fa7b1',
                        width: 2,
                        value: 241,//$scope.powerUpgradeSummary.LastPeak,
                        label: { text: 'max demand', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: peakPlotLine
                    };
                    averagePlotLineOption = {
                        color: '#ee8176',
                        width: 2,
                        value: 236,//$scope.powerUpgradeSummary.LastAverage,
                        label: { text: 'contract capacity', align: 'right' },
                        zIndex: 4,
                        dashStyle: 'Solid',
                        id: averagePlotLine
                    };


                    $('#armpowerconsumption6').highcharts({
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm'], // last.categories, //
                            crosshair: true,
                            labels: {
                                rotation: 0,
                                formatter: function () {
                                    if (
                                            '8:00 am' === this.value ||
                                            '8:30 am' === this.value ||
                                            '9:00 am' === this.value ||
                                            '9:30 am' === this.value ||
                                            '10:00 am' === this.value ||
                                            '10:30 am' === this.value ||
                                            '11:00 am' === this.value ||
                                            '11:30 am' === this.value ||
                                            '12:00 pm' === this.value ||
                                            '12:30 pm' === this.value ||
                                            '1:00 pm' === this.value ||
                                            '1:30 pm' === this.value ||
                                            '2:00 pm' === this.value ||
                                            '2:30 pm' === this.value ||
                                            '3:00 pm' === this.value ||
                                            '3:30 pm' === this.value ||
                                            '4:00 pm' === this.value ||
                                            '4:30 pm' === this.value ||
                                            '5:00 pm' === this.value ||
                                            '5:30 pm' === this.value ||
                                            '6:00 pm' === this.value ||
                                            '6:30 pm' === this.value ||
                                            '7:00 pm' === this.value ||
                                            '7:30 pm' === this.value ||
                                            '8:00 pm' === this.value ||
                                            '8:30 pm' === this.value
                                        ) {
                                        return '<span style="color: blue; background:gray;">' + this.value + '</span>';
                                    } else {
                                        return this.value;
                                    }
                                }
                            }
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            //plotLines: [peakPlotLineOption, averagePlotLineOption],
                            title: {
                                text: 'L3 Current',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, { // Secondary yAxis
                            title: {
                                text: '',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value:,.0f}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            visible: false
                        }],
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function () {
                                            //alert('Category: ' + this.category + ', value: ' + this.bId);
                                            //window.location.href = "/NewHome/Index#/amrpowerconsumptionblockview/" + this.bId;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            x: 0,
                            y: 0,
                            symbolHeight: 15,
                            symbolWidth: 30,
                            symbolRadius: 0
                        },
                        series: [{
                            name: last.name,
                            type: 'line',
                            data: //last.data,

                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 20, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
                            ],
                            tooltip: {
                                valueSuffix: ' kWh'
                            },
                            color: '#f7a35c',
                            yAxis: 0

                        }]
                    });
                });
                // end: power consumption 6



            });
    }
}])
